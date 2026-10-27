import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapModule } from "../../bootstrap.js";
import { createFlowRuntime } from "./reuse/flow-runtime.js";

function fixture() {
    const runtime = createFlowRuntime();
    const rows = new Map();
    const logs = [];
    const commands = [];
    let failDelete = false;
    runtime.registerFlow({
        id: "deprovision-user",
        stages: ["persist-state", "cleanup-dependencies"],
    });
    runtime.flow.extend(
        "deprovision-user",
        "persist-state",
        { id: "host:persist" },
        ({ input }) => ({ persisted: input.persisted !== false }),
    );
    const database = {
        async ensureTable() {},
        async executeCommand(command) {
            commands.push(command);
            if (command.option === "INSERT")
                rows.set(command.values.id, command.values);
            if (command.option === "DELETE") {
                if (failDelete) throw new Error("database_unavailable");
                for (const [id, row] of rows)
                    if (
                        command.where.every(
                            ({ column, value }) => row[column] === value,
                        )
                    )
                        rows.delete(id);
            }
            return {
                rows: [...rows.values()].filter((row) =>
                    (command.where ?? []).every(
                        ({ column, value }) => row[column] === value,
                    ),
                ),
            };
        },
    };
    function mount() {
        const ownedFlows = [];
        const hooks = [];
        const ctx = {
            registerFlow(flow) {
                runtime.registerFlow(flow);
                ownedFlows.push(flow.id);
            },
            flow: {
                ...runtime.flow,
                extend(flowId, stageId, descriptor, handler) {
                    hooks.push([flowId, stageId, descriptor.id]);
                    return runtime.flow.extend(
                        flowId,
                        stageId,
                        descriptor,
                        handler,
                    );
                },
            },
            getCapability: (name) =>
                name === "db:executor"
                    ? database
                    : name === "auth:requireAuth"
                      ? async (request) => ({ sub: request.account })
                      : undefined,
            router: { get() {}, post() {} },
            registerCapabilityProvider() {},
            registerAdminSection() {},
            log: (...args) => logs.push(args),
        };
        bootstrapModule(ctx);
        return () => {
            for (const hook of hooks) runtime.flow.remove(...hook);
            for (const flowId of ownedFlows) runtime.unregisterFlow(flowId);
        };
    }
    return {
        rows,
        logs,
        commands,
        mount,
        fail: () => {
            failDelete = true;
        },
        async record(account) {
            await runtime.flow.run("analytics:recordActivity", [
                { account },
                {},
                {
                    eventId: "788b4cf9-30e4-424b-87ad-e69f6e319cf7",
                    eventType: "study.flashcards",
                    occurredAt: new Date().toISOString(),
                    meta: { action: "review" },
                },
            ]);
        },
        async recordAnonymous() {
            await runtime.flow.run("analytics:recordEvent", [
                "anonymous",
                "system",
                null,
            ]);
        },
        deprovision: (input) => runtime.flow.run("deprovision-user", input),
    };
}

test("persisted account deletion removes only its authenticated activity digest", async () => {
    const state = fixture();
    const dispose = state.mount();
    await state.record("learner");
    await state.record("other");
    await state.recordAnonymous();
    const other = [...state.rows.values()][1];
    await state.deprovision({ username: "learner", action: "delete" });
    assert.deepEqual(
        [...state.rows.values()],
        [other, state.rows.get("anonymous")],
    );
    assert.equal(state.rows.size, 2);
    assert.equal(
        state.commands.filter(({ option }) => option === "DELETE").length,
        1,
    );
    const deletion = state.commands.find(({ option }) => option === "DELETE");
    assert.equal(deletion.where[0].column, "account_id");
    assert.match(deletion.where[0].value, /^[a-f0-9]{64}$/);
    assert.ok(
        state.logs.some(
            ([level, , meta]) =>
                level === "info" && meta.operation === "deleteAccountActivity",
        ),
    );
    dispose();
});

test("disable, archive, denied deletion and invalid targets retain all activity", async () => {
    const state = fixture();
    const dispose = state.mount();
    await state.record("learner");
    for (const input of [
        { username: "learner", action: "disable" },
        { username: "learner", action: "archive" },
        { username: "learner", action: "delete", persisted: false },
        { action: "delete" },
        { username: "", action: "delete" },
    ])
        await state.deprovision(input);
    assert.equal(state.rows.size, 1);
    assert.equal(
        state.commands.some(({ option }) => option === "DELETE"),
        false,
    );
    dispose();
});

test("cleanup errors propagate with safe logging and preserve records", async () => {
    const state = fixture();
    const dispose = state.mount();
    await state.record("learner");
    state.fail();
    await assert.rejects(
        state.deprovision({ username: "learner", action: "delete" }),
        /database_unavailable/,
    );
    assert.equal(state.rows.size, 1);
    assert.ok(
        state.logs.some(
            ([level, , meta]) =>
                level === "error" && meta.operation === "deleteAccountActivity",
        ),
    );
    dispose();
});

test("scoped host disposal removes cleanup and re-enable installs one fresh handler", async () => {
    const state = fixture();
    for (let cycle = 0; cycle < 2; cycle++) {
        const dispose = state.mount();
        await state.record("learner");
        await state.deprovision({ username: "learner", action: "delete" });
        assert.equal(state.rows.size, 0);
        dispose();
        const before = state.commands.length;
        await state.deprovision({ username: "learner", action: "delete" });
        assert.equal(state.commands.length, before);
    }
    assert.equal(state.logs.filter(([level]) => level === "info").length, 2);
});

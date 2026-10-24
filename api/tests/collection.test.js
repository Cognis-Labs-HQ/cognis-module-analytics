import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { registerApiRoutes } from "../index.js";
import { withActionFlows } from "./reuse/flow-runtime.js";

function fixture({ truncateTimestamp = false } = {}) {
    const rows = new Map();
    const routes = new Map();
    let actor = "learner";
    let allowed = true;
    const database = {
        ensureTable: async () => {},
        async executeCommand(command) {
            if (command.option === "INSERT") {
                if (!rows.has(command.values.id))
                    rows.set(command.values.id, {
                        ...command.values,
                        created_at: truncateTimestamp
                            ? command.values.created_at.replace(
                                  /\.\d{3}Z$/,
                                  "Z",
                              )
                            : command.values.created_at,
                    });
                return {};
            }
            return {
                rows: [...rows.values()].filter((row) =>
                    (command.where ?? []).every(
                        (clause) => row[clause.column] === clause.value,
                    ),
                ),
            };
        },
    };
    const ctx = withActionFlows({
        getCapability: (name) =>
            name === "db:executor"
                ? database
                : name === "auth:requireAuth"
                  ? async (_request, response) => {
                        if (!allowed) {
                            response.writeHead(403);
                            response.end();
                            return null;
                        }
                        return { sub: actor, role: "user" };
                    }
                  : undefined,
    });
    registerApiRoutes(
        {
            get: (path, handler, config) =>
                routes.set(`GET ${path}`, { handler, config }),
            post: (path, handler, config) =>
                routes.set(`POST ${path}`, { handler, config }),
        },
        ctx,
    );
    const route = routes.get("POST /api/v1/modules/analytics/activity");
    return {
        rows,
        ctx,
        route,
        deny: () => {
            allowed = false;
        },
        account: (value) => {
            actor = value;
        },
        async request(input) {
            const request = Readable.from([Buffer.from(JSON.stringify(input))]);
            const response = {
                status: 0,
                writableEnded: false,
                writeHead(status) {
                    this.status = status;
                },
                end(body) {
                    this.writableEnded = true;
                    this.body = body ? JSON.parse(body) : null;
                },
            };
            await route.handler(request, response);
            return response;
        },
    };
}
const activity = () => ({
    eventId: "788b4cf9-30e4-424b-87ad-e69f6e319cf7",
    eventType: "study.flashcards",
    occurredAt: new Date().toISOString(),
    meta: { action: "review", result: "good" },
});

test("replayed authenticated activity retains its event time and is recorded once", async () => {
    const state = fixture();
    const input = activity();
    assert.equal(state.route.config.access.minRole, "user");
    const first = await state.request(input);
    const second = await state.request(input);
    assert.equal(first.status, 201);
    assert.equal(second.body.data.id, first.body.data.id);
    assert.equal(state.rows.size, 1);
    const stored = [...state.rows.values()][0];
    assert.equal(stored.created_at, input.occurredAt);
    assert.notEqual(stored.account_id, "learner");
    assert.ok(
        state.ctx.executions.includes("analytics:recordActivity:authorize"),
    );
    assert.ok(
        state.ctx.executions.includes("analytics:recordActivity:execute"),
    );
    const conflict = await state.request({
        ...input,
        meta: { result: "again" },
    });
    assert.equal(conflict.status, 409);
    assert.equal(state.rows.size, 1);
});

test("authorization, event age, metadata and account partitioning govern queued ingestion", async () => {
    const state = fixture();
    const input = activity();
    assert.equal(
        (await state.request({ ...input, occurredAt: "2000-01-01" })).status,
        400,
    );
    assert.equal(
        (
            await state.request({
                ...input,
                meta: { password: "must-not-be-stored" },
            })
        ).status,
        400,
    );
    assert.equal(state.rows.size, 0);
    assert.equal((await state.request(input)).status, 201);
    state.account("another");
    assert.equal((await state.request(input)).status, 201);
    assert.equal(state.rows.size, 2);
    state.deny();
    assert.equal((await state.request(activity())).status, 403);
    assert.equal(state.rows.size, 2);
});

test("database timestamp precision does not change delivery identity or original event time", async () => {
    const state = fixture({ truncateTimestamp: true });
    const input = activity();
    input.occurredAt = new Date(Date.now() - 1000)
        .toISOString()
        .replace(/\.\d{3}Z$/, ".123Z");
    assert.equal((await state.request(input)).status, 201);
    assert.equal((await state.request(input)).status, 201);
    assert.equal(state.rows.size, 1);
    const stored = [...state.rows.values()][0];
    assert.notEqual(stored.created_at, input.occurredAt);
    assert.equal(stored.occurred_at, input.occurredAt);
});

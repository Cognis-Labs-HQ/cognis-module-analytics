import assert from "node:assert/strict";
import test from "node:test";
import { createActionService } from "../reuse/action-flows.js";
import { createFlowRuntime } from "./reuse/flow-runtime.js";

test("owned API actions validate before persistence and expose ordered ctx stages", async () => {
    const runtime = createFlowRuntime();
    const saved = [];
    const service = createActionService(
        runtime,
        "analytics",
        {
            create: {
                validate: ([value]) => {
                    if (!value) throw new Error("invalid_value");
                },
                execute: (value) => {
                    saved.push(value);
                    return { value };
                },
            },
        },
        Promise.resolve(),
    );
    await assert.rejects(service.create(""), /invalid_value/);
    assert.deepEqual(saved, []);
    assert.deepEqual(await service.create("accepted"), { value: "accepted" });
    assert.deepEqual(runtime.executions.slice(-3), [
        "analytics:create:validate",
        "analytics:create:execute",
        "analytics:create:present",
    ]);
});

test("initialization failure cannot bypass an action flow", async () => {
    const runtime = createFlowRuntime();
    let called = false;
    const ready = Promise.reject(new Error("schema_failed"));
    const service = createActionService(
        runtime,
        "analytics",
        {
            read: {
                execute: () => {
                    called = true;
                },
            },
        },
        ready,
    );
    await assert.rejects(service.read(), /schema_failed/);
    assert.equal(called, false);
});

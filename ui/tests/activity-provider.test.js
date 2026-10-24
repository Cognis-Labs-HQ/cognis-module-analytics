import test from "node:test";
import assert from "node:assert/strict";
import { createFlowRuntime } from "../../api/tests/reuse/flow-runtime.js";

let disconnected = true;
const pending = new Map();
const handlers = new Map();
const requests = [];
const capabilities = new Map();
const outbox = {
    register(owner, send, signal) {
        handlers.set(owner, send);
        const dispose = () => handlers.delete(owner);
        signal.addEventListener("abort", dispose, { once: true });
        return dispose;
    },
    async submit(owner, id, payload) {
        pending.set(`${owner}:${id}`, structuredClone(payload));
        return { queued: true };
    },
};
capabilities.set("offline:outbox", outbox);
capabilities.set("ui:reuse", {
    importModule: async () => ({
        apiFetch: async (path, options) => {
            requests.push({ path, body: JSON.parse(options.body) });
            return Response.json({ data: { id: "stored" } });
        },
        deliverOrQueue: (ctx, owner, id, payload, send) =>
            disconnected
                ? ctx.capabilities
                      .get("offline:outbox")
                      .submit(owner, id, payload)
                : send(payload),
    }),
});
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: { get: (id) => capabilities.get(id) },
};
globalThis.window = new EventTarget();
const { mountProvider } = await import("../activity-provider.js");

test("browser activity participates in registered flows, preserves queued identities and releases its provider", async () => {
    assert.equal(requests.length, 0);
    const runtime = createFlowRuntime();
    runtime.registerFlow({ id: "activity:record", stages: ["capture"] });
    const controller = new AbortController();
    const ctx = {
        signal: controller.signal,
        registerFlow: (id, stages) => runtime.registerFlow({ id, stages }),
        extendFlow: runtime.flow.extend,
        runFlow: runtime.flow.run,
        capabilities: {
            get: (id) => capabilities.get(id),
            contribute: (id, value) => capabilities.set(id, value),
        },
    };
    const dispose = mountProvider(ctx);
    const record = capabilities.get("analytics:recordActivity");
    const id = "788b4cf9-30e4-424b-87ad-e69f6e319cf7";
    const occurredAt = new Date().toISOString();
    await runtime.flow.run("activity:record", {
        id,
        occurredAt,
        type: "study.flashcards",
        meta: { action: "review", result: "good" },
    });
    assert.equal(pending.size, 1);
    assert.equal(requests.length, 0);
    await assert.rejects(
        record("navigation", { password: "not-allowed" }),
        /invalid_activity/,
    );
    assert.equal(pending.size, 1);
    disconnected = false;
    const payload = [...pending.values()][0];
    await handlers.get("analytics.activity")(payload);
    assert.equal(requests[0].body.eventId, id);
    assert.equal(requests[0].body.occurredAt, occurredAt);
    assert.ok(runtime.executions.includes("analytics:recordActivity:validate"));
    assert.ok(runtime.executions.includes("analytics:recordActivity:deliver"));
    controller.abort();
    dispose();
    await assert.rejects(record("navigation"), { name: "AbortError" });
    assert.equal(handlers.size, 0);
});

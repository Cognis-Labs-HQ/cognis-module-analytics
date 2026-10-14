import assert from "node:assert/strict";
import test from "node:test";
import { registerCommands } from "../index.js";

test("installed module commands forward credentials and validate event JSON before writes", async () => {
    const commands = new Map();
    const requests = [];
    registerCommands({
        register: (id, handler) => commands.set(id, handler),
        apiGet: (...args) => requests.push(args),
        apiPost: (...args) => requests.push(args),
    });
    const context = {
        apiBaseUrl: "https://cognis.test",
        getApiToken: async () => "test-token",
        args: ["report", '{"format":"csv"}'],
    };
    const record = commands.get("modules:analytics:activityLog:record");
    await record(context);
    assert.deepEqual(requests.at(-1), [
        "https://cognis.test",
        "/api/v1/modules/analytics/activity-log",
        { eventType: "report", meta: { format: "csv" } },
        "test-token",
    ]);
    const count = requests.length;
    await assert.rejects(
        record({ ...context, args: ["report", "invalid-json"] }),
    );
    assert.equal(requests.length, count);
    await commands.get("modules:analytics:series")({
        ...context,
        args: ["90"],
    });
    assert.equal(
        requests.at(-1)[1],
        "/api/v1/modules/analytics/series?days=90",
    );
});

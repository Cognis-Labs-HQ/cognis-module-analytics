import assert from "node:assert/strict";
import test from "node:test";
import { uninstallModule } from "../bootstrap.js";

function createContext() {
    const commands = [];
    const logs = [];
    const database = {
        async ensureTable() {},
        async executeCommand(command) {
            commands.push(command);
            return {};
        },
    };
    return {
        commands,
        logs,
        getCapability(name) {
            assert.equal(name, "db:executor");
            return database;
        },
        log(level, message, metadata) {
            logs.push({ level, message, metadata });
        },
    };
}

test("uninstallModule deletes module-owned content when requested", async () => {
    const ctx = createContext();

    await uninstallModule(ctx, { deleteContent: true });

    assert.deepEqual(ctx.commands, [
        { option: "DELETE", table: "sample_analytics_events" },
    ]);
    assert.deepEqual(ctx.logs, [
        {
            level: "info",
            message: "Analytics saved data deleted.",
            metadata: {
                component: "analytics",
                operation: "uninstall_cleanup",
                deleteContent: true,
            },
        },
    ]);
});

test("uninstallModule retains module-owned content when requested", async () => {
    const ctx = createContext();

    await uninstallModule(ctx, { deleteContent: false });

    assert.deepEqual(ctx.commands, []);
    assert.deepEqual(ctx.logs, []);
});

import assert from "node:assert/strict";
import test from "node:test";

const styles = [];
const logs = [];
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: (id) =>
            id === "ui:reuse"
                ? {
                      importModule: async (name) => {
                          assert.equal(name, "page-styles.js");
                          return {
                              ensurePageStylesheet: async (href) =>
                                  styles.push(href),
                          };
                      },
                  }
                : (...args) => logs.push(args),
    },
};
const { createAdminSection } = await import("../admin-section.js");

function dependencies(apiFetch, notices = []) {
    return {
        i18n: { t: (key) => key },
        apiFetch,
        escapeHtml: String,
        formatTimestamp: String,
        showToast: (...args) => notices.push(args),
    };
}

test("admin factory loads owned styles through the host and preserves its composer contract", async () => {
    const section = await createAdminSection(
        dependencies(async () => ({
            ok: true,
            json: async () => ({ data: [] }),
        })),
    );
    await section.dataReady;
    assert.equal(
        styles.at(-1),
        "/static/modules/analytics/styles/admin-section.css",
    );
    assert.equal(section.id, "analytics");
    assert.ok(section.subComposerOptions.elements.length > 0);
});

test("failed reports produce host logging and localized feedback", async () => {
    const notices = [];
    const section = await createAdminSection(
        dependencies(async () => {
            throw new Error("transport_failed");
        }, notices),
    );
    await section.dataReady;
    assert.equal(logs.at(-1)[0], "error");
    assert.equal(notices.at(-1)[0], "module.analytics.admin.fetch.failed");
});

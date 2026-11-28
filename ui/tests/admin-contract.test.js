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

class Element extends EventTarget {
    innerHTML = "";
    disabled = false;
}
class Select extends Element {
    value = "30";
}
class Button extends Element {}
globalThis.HTMLElement = Element;
globalThis.HTMLSelectElement = Select;
globalThis.HTMLButtonElement = Button;

function reportRoot() {
    const elements = new Map([
        [".analytics-stats", new Element()],
        [".analytics-chart-wrap", new Element()],
        [".analytics-events-wrap", new Element()],
        [".analytics-event-summary-wrap", new Element()],
        [".analytics-apply", new Button()],
        ['[name="analyticsRange"]', new Select()],
        [".analytics-filter-row", new Element()],
    ]);
    return { querySelector: (selector) => elements.get(selector) };
}

async function reportFixture(context) {
    const { definition } = await import("../tutorials/plays.js");
    const calls = [],
        notices = [];
    let pause = Promise.resolve();
    let failed = false;
    const section = await createAdminSection(
        dependencies(async (path, options) => {
            calls.push({ path, signal: options?.signal });
            await pause;
            const days = Number(
                new URL(path, "http://localhost").searchParams.get("days") ??
                    30,
            );
            const payload = path.includes("/metrics")
                ? { totalUsers: 10, days, roleBreakdown: {} }
                : path.includes("/series")
                  ? [{ date: "2026-11-12", count: days }]
                  : path.includes("/type-summary")
                    ? { total: 0 }
                    : [];
            return { ok: !failed, json: async () => ({ data: payload }) };
        }, notices),
    );
    await section.dataReady;
    const root = reportRoot();
    section.subComposerOptions.onRender(root);
    context.after(() => section.subComposerOptions.onUnmount());
    const controller = new AbortController();
    context.after(() => controller.abort());
    let advanced = false;
    const waiting = definition.steps[0].waitFor({
        target: root.querySelector(".analytics-filter-row"),
        signal: controller.signal,
    });
    void waiting.then(() => {
        advanced = true;
    });
    return {
        section,
        root,
        calls,
        notices,
        controller,
        get advanced() {
            return advanced;
        },
        fail(value) {
            failed = value;
        },
        stall() {
            let release;
            pause = new Promise((resolve) => {
                release = resolve;
            });
            return release;
        },
    };
}

test("the reporting-window exercise waits for Refresh and a completed chart update", async (context) => {
    const state = await reportFixture(context);
    const selector = state.root.querySelector('[name="analyticsRange"]');
    const button = state.root.querySelector(".analytics-apply");
    selector.value = "7";
    selector.dispatchEvent(new Event("change"));
    await new Promise(setImmediate);
    assert.equal(state.calls.length, 4);
    assert.equal(state.advanced, false);
    const release = state.stall();
    button.dispatchEvent(new Event("click"));
    await new Promise(setImmediate);
    assert.equal(state.advanced, false);
    assert.equal(selector.disabled, true);
    assert.equal(button.disabled, true);
    release();
    await new Promise(setImmediate);
    assert.equal(state.advanced, true);
    assert.match(
        state.root.querySelector(".analytics-chart-wrap").innerHTML,
        /2026-11-12: 7/,
    );
    assert.equal(selector.disabled, false);
    assert.equal(button.disabled, false);
});

test("a failed report keeps the exercise waiting and allows a successful retry", async (context) => {
    const state = await reportFixture(context);
    const button = state.root.querySelector(".analytics-apply");
    state.fail(true);
    button.dispatchEvent(new Event("click"));
    await new Promise(setImmediate);
    assert.equal(state.advanced, false);
    assert.equal(button.disabled, false);
    assert.equal(
        state.notices.at(-1)[0],
        "module.analytics.admin.fetch.failed",
    );
    state.fail(false);
    button.dispatchEvent(new Event("click"));
    await new Promise(setImmediate);
    assert.equal(state.advanced, true);
});

test("teardown cancels pending refreshes and removes retained control listeners", async (context) => {
    const state = await reportFixture(context);
    const button = state.root.querySelector(".analytics-apply");
    const release = state.stall();
    button.dispatchEvent(new Event("click"));
    await new Promise(setImmediate);
    state.section.subComposerOptions.onUnmount();
    assert.ok(state.calls.slice(-4).every(({ signal }) => signal.aborted));
    release();
    await new Promise(setImmediate);
    assert.equal(state.advanced, false);
    assert.equal(state.notices.length, 0);
    assert.equal(
        state.root.querySelector(".analytics-chart-wrap").innerHTML,
        "",
    );
    const count = state.calls.length;
    button.dispatchEvent(new Event("click"));
    await new Promise(setImmediate);
    assert.equal(state.calls.length, count);
});

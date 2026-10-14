import { createActionService } from "./reuse/action-flows.js";
import { computeMetrics, computeSeries } from "./reporting/index.js";
import { AnalyticsStore } from "./store.js";
import { registerActivityRoutes } from "./routes/activity/index.js";

export function registerApiRoutes(router, ctx) {
    const database = ctx.getCapability("db:executor");
    const accountStore = ctx.getCapability("auth:accountStore");
    const store = database ? new AnalyticsStore({ db: database }) : null;
    const logFailure = (operation) => {
        ctx.log?.("error", "Analytics operation failed.", {
            component: "analytics",
            operation,
        });
    };

    const ready = store?.ensureSchema();
    ready?.catch(() => logFailure("ensure-schema"));
    const validateDays = ([days]) => {
        if (!Number.isInteger(days) || days < 1 || days > 365)
            throw new Error("invalid_days");
    };
    const service = createActionService(
        ctx,
        "analytics",
        {
            metrics: {
                validate: validateDays,
                execute: (days) => computeMetrics(accountStore, days),
            },
            series: {
                validate: validateDays,
                execute: (days) => computeSeries(accountStore, days),
            },
            summary: {
                validate: validateDays,
                execute: (days) => store.getEventSummary(days),
            },
            recentEvents: {
                validate: ([limit]) => {
                    if (
                        limit !== undefined &&
                        (!Number.isSafeInteger(limit) || limit < 1)
                    )
                        throw new Error("invalid_limit");
                },
                execute: (limit) => store.getRecentEvents(limit),
            },
            recordEvent: {
                validate: ([id, eventType]) => {
                    if (!id || !eventType) throw new Error("invalid_event");
                },
                execute: (...args) => store.recordEvent(...args),
            },
        },
        ready,
    );

    registerActivityRoutes(router, {
        accountStore,
        store,
        service,
        logFailure,
    });
}

export function registerUi(ctx) {
    ctx.registerAdminSection({
        id: "analytics",
        label: "module.analytics.name",
        scriptUrl: "/static/modules/analytics/admin-section.js",
        stringsBaseUrl: "/static/modules/analytics/languages",
        access: { minRole: "admin" },
    });
}

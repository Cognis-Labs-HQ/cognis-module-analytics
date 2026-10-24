import { createHash } from "node:crypto";
import { validateActivity } from "./reuse/activity.js";
import { registerCollectionRoutes } from "./routes/collection/index.js";
import { createActionService } from "./reuse/action-flows.js";
import { computeMetrics, computeSeries } from "./reporting/index.js";
import { AnalyticsStore } from "./store.js";
import { registerActivityRoutes } from "./routes/activity/index.js";

export function registerApiRoutes(router, ctx) {
    const database = ctx.getCapability("db:executor");
    const requireAuth = ctx.getCapability("auth:requireAuth");
    if (typeof requireAuth !== "function")
        throw new Error("authorization_unavailable");
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
            recordActivity: {
                authorize: async ([request, response, input]) => {
                    const claims = await requireAuth(request, response, "user");
                    if (!claims?.sub || response.writableEnded)
                        throw new Error("authorization_required");
                    return [input, String(claims.sub)];
                },
                validate: ([input]) => validateActivity(input),
                execute: (input, account) => {
                    const digest = (value) =>
                        createHash("sha256").update(value).digest("hex");
                    const id = digest(
                        JSON.stringify([
                            account,
                            input.eventType,
                            input.eventId,
                        ]),
                    );
                    return store
                        .recordEvent(
                            id,
                            input.eventType,
                            digest(account),
                            input.meta,
                            input.occurredAt,
                        )
                        .then(() => id);
                },
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

    registerCollectionRoutes(router, { service, logFailure });
    registerActivityRoutes(router, {
        accountStore,
        store,
        service,
        logFailure,
    });
}

export function registerUi(ctx) {
    ctx.registerCapabilityProvider({
        scriptUrl: "/static/modules/analytics/activity-provider.js",
        providesCapabilities: ["analytics:recordActivity"],
    });
    ctx.registerAdminSection({
        id: "analytics",
        label: "module.analytics.name",
        scriptUrl: "/static/modules/analytics/admin-section.js",
        stringsBaseUrl: "/static/modules/analytics/languages",
        access: { minRole: "admin" },
    });
}

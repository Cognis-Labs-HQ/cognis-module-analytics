import { importReuseModule } from "./reuse/resources.js";
const [{ apiFetch }, { deliverOrQueue }] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("offline-delivery.js"),
]);

export function mountProvider(ctx) {
    const outbox = ctx.capabilities.get("offline:outbox");
    if (!outbox) throw new Error("offline_delivery_unavailable");
    const log = ctx.capabilities.get("ui:log");
    const send = async (activity) => {
        const response = await apiFetch("/api/v1/modules/analytics/activity", {
            method: "POST",
            signal: ctx.signal,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(activity),
        });
        if (!response.ok)
            throw Object.assign(new Error("analytics_delivery_failed"), {
                status: response.status,
            });
        if (
            response.redirected ||
            !/\bapplication\/(?:[a-z0-9.-]+\+)?json\b/i.test(
                response.headers.get("content-type") ?? "",
            )
        )
            throw Object.assign(
                new Error("analytics_delivery_invalid_response"),
                { status: 502 },
            );
        let payload;
        try {
            payload = await response.json();
        } catch (error) {
            log?.("error", "Analytics delivery returned invalid JSON.", {
                component: "analytics",
                operation: "parseDeliveryResponse",
                responseStatus: response.status,
            });
            throw Object.assign(
                new Error("analytics_delivery_invalid_response"),
                { status: 502 },
            );
        }
        if (typeof payload?.data?.id !== "string" || !payload.data.id)
            throw Object.assign(
                new Error("analytics_delivery_invalid_response"),
                { status: 502 },
            );
        return payload.data;
    };
    const release = outbox.register("analytics.activity", send, ctx.signal, {
        protectOnClose: false,
    });
    ctx.registerFlow("analytics:recordActivity", ["validate", "deliver"]);
    ctx.extendFlow(
        "analytics:recordActivity",
        "validate",
        { id: "analytics:validateActivity" },
        ({ input }) => {
            const fields = new Set([
                "component",
                "action",
                "result",
                "count",
                "durationMs",
            ]);
            if (
                !/^[a-z][a-z0-9._-]{0,63}$/.test(input.eventType) ||
                !input.meta ||
                typeof input.meta !== "object" ||
                Array.isArray(input.meta) ||
                Object.entries(input.meta).some(
                    ([key, value]) =>
                        !fields.has(key) ||
                        !["string", "number", "boolean"].includes(
                            typeof value,
                        ) ||
                        (typeof value === "string" && value.length > 128) ||
                        (typeof value === "number" && !Number.isFinite(value)),
                )
            )
                throw new Error("invalid_activity");
        },
    );
    ctx.extendFlow(
        "analytics:recordActivity",
        "deliver",
        { id: "analytics:deliverActivity" },
        async ({ input, data }) => {
            data.result = await deliverOrQueue(
                ctx,
                "analytics.activity",
                `${input.eventType}:${input.eventId}`,
                input,
                send,
            );
        },
    );
    const record = async (
        eventType,
        meta = {},
        eventId = crypto.randomUUID(),
        occurredAt = new Date().toISOString(),
    ) => {
        ctx.signal.throwIfAborted();
        const activity = { eventType, meta, eventId, occurredAt };
        return (await ctx.runFlow("analytics:recordActivity", activity)).data
            .result;
    };
    ctx.capabilities.contribute("analytics:recordActivity", record);
    ctx.extendFlow(
        "activity:record",
        "capture",
        { id: "analytics:captureActivity" },
        async ({ input }) => {
            try {
                return await record(
                    input.type,
                    input.meta,
                    input.id,
                    input.occurredAt,
                );
            } catch (error) {
                log?.("error", "Activity capture failed.", {
                    component: "analytics",
                    operation: "captureActivity",
                    errorName: error.name,
                });
            }
        },
    );
    window.addEventListener(
        "cognis:route-will-change",
        () => {
            void record("navigation", {
                component: "ui",
                action: "navigate",
            }).catch((error) =>
                log?.("error", "Navigation activity capture failed.", {
                    component: "analytics",
                    operation: "captureNavigation",
                    errorName: error.name,
                }),
            );
        },
        { signal: ctx.signal },
    );
    return release;
}

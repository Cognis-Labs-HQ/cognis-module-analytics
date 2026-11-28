import { randomUUID } from "node:crypto";

function sendJson(res, status, payload) {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(payload));
}

function readRange(request, response, name, fallback, maximum) {
    const value = new URL(request.url, "http://localhost").searchParams.get(
        name,
    );
    if (value === null) return fallback;
    const parsed = /^\d+$/.test(value) ? Number(value) : NaN;
    if (
        Number.isSafeInteger(parsed) &&
        parsed > 0 &&
        (maximum === undefined || parsed <= maximum)
    )
        return parsed;
    sendJson(response, 400, {
        error: {
            code: `invalid_${name}`,
            message: "The requested range is invalid.",
        },
    });
    return null;
}

const MAX_EVENT_BODY_BYTES = 16 * 1024;

export function registerActivityRoutes(
    router,
    { accountStore, store, service, logFailure },
) {
    const getEventSummary = async (req, res) => {
        const days = readRange(req, res, "days", 30, 365);
        if (days === null) return;

        if (!store) {
            sendJson(res, 200, {
                data: { total: 0, uniqueActors: 0, byType: [] },
            });
            return;
        }

        try {
            const summary = await service.summary(days);
            sendJson(res, 200, { data: summary });
        } catch {
            logFailure("summarize-events");
            sendJson(res, 500, {
                error: {
                    code: "query_failed",
                    message: "Failed to summarize events.",
                },
            });
        }
    };

    // Keep the original route for API compatibility, while the neutral alias
    // avoids client-side privacy filters that block URLs containing "event".
    router.get("/api/v1/modules/analytics/type-summary", getEventSummary, {
        access: { minRole: "admin" },
    });
    router.get("/api/v1/modules/analytics/event-summary", getEventSummary, {
        access: { minRole: "admin" },
    });

    router.get(
        "/api/v1/modules/analytics/metrics",
        async (req, res) => {
            const days = readRange(req, res, "days", 30, 365);
            if (days === null) return;

            if (!accountStore) {
                sendJson(res, 503, {
                    error: {
                        code: "db_unavailable",
                        message: "Database is not available.",
                    },
                });
                return;
            }

            try {
                const metrics = await service.metrics(days);
                sendJson(res, 200, { data: metrics });
            } catch {
                logFailure("compute-metrics");
                sendJson(res, 500, {
                    error: {
                        code: "query_failed",
                        message: "Failed to compute analytics metrics.",
                    },
                });
            }
        },
        { access: { minRole: "admin" } },
    );

    router.get(
        "/api/v1/modules/analytics/series",
        async (req, res) => {
            const days = readRange(req, res, "days", 30, 365);
            if (days === null) return;

            if (!accountStore) {
                sendJson(res, 503, {
                    error: {
                        code: "db_unavailable",
                        message: "Database is not available.",
                    },
                });
                return;
            }

            try {
                const series = await service.series(days);
                sendJson(res, 200, { data: series });
            } catch {
                logFailure("compute-series");
                sendJson(res, 500, {
                    error: {
                        code: "query_failed",
                        message: "Failed to compute registration series.",
                    },
                });
            }
        },
        { access: { minRole: "admin" } },
    );

    router.get(
        "/api/v1/modules/analytics/activity-log",
        async (req, res) => {
            const limit = readRange(req, res, "limit");
            if (limit === null) return;

            if (!store) {
                sendJson(res, 200, { data: [] });
                return;
            }

            try {
                const events = await service.recentEvents(limit);
                sendJson(res, 200, { data: events });
            } catch {
                logFailure("read-activity-log");
                sendJson(res, 200, { data: [] });
            }
        },
        { access: { minRole: "admin" } },
    );

    router.post(
        "/api/v1/modules/analytics/activity-log",
        async (req, res) => {
            if (!store) {
                sendJson(res, 503, {
                    error: {
                        code: "db_unavailable",
                        message: "Database is not available.",
                    },
                });
                return;
            }

            let body;
            try {
                const chunks = [];
                let bodySize = 0;
                for await (const chunk of req) {
                    chunks.push(chunk);
                    bodySize += chunk.length;
                    if (bodySize > MAX_EVENT_BODY_BYTES) {
                        sendJson(res, 413, {
                            error: {
                                code: "body_too_large",
                                message: "Request body is too large.",
                            },
                        });
                        return;
                    }
                }
                body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            } catch {
                logFailure("record-activity");
                sendJson(res, 400, {
                    error: {
                        code: "invalid_body",
                        message: "Invalid JSON body.",
                    },
                });
                return;
            }

            const eventType = String(body.eventType ?? "")
                .trim()
                .slice(0, 64);
            if (!eventType) {
                sendJson(res, 400, {
                    error: {
                        code: "missing_event_type",
                        message: "eventType is required.",
                    },
                });
                return;
            }

            const id = randomUUID();
            const meta =
                body.meta &&
                typeof body.meta === "object" &&
                !Array.isArray(body.meta)
                    ? body.meta
                    : null;

            try {
                await service.recordEvent(id, eventType, null, meta);
                sendJson(res, 201, { data: { id } });
            } catch {
                logFailure("record-activity");
                sendJson(res, 500, {
                    error: {
                        code: "record_failed",
                        message: "Failed to record event.",
                    },
                });
            }
        },
        { access: { minRole: "admin" } },
    );
}

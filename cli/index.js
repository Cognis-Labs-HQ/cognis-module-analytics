export function registerCommands({ register, apiGet, apiPost }) {
    register(
        "modules:analytics:metrics",
        async ({ apiBaseUrl, getApiToken }) => {
            return apiGet(
                apiBaseUrl,
                "/api/v1/modules/analytics/metrics",
                await getApiToken(),
            );
        },
        {
            usage: "cognisctl modules:analytics:metrics",
            description: "Show analytics metrics from module API.",
        },
    );
    registerActivityCommands({ register, apiGet, apiPost });
}

export function registerActivityCommands({ register, apiGet, apiPost }) {
    register(
        "modules:analytics:series",
        async ({ args, apiBaseUrl, getApiToken }) => {
            const days = args[0] ? `?days=${encodeURIComponent(args[0])}` : "";
            return apiGet(
                apiBaseUrl,
                `/api/v1/modules/analytics/series${days}`,
                await getApiToken(),
            );
        },
        {
            usage: "cognisctl modules:analytics:series [days]",
            description: "Show analytics registration series from module API.",
        },
    );

    register(
        "modules:analytics:activityLog",
        async ({ args, apiBaseUrl, getApiToken }) => {
            const limit = args[0]
                ? `?limit=${encodeURIComponent(args[0])}`
                : "";
            return apiGet(
                apiBaseUrl,
                `/api/v1/modules/analytics/activity-log${limit}`,
                await getApiToken(),
            );
        },
        {
            usage: "cognisctl modules:analytics:activityLog [limit]",
            description:
                "Show recent analytics activity events from module API.",
        },
    );

    register(
        "modules:analytics:eventSummary",
        async ({ args, apiBaseUrl, getApiToken }) => {
            const days = args[0] ? `?days=${encodeURIComponent(args[0])}` : "";
            return apiGet(
                apiBaseUrl,
                `/api/v1/modules/analytics/event-summary${days}`,
                await getApiToken(),
            );
        },
        {
            usage: "cognisctl modules:analytics:eventSummary [days]",
            description:
                "Summarize event volume and unique actors by event type.",
        },
    );

    register(
        "modules:analytics:activityLog:record",
        async ({ args, apiBaseUrl, getApiToken }) => {
            if (!args[0]) {
                throw new Error(
                    "Not enough arguments (missing: event-type)\n\nUsage:\n  cognisctl modules:analytics:activityLog:record <event-type> [meta-json]",
                );
            }
            const meta = args[1] ? JSON.parse(args[1]) : null;
            return apiPost(
                apiBaseUrl,
                "/api/v1/modules/analytics/activity-log",
                { eventType: args[0], meta },
                await getApiToken(),
            );
        },
        {
            usage: "cognisctl modules:analytics:activityLog:record <event-type> [meta-json]",
            description:
                "Record an analytics activity event through the module API.",
        },
    );
}

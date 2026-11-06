export const definition = {
    version: 1,
    page: ({ pathname }) =>
        pathname === "/administration" &&
        [...document.querySelectorAll(".analytics-filter-row")].some(
            (element) => element.getClientRects().length > 0,
        ),
    id: "introduction",
    titleKey: "module.analytics.tutorial.title",
    steps: [
        {
            highlightNext: true,
            id: "welcome",
            titleKey: "module.analytics.tutorial.welcome.title",
            bodyKey: "module.analytics.tutorial.welcome.body",
            effects: {
                callout: true,
                arrow: false,
                spotlight: false,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            route: "/administration",
        },
        {
            highlightNext: false,
            id: "filters",
            titleKey: "module.analytics.tutorial.filters.title",
            bodyKey: "module.analytics.tutorial.filters.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            target: "filters",
            interaction: "target",
            advance: {
                event: "change",
            },
        },
        {
            highlightNext: true,
            id: "chart",
            titleKey: "module.analytics.tutorial.chart.title",
            bodyKey: "module.analytics.tutorial.chart.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            target: "chart",
        },
    ],
};

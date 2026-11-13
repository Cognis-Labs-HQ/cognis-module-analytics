import { definition } from "./plays.js";

/** Register only through the host's public tutorial and resource contracts. */
export async function mountProvider(ctx) {
    const api = ctx.capabilities.get("ui:tutorials");
    if (api?.version !== 1) throw new Error("tutorial_contract_unavailable");
    const reuse = ctx.capabilities.get("ui:reuse");
    const owner = api.owner("module.analytics", {
        signal: ctx.signal,
        stringsBaseUrls: ["/static/modules/analytics/languages"],
    });
    try {
        const targets = {};
        for (const [name, selector] of Object.entries({
            filters: ".analytics-filter-row",
            chart: ".analytics-chart-section",
        })) {
            targets[name] = (
                await owner.target(name, {
                    resolve: () => {
                        const matches = document.querySelectorAll(selector);
                        return matches.length === 1 ? matches[0] : null;
                    },
                })
            ).id;
        }
        const { isAdminScope } = await reuse.importModule("access-role.js");
        const play = await owner.register({
            ...definition,
            available: () =>
                isAdminScope() &&
                ctx.capabilities.get("session:isAuthenticated")?.() === true &&
                ctx.capabilities.get("offline:state")?.isOffline() !== true,
            requires: ["ui:navigate"],
            steps: definition.steps.map((step) => ({
                ...step,
                ...(step.target ? { target: targets[step.target] } : {}),
            })),
        });
        ctx.capabilities.contribute("analytics:tutorials", play);
        return owner.dispose;
    } catch (error) {
        owner.dispose();
        throw error;
    }
}

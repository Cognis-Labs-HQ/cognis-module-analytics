import { registerApiRoutes, registerUi } from "./api/index.js";
import { AnalyticsStore } from "./api/store.js";

export async function uninstallModule(ctx, { deleteContent }) {
    if (!deleteContent) return;

    const store = new AnalyticsStore({
        db: ctx.getCapability("db:executor"),
    });
    await store.ensureSchema();
    await store.deleteAllData();
    ctx.log?.("info", "Analytics saved data deleted.", {
        component: "analytics",
        operation: "uninstall_cleanup",
        deleteContent,
    });
}

export function bootstrapModule(ctx) {
    registerUi(ctx);
    registerApiRoutes(ctx.router, ctx);
}

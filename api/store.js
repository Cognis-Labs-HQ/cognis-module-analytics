const ANALYTICS_EVENTS_TABLE = "sample_analytics_events";

/**
 * Persistence layer for the Analytics module.
 *
 * Manages the analytics events table via the structured DbExecutor abstraction.
 * The accounts table is queried directly in route handlers; this store only
 * manages custom event records contributed by the analytics module itself.
 *
 * @param {{
 *   db: {
 *     ensureTable: (def: object) => Promise<void>,
 *     executeCommand: (command: object) => Promise<{ rows?: Array<Record<string, unknown>> }>,
 *   },
 * }} options
 */
export class AnalyticsStore {
    constructor({ db }) {
        this.db = db;
    }

    async ensureSchema() {
        await this.db.ensureTable({
            name: ANALYTICS_EVENTS_TABLE,
            columns: [
                { name: "id", type: "text", primaryKey: true },
                { name: "event_type", type: "text", notNull: true },
                { name: "account_id", type: "text" },
                { name: "meta", type: "text" },
                {
                    name: "created_at",
                    type: "timestamp",
                    notNull: true,
                    default: "now",
                },
            ],
            indexes: [{ columns: ["created_at"] }],
        });
    }

    async recordEvent(id, eventType, accountId = null, meta = null) {
        await this.db.executeCommand({
            option: "INSERT",
            table: ANALYTICS_EVENTS_TABLE,
            values: {
                id,
                event_type: eventType,
                account_id: accountId ?? null,
                meta: meta !== null ? JSON.stringify(meta) : null,
                created_at: new Date().toISOString(),
            },
        });
    }

    async getRecentEvents(limit = 50) {
        const result = await this.db.executeCommand({
            option: "SELECT",
            table: ANALYTICS_EVENTS_TABLE,
            columns: ["id", "event_type", "account_id", "created_at"],
            orderBy: [{ column: "created_at", direction: "DESC" }],
            limit,
        });
        return result.rows ?? [];
    }

    async getEventSummary(days = 30) {
        const cutoff = new Date(
            Date.now() - days * 24 * 60 * 60 * 1000,
        ).toISOString();
        const result = await this.db.executeCommand({
            option: "SELECT",
            table: ANALYTICS_EVENTS_TABLE,
            columns: ["event_type", "account_id", "created_at"],
            where: [{ column: "created_at", operator: ">=", value: cutoff }],
        });
        const rows = result.rows ?? [];
        const counts = new Map();
        const actors = new Set();
        for (const row of rows) {
            const type = String(row.event_type ?? "unknown");
            counts.set(type, (counts.get(type) ?? 0) + 1);
            if (row.account_id) actors.add(String(row.account_id));
        }
        return {
            total: rows.length,
            uniqueActors: actors.size,
            byType: [...counts.entries()]
                .map(([type, count]) => ({ type, count }))
                .sort(
                    (left, right) =>
                        right.count - left.count ||
                        left.type.localeCompare(right.type),
                ),
        };
    }
}

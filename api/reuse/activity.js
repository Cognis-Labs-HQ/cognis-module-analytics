const META_FIELDS = new Set([
    "component",
    "action",
    "result",
    "count",
    "durationMs",
]);

export function validateActivity(input, now = Date.now()) {
    if (
        !input ||
        typeof input !== "object" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            input.eventId,
        ) ||
        typeof input.eventType !== "string" ||
        !/^[a-z][a-z0-9._-]{0,63}$/.test(input.eventType)
    )
        throw new Error("invalid_activity");
    const occurredAt = Date.parse(input.occurredAt);
    if (
        !Number.isFinite(occurredAt) ||
        occurredAt > now + 300_000 ||
        occurredAt < now - 7 * 24 * 60 * 60 * 1000
    )
        throw new Error("invalid_activity");
    if (
        !input.meta ||
        typeof input.meta !== "object" ||
        Array.isArray(input.meta) ||
        Object.entries(input.meta).some(
            ([key, value]) =>
                !META_FIELDS.has(key) ||
                !["string", "number", "boolean"].includes(typeof value) ||
                (typeof value === "string" && value.length > 128) ||
                (typeof value === "number" && !Number.isFinite(value)),
        )
    )
        throw new Error("invalid_activity");
}

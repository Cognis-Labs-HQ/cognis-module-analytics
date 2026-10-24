export function registerCollectionRoutes(router, { service, logFailure }) {
    router.post(
        "/api/v1/modules/analytics/activity",
        async (request, response) => {
            try {
                const chunks = [];
                let bytes = 0;
                for await (const chunk of request) {
                    bytes += chunk.length;
                    if (bytes > 8192)
                        throw Object.assign(new Error("activity_too_large"), {
                            status: 413,
                        });
                    chunks.push(chunk);
                }
                let input;
                try {
                    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
                } catch (error) {
                    throw Object.assign(new Error("invalid_activity"), {
                        status: 400,
                    });
                }
                const id = await service.recordActivity(
                    request,
                    response,
                    input,
                );
                if (!response.writableEnded) {
                    response.writeHead(201, {
                        "content-type": "application/json",
                    });
                    response.end(JSON.stringify({ data: { id } }));
                }
            } catch (error) {
                if (response.writableEnded) return;
                logFailure("collect-activity");
                const status =
                    error.status ??
                    (error.message === "activity_conflict"
                        ? 409
                        : error.message === "invalid_activity"
                          ? 400
                          : error.message === "authorization_required"
                            ? 401
                            : 500);
                response.writeHead(status, {
                    "content-type": "application/json",
                });
                response.end(
                    JSON.stringify({
                        error: {
                            code:
                                status === 500
                                    ? "internal_error"
                                    : error.message,
                        },
                    }),
                );
            }
        },
        { access: { minRole: "user" } },
    );
}

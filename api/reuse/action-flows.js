export function createActionService(ctx, moduleId, operations, ready) {
    const service = {};
    for (const [action, operation] of Object.entries(operations)) {
        const flowId = `${moduleId}:${action}`;
        ctx.registerFlow({
            id: flowId,
            stages: [
                ...(operation.authorize ? ["authorize"] : []),
                ...(operation.validate ? ["validate"] : []),
                "execute",
                "present",
            ],
        });
        if (operation.authorize)
            ctx.flow.extend(
                flowId,
                "authorize",
                { id: `${flowId}.authorize` },
                async (stage) => {
                    stage.data.authorizedInput = await operation.authorize(
                        stage.input,
                    );
                },
            );
        if (operation.validate)
            ctx.flow.extend(
                flowId,
                "validate",
                { id: `${flowId}.validate` },
                ({ input, data }) => {
                    operation.validate(data.authorizedInput ?? input);
                },
            );
        ctx.flow.extend(
            flowId,
            "execute",
            { id: `${flowId}.execute` },
            async (stage) => {
                await ready;
                stage.data.result = await operation.execute(
                    ...(stage.data.authorizedInput ?? stage.input),
                );
            },
        );
        ctx.flow.extend(
            flowId,
            "present",
            { id: `${flowId}.present` },
            (stage) => stage.data.result,
        );
        service[action] = async (...input) =>
            (await ctx.flow.run(flowId, input)).data.result;
    }
    return service;
}

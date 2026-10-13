export function createActionService(ctx, moduleId, operations, ready) {
    const service = {};
    for (const [action, operation] of Object.entries(operations)) {
        const flowId = `${moduleId}:${action}`;
        ctx.registerFlow({
            id: flowId,
            stages: [
                ...(operation.validate ? ["validate"] : []),
                "execute",
                "present",
            ],
        });
        if (operation.validate)
            ctx.flow.extend(
                flowId,
                "validate",
                { id: `${flowId}.validate` },
                ({ input }) => {
                    operation.validate(input);
                },
            );
        ctx.flow.extend(
            flowId,
            "execute",
            { id: `${flowId}.execute` },
            async (stage) => {
                await ready;
                stage.data.result = await operation.execute(...stage.input);
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

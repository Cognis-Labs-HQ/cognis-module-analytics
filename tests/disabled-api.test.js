import assert from "node:assert/strict";
import test from "node:test";
import { registerDisabledApiRoutes } from "../api/disabled.js";

test("disabled lifecycle registers no runtime routes or capabilities", () => {
    const context = new Proxy(
        {},
        {
            get(_target, property) {
                assert.fail(
                    `disabled lifecycle accessed unexpected context property ${String(property)}`,
                );
            },
        },
    );

    assert.equal(registerDisabledApiRoutes(context), undefined);
});

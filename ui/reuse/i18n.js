import { importReuseModule } from "./resources.js";

export async function extendI18n(baseI18n, stringsBaseUrl) {
    const { extendI18n: extend } = await importReuseModule("i18n.js");
    return extend(baseI18n, stringsBaseUrl);
}

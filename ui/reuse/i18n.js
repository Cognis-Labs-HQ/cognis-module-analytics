const SUPPORTED_LANGUAGES = ["de", "en", "id", "ja"];

function preferredLanguage() {
    const language = String(navigator.language ?? "en")
        .toLowerCase()
        .split("-")[0];
    return SUPPORTED_LANGUAGES.includes(language) ? language : "en";
}

function parseStrings(xml) {
    const document = new DOMParser().parseFromString(xml, "application/xml");
    return new Map(
        [...document.querySelectorAll("string[name]")].map((entry) => [
            entry.getAttribute("name"),
            entry.textContent ?? "",
        ]),
    );
}

export async function extendI18n(baseI18n, stringsBaseUrl) {
    const response = await fetch(
        `${stringsBaseUrl}/${preferredLanguage()}/strings.xml`,
    );
    if (!response.ok) return baseI18n;
    const strings = parseStrings(await response.text());
    return {
        t(key) {
            return strings.get(key) ?? baseI18n.t(key);
        },
    };
}

export function formatTemplate(template, values) {
    if (typeof template !== "string") return "";
    return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
        const replacement = values?.[key];
        return replacement == null ? match : String(replacement);
    });
}

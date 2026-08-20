import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const LANGUAGES = ["de", "en", "id", "ja"];

function strings(language) {
    const xml = readFileSync(
        resolve(ROOT, `ui/languages/${language}/strings.xml`),
        "utf8",
    );
    return new Map(
        [...xml.matchAll(/<string name="([^"]+)">([^<]*)<\/string>/g)].map(
            (match) => [match[1], match[2]],
        ),
    );
}

test("localized resources keep matching key sets", () => {
    const englishKeys = [...strings("en").keys()].sort();
    for (const language of LANGUAGES.filter((entry) => entry !== "en")) {
        assert.deepEqual([...strings(language).keys()].sort(), englishKeys);
    }
});

test("localized resource keys use the analytics namespace", () => {
    for (const language of LANGUAGES) {
        for (const key of strings(language).keys()) {
            assert.match(key, /^module\.analytics\.[a-z0-9._-]+$/);
        }
    }
});

test("English title resources use Title Case", () => {
    const violations = [];
    for (const [key, value] of strings("en")) {
        if (!key.endsWith("_title") && !key.endsWith(".title")) continue;
        const valid = value
            .split(/\s+/)
            .filter(Boolean)
            .every((word) => {
                const text = word
                    .replace(/^[^A-Za-z]*/, "")
                    .replace(/[^A-Za-z]*$/, "");
                return !text || text[0] === text[0].toUpperCase();
            });
        if (!valid) violations.push(`${key}: ${value}`);
    }
    assert.deepEqual(violations, []);
});

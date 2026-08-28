import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATE = resolve(ROOT, ".github/DOCUMENTATION_TEMPLATE.en.md");
const LANGUAGES = ["de", "en", "id", "ja"];

function markdownFiles(directory) {
    return readdirSync(directory).flatMap((name) => {
        const path = resolve(directory, name);
        if (statSync(path).isDirectory()) return markdownFiles(path);
        return name.endsWith(".md") ? [path] : [];
    });
}

function headingLevels(path) {
    return readFileSync(path, "utf8")
        .split("\n")
        .filter((line) => /^#{1,6} /.test(line))
        .map((line) => line.match(/^#+/)[0].length);
}

test("documentation follows the hidden heading convention", () => {
    const expected = headingLevels(TEMPLATE).slice(0, 3);
    const violations = markdownFiles(resolve(ROOT, "docs"))
        .filter((path) => !path.includes(`${resolve(ROOT, "docs/changelog")}/`))
        .flatMap((path) => {
            const actual = headingLevels(path).slice(0, expected.length);
            return actual.length === expected.length &&
                actual.every((level, index) => level === expected[index])
                ? []
                : [relative(ROOT, path)];
        });
    assert.deepEqual(violations, []);
});

test("localized changelogs follow the release feed structure", () => {
    const directory = resolve(ROOT, "docs/changelog");
    const changelogs = markdownFiles(directory);
    for (const path of changelogs) {
        const markdown = readFileSync(path, "utf8");
        const language = /\.(de|en|id|ja)\.md$/.exec(path)?.[1];
        const branchLabels = {
            de: "Feature-Zweig",
            en: "Feature Branch",
            id: "Cabang Fitur",
            ja: "機能ブランチ",
        };
        const commitHeadings = {
            de: "Änderungen",
            en: "Commits",
            id: "Commit",
            ja: "コミット",
        };
        assert.ok(language, relative(ROOT, path));
        assert.match(markdown, /^# .+\n\n\*\*[^*]+:\*\* .+\n/);
        assert.ok(
            markdown.includes(`**${branchLabels[language]}:**`),
            relative(ROOT, path),
        );
        assert.ok(
            markdown.includes(`## ${commitHeadings[language]}`),
            relative(ROOT, path),
        );
        assert.match(
            markdown,
            /- \[[0-9a-f]{7}\]\(https:\/\/github\.com\/Cognis-Labs-HQ\/cognis-module-analytics\/commit\/[0-9a-f]{40}\)/,
        );
        const changeSections = markdown
            .split(/^## /m)
            .slice(1, -1)
            .map((section) => section.trim());
        assert.ok(changeSections.length > 0, relative(ROOT, path));
        assert.ok(
            changeSections.every((section) => section.includes("\n\n")),
            relative(ROOT, path),
        );
    }
});

test("documentation templates exist for every supported language", () => {
    const expected = headingLevels(TEMPLATE);
    for (const language of LANGUAGES) {
        const template = resolve(
            ROOT,
            `.github/DOCUMENTATION_TEMPLATE.${language}.md`,
        );
        assert.ok(statSync(template).isFile());
        assert.deepEqual(headingLevels(template), expected);
    }
});

test("every documentation topic has one variant per supported language", () => {
    const documents = markdownFiles(resolve(ROOT, "docs"));
    const families = new Map();
    for (const path of documents) {
        const relativePath = relative(resolve(ROOT, "docs"), path);
        const match = /^(.*)\.(de|en|id|ja)\.md$/.exec(relativePath);
        assert.ok(
            match,
            `${relative(ROOT, path)} must include a language suffix`,
        );
        const [, topic, language] = match;
        const variants = families.get(topic) ?? new Set();
        variants.add(language);
        families.set(topic, variants);
    }
    for (const [topic, variants] of families) {
        assert.deepEqual([...variants].sort(), [...LANGUAGES].sort(), topic);
    }
});

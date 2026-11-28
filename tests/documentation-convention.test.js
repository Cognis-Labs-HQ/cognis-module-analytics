import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATE = resolve(ROOT, ".github/documentation/TECHNICAL.en.md");
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

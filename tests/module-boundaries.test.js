import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import test from "node:test";
import { formatDateTime } from "../ui/reuse/timestamp.js";

const ROOT = resolve(import.meta.dirname, "..");

async function runtimeSourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) return runtimeSourceFiles(path);
            return extname(path) === ".js" ? [path] : [];
        }),
    );
    return files.flat();
}

test("runtime sources address only the analytics API namespace", async () => {
    const sourceFiles = (
        await Promise.all(
            ["api", "bootstrap.js", "cli", "ui"].map(async (path) => {
                const absolutePath = resolve(ROOT, path);
                return extname(absolutePath) === ".js"
                    ? [absolutePath]
                    : runtimeSourceFiles(absolutePath);
            }),
        )
    ).flat();
    const violations = [];

    for (const path of sourceFiles) {
        const source = await readFile(path, "utf8");
        for (const match of source.matchAll(
            /\/api\/v1\/modules\/([^/"'`?]+)/g,
        )) {
            if (match[1] !== "analytics") {
                violations.push(`${relative(ROOT, path)}: ${match[0]}`);
            }
        }
    }

    assert.deepEqual(violations, []);
});

test("browser modules use repository-relative runtime imports", async () => {
    for (const path of ["ui/admin-section.js", "ui/dashboard-element.js"]) {
        const source = await readFile(path, "utf8");
        assert.doesNotMatch(source, /from\s+['"]\/static\//);
    }
});

test("all locale bundles contain the same analytics keys", async () => {
    const locales = ["de", "en", "id", "ja"];
    const keySets = await Promise.all(
        locales.map(async (locale) => {
            const xml = await readFile(
                `ui/languages/${locale}/strings.xml`,
                "utf8",
            );
            return [...xml.matchAll(/<string name="([^"]+)"/g)].map(
                (match) => match[1],
            );
        }),
    );
    for (const keys of keySets.slice(1)) assert.deepEqual(keys, keySets[0]);
});

test("admin dashboard uses the privacy-filter-safe summary route", async () => {
    const source = await readFile("ui/admin-section.js", "utf8");
    assert.match(source, /\/analytics\/type-summary\?days=/);
    assert.doesNotMatch(source, /\/analytics\/event-summary\?days=/);
});

test("timestamp formatting delegates to the host formatter", () => {
    const value = "2026-08-20T12:30:00.000Z";
    const calls = [];
    const formatted = formatDateTime(value, (timestamp) => {
        calls.push(timestamp);
        return "host-formatted timestamp";
    });

    assert.equal(formatted, "host-formatted timestamp");
    assert.deepEqual(calls, [value]);
});

test("timestamp formatting rejects invalid boundary values", () => {
    assert.equal(
        formatDateTime("not-a-date", () => "unexpected", "Unknown"),
        "Unknown",
    );
});

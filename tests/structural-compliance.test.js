import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
    lstatSync,
    readlinkSync,
    readdirSync,
    readFileSync,
    statSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const SCAN_ROOTS = ["api", "ui", "cli", "scripts", "tooling", "tests"]
    .map((path) => resolve(ROOT, path))
    .filter((path) => statSync(path).isDirectory());
const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".css", ".html"]);

function walk(directory) {
    return readdirSync(directory).flatMap((name) => {
        if (name === "node_modules" || name === ".git") return [];
        const path = join(directory, name);
        return statSync(path).isDirectory() ? walk(path) : [path];
    });
}

function sourceFiles() {
    return SCAN_ROOTS.flatMap(walk).filter((path) =>
        [...SOURCE_EXTENSIONS].some((extension) => path.endsWith(extension)),
    );
}

test("AGENTS.md resolves to the Copilot instruction source", () => {
    const agentsPath = resolve(ROOT, "AGENTS.md");
    assert.ok(lstatSync(agentsPath).isSymbolicLink());
    assert.equal(readlinkSync(agentsPath), ".github/copilot-instructions.md");
});

test("source files stay under the 1000-line guardrail", () => {
    const violations = sourceFiles().flatMap((path) => {
        const lines = readFileSync(path, "utf8").split("\n").length;
        return lines > 1000 ? [`${relative(ROOT, path)} (${lines} lines)`] : [];
    });
    assert.deepEqual(violations, []);
});

test("source tree avoids ambiguous utility directory names", () => {
    const forbidden = new Set(["shared", "utils", "helpers", "common"]);
    const violations = SCAN_ROOTS.flatMap((root) =>
        walk(root)
            .map((path) => relative(ROOT, path).split(/[\\/]/))
            .filter((parts) => parts.some((part) => forbidden.has(part)))
            .map((parts) => parts.join("/")),
    );
    assert.deepEqual(violations, []);
});

test("module source does not import Cognis component internals", () => {
    const violations = sourceFiles().flatMap((path) => {
        const source = readFileSync(path, "utf8");
        return /(?:\/static\/(?:gateways|adapters)\/|src\/(?:gateways|adapters)\/)/.test(
            source,
        )
            ? [relative(ROOT, path)]
            : [];
    });
    assert.deepEqual(violations, []);
});

test("CSS source contains no comments", () => {
    const violations = sourceFiles()
        .filter((path) => path.endsWith(".css"))
        .filter((path) => /\/\*[\s\S]*?\*\//.test(readFileSync(path, "utf8")))
        .map((path) => relative(ROOT, path));
    assert.deepEqual(violations, []);
});

test("manifest component dependencies use UUID references", () => {
    const manifest = JSON.parse(readFileSync(resolve(ROOT, "manifest.json")));
    const uuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    assert.ok(
        (manifest.requires ?? []).every((reference) => uuid.test(reference)),
    );
});

test("external module metadata and declared files are consistent", () => {
    const manifest = JSON.parse(readFileSync(resolve(ROOT, "manifest.json")));
    const packageJson = JSON.parse(readFileSync(resolve(ROOT, "package.json")));
    const packageLock = JSON.parse(
        readFileSync(resolve(ROOT, "package-lock.json")),
    );
    const routes = JSON.parse(readFileSync(resolve(ROOT, "routes.json")));

    assert.equal(manifest.version, packageJson.version);
    assert.equal(manifest.version, packageLock.version);
    assert.equal(manifest.entrypoints.api, "./api/index.js");
    assert.equal(manifest.entrypoints.disabledApi, "./api/disabled.js");
    assert.ok(Array.isArray(routes));
    for (const entrypoint of Object.values(manifest.entrypoints)) {
        assert.ok(statSync(resolve(ROOT, entrypoint)).isFile());
    }
    const packagedPaths = new Set(manifest.files.map((file) => file.path));
    for (const asset of [manifest.assets.icon, manifest.assets.banner]) {
        assert.ok(!asset.startsWith("/") && !asset.includes(".."), asset);
        assert.ok(statSync(resolve(ROOT, asset)).isFile(), asset);
        assert.ok(packagedPaths.has(asset), `${asset} must be packaged`);
    }
    for (const file of manifest.files) {
        assert.ok(
            !file.path.startsWith("docs/changelog/"),
            `${file.path} must remain outside the manifest digest inventory`,
        );
        const path = resolve(ROOT, file.path);
        assert.ok(statSync(path).isFile(), file.path);
        assert.equal(
            createHash("sha256").update(readFileSync(path)).digest("hex"),
            file.sha256,
            file.path,
        );
    }
});

test("dashboard source avoids full-page browser navigation", () => {
    const violations = sourceFiles().flatMap((path) => {
        if (!path.startsWith(resolve(ROOT, "ui"))) return [];
        return /window\.location\.(?:href|replace|reload)\s*[=(]/.test(
            readFileSync(path, "utf8"),
        )
            ? [relative(ROOT, path)]
            : [];
    });
    assert.deepEqual(violations, []);
});

test("browser code uses host clients for gateway-owned data", () => {
    const violations = sourceFiles().flatMap((path) => {
        if (!path.startsWith(resolve(ROOT, "ui"))) return [];
        const source = readFileSync(path, "utf8");
        return /\/api\/v1\/(?:social|files|share)\//.test(source)
            ? [relative(ROOT, path)]
            : [];
    });
    assert.deepEqual(violations, []);
});

test("browser timestamps use host formatting utilities", () => {
    const violations = sourceFiles().flatMap((path) => {
        if (!path.startsWith(resolve(ROOT, "ui"))) return [];
        const source = readFileSync(path, "utf8");
        return /\.toLocale(?:DateString|TimeString|String)\(/.test(source)
            ? [relative(ROOT, path)]
            : [];
    });
    assert.deepEqual(violations, []);
});

test("source does not use Math.random for generated values", () => {
    const violations = sourceFiles()
        .filter((path) => /Math\.random\(/.test(readFileSync(path, "utf8")))
        .map((path) => relative(ROOT, path));
    assert.deepEqual(violations, []);
});

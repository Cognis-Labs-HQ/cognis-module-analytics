# AI Instructions for Analytics

These instructions are the module-relevant subset of the Cognis repository guidance. They apply to this entire repository.

## Session startup

Before exploring, implementing, linting, or testing, run:

```sh
npm install
```

Use `rg` rather than recursive `grep` for searches.

## External module contract

This repository delivers exactly one external Cognis module. Keep `manifest.json`, `package.json`, `routes.json`, `bootstrap.js`, and all declared entrypoints at the repository root or their declared repository-relative paths.

Preserve the module UUID permanently. Every required component reference must be a UUID. Always set `ui.stringsBaseUrl` in `manifest.json` to the module-owned locale bundle base URL so Cognis can resolve localized manifest metadata before the module UI loads. Keep the versions in `manifest.json`, `package.json`, and `package-lock.json` synchronized, keep `package.json` configured with `"type": "module"`, and keep `routes.json` as an array. Ensure every declared entrypoint and asset is a regular repository-relative file with exact filename casing.

After the final file change, run `npm run manifest:hashes` to regenerate every SHA-256 digest in `manifest.files`. Do not include `manifest.json` in its own digest list. Verify all declared digests before committing. Keep repository, homepage, and support metadata pointed at this project. Do not add generated secrets, credentials, personal data, or unnecessary dependencies.

## Component isolation and ctx

`bootstrap.js` is the sole system integration entrypoint. Runtime code and tests must not import Cognis source-tree internals, sibling components, or private package implementations.

Treat `ctx` as the complete cross-component bus:

- Obtain external behavior through `ctx` capabilities.
- Register exported behavior through capabilities and named flow stages.
- Detect optional components by checking their capabilities.
- Extend existing flows instead of importing or editing another component.
- Keep flow hooks removable so disabling the module cleanly removes its behavior.
- Pass authentication, authorization, request, and persistence helpers into route handlers through a ctx-derived route context.
- Return a disposer from `bootstrapModule` or export `teardownModule(ctx)` when the module owns work that scoped registration cannot remove automatically.
- Ensure enable-disable-enable and uninstall cycles leave no routes, UI contributions, capabilities, flows, hooks, timers, listeners, or sockets behind.

Route handlers orchestrate and validate; capabilities execute provider-specific work. Never access a database driver, authentication implementation, gateway store, adapter, or external service directly from a route handler.

## Structure and reuse

Keep server handlers under `api/`, browser resources under `ui/`, CLI controls under `cli/`, localized documentation under `docs/`, and store artwork under `assets/`.

Use `reuse/` for genuinely cross-cutting code within a layer. Do not create directories named `shared`, `utils`, `helpers`, or `common`. Keep modules cohesive and files at or below 1000 lines. Prefer descriptive names; avoid abbreviations and one- or two-letter bindings except conventional coordinates, loop counters, row or column counters, `_`, and `id`.

## UI requirements

Build dashboard content through host page-composer and client-side router contracts. Do not use `window.location.href`, `window.location.replace`, or `window.location.reload` for navigation.

Resolve all user-facing text through module-owned XML language resources. Namespace keys as `module.analytics.*`, keep German, English, Indonesian, and Japanese key parity, and translate each locale. Route timestamps through host formatting capabilities when available and respect user font and theme preferences.

Use host toast capabilities for transient feedback. Do not use `alert`, `confirm`, or `prompt`, and do not write result messages into arbitrary DOM nodes. Use decision popups only for deliberate user input. Do not add comments to CSS. Prefer themeable SVG assets over emoji or platform-dependent glyphs.

## API, security, and logging

Validate and sanitize input at the API boundary. Authenticate and authorize before business logic, use least privilege and secure defaults, and never expose internal error details.

Log caught failures at `error` level with structured, safe metadata including component, operation, and relevant identifiers. Mark uncaught runtime failures as fatal and state-changing user activity at `info` level. Do not leave silent `catch` blocks; log an intentional fallback before continuing.

Do not use `Math.random()` for identifiers, tokens, keys, or user-visible generated values. Use Web Crypto or Node Crypto. Do not introduce compatibility shims for obsolete schemas or tests asserting that removed legacy artifacts are absent.

## Tests and quality

Tests live under `tests/`, run standalone, and use local fakes for external capabilities. Test public route, capability, and flow contracts rather than sibling Cognis implementations.

Before committing, run:

```sh
npm install
npm test
npm run lint
npm run manifest:hashes
npm run check:manifest
git diff --check
```

Use the repository Prettier configuration: four-space indentation, double quotes in JavaScript, and trailing commas in multiline structures. Avoid tabs and trailing whitespace. Never wrap imports in `try`/`catch`.

Every behavior change requires appropriate tests, logging, and documentation. Keep all four `docs/standard.*.md` variants synchronized. Do not add AI reasoning, session notes, or process commentary to product-facing files.

## Review discipline

Treat human and automated review comments as actionable engineering feedback. Implement sound corrections unless they conflict with higher-priority instructions. Record intentionally deferred items in root `TODO.md` with a concrete technical reason. Keep changes focused while improving directly adjacent violations.

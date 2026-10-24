# Analytics Module

The Analytics module gives Cognis administrators privacy-conscious account-health, adoption, registration, and module-owned event insights without sending telemetry to a third-party analytics service. It reads account facts through the public `auth:accountStore` capability and stores only events submitted to the module's own activity-log API.

## Usage examples

Open the **Analytics** section in Cognis Administration to review account totals, enabled accounts, seven-day activity, 30-day dormancy, role distribution, registration trends, event totals, and recent events. Select a 7-, 30-, or 90-day range and refresh the view to update the time-dependent reports.

Query the same contracts with the CLI:

```sh
cognisctl modules:analytics:metrics
cognisctl modules:analytics:series 30
cognisctl modules:analytics:eventSummary 30
cognisctl modules:analytics:activityLog 20
```

Record a module-owned event with optional JSON metadata:

```sh
cognisctl modules:analytics:activityLog:record report_exported '{"format":"csv"}'
```

An authorized client can use the HTTP API directly:

```http
GET /api/v1/modules/analytics/metrics?days=30
GET /api/v1/modules/analytics/series?days=30
GET /api/v1/modules/analytics/type-summary?days=30
GET /api/v1/modules/analytics/activity-log?limit=20
POST /api/v1/modules/analytics/activity-log
Content-Type: application/json

{"eventType":"report_exported","meta":{"format":"csv"}}
```

A successful event write returns HTTP `201` with the generated event ID. Do not place secrets, credentials, message contents, or sensitive personal data in event metadata.

## Technical specification

### Installation and lifecycle

Install the module through the Cognis Module Marketplace or place the complete repository in the configured external-modules directory. The manifest declares `bootstrap.js` as the sole enabled-module entrypoint. Cognis validates every runtime source before loading it, and `bootstrapModule(ctx)` registers the admin section and API routes through the scoped host context. All runtime API URLs remain within `/api/v1/modules/analytics`, and interface font sizes use preference-relative units, satisfying the host boundary contract during enablement and upgrade. Analytics has no pre-enablement configuration; disabled modules expose no runtime API or UI and do not run enabled bootstrap. The module requires the host `db:executor` and `auth:accountStore` capabilities. The module-owned event schema is ensured during startup; schema initialization failures are logged with safe component and operation metadata.

Keep `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, database migration, localized resources, documentation, assets, and manifest hashes together when distributing the module. The module UUID is permanent.

The marketplace artwork uses the files declared by `assets.icon` and `assets.banner` in `manifest.json`; both files are included in the verified package inventory. The banner keeps its complete logo, title and chart inside a central safe band for Cognis’ height-limited hero. The square PNG icon is a snapshot of the banner’s graph.

### Administration interface

The admin section is restricted to the `admin` role. It reports:

- total, enabled, recently active, newly registered, and dormant accounts;
- activation rate and counts grouped by account role;
- a daily registration series for the selected range;
- total module events, unique non-null actors, and counts grouped by event type; and
- the most recent module events, ordered newest first.

UI strings come from the module's German, English, Indonesian, and Japanese XML resources. Timestamp rendering delegates to the host formatter when supplied and otherwise uses the browser's `Intl.DateTimeFormat` support.

### HTTP API

All routes require the `admin` role.

- `GET /api/v1/modules/analytics/metrics?days=<n>`: Days default to 30 and must be whole numbers from 1 to 365; invalid values return 400 instead of being clamped.
- `GET /api/v1/modules/analytics/series?days=<n>` returns one `{ date, count }` point per UTC date in the requested range. It uses the same `days` rules.
- `GET /api/v1/modules/analytics/type-summary?days=<n>` returns `{ total, uniqueActors, byType }`. The `event-summary` path is an equivalent compatibility route; browser UI uses `type-summary` to avoid privacy filters that block URLs containing `event`.
- `GET /api/v1/modules/analytics/activity-log?limit=<n>`: An omitted limit returns all matching events. An explicit limit must be a positive safe integer and is applied exactly; invalid values return 400.
- `POST /api/v1/modules/analytics/activity-log` accepts `{ eventType, meta }`. The UTF-8 JSON body is limited to 16 KiB, `eventType` is trimmed and capped at 64 characters, and `meta` is stored only when it is a non-array object.

### Responses and failures

Successful reads return HTTP `200` with a `data` property. If event storage is unavailable, event-summary and activity-log reads return safe empty results; metrics and series return `503`. Invalid JSON or a missing event type returns `400`, an oversized body returns `413`, and an event write without storage returns `503`. Query or write failures return a generic safe error and do not expose internal details. Query and schema failures are logged through the host logger.

### Persistence and privacy

Account metrics read the public `auth:accountStore` capability; the module does not copy account records. Custom events are stored in the module-owned `sample_analytics_events` table with an ID, event type, optional account ID, serialized metadata, and creation timestamp. Current API-created events use a null account ID. Recent-event responses omit metadata, while summaries aggregate event type and non-null actor counts.

The module does not contact an external analytics provider. Operators remain responsible for defining appropriate event names, minimizing metadata, applying retention requirements to the module-owned table, and limiting administrative access.

### CLI contracts

`modules:analytics:metrics`, `modules:analytics:series [days]`, `modules:analytics:eventSummary [days]`, and `modules:analytics:activityLog [limit]` call the corresponding authenticated module routes. `modules:analytics:activityLog:record <event-type> [meta-json]` parses the optional metadata as JSON before posting it. Invalid JSON and missing required arguments are reported by the CLI.

### Operational verification

After changing any packaged file, run:

```sh
npm install
npm test
npm run lint
npm run manifest:hashes
npm run check:manifest
git diff --check
```

`npm run manifest:hashes` rebuilds `manifest.files` with SHA-256 digests and formats the manifest with the repository Prettier configuration. `npm run check:manifest` verifies versions, entrypoints, routes, packaged paths, and file digests.

When Cognis uninstalls the module, choosing content deletion removes all module-owned analytics events. If content deletion is not selected, those events are retained. The cleanup action is recorded through the host logger without event payloads.

### Owned action flows

Account metrics and registration series consume `auth:accountStore.list()` and `getInfo()`; they never query another component's tables. Only module-owned events use `db:executor`.

HTTP operations run through module-owned ctx flows with validation, execution and presentation stages. Tests execute these stages and reject persistence when validation or schema initialization fails.

### Contributor layout and host ownership

Start new modules from [cognis-module-template](https://github.com/Cognis-Labs-HQ/cognis-module-template); this repository follows its pinned contributor guidance in `AGENTS.md`. `bootstrap.js` owns lifecycle orchestration, `api/index.js` wires ctx-derived dependencies, `api/routes/<domain>/index.js` owns HTTP handlers, and reusable server code belongs in `api/reuse/`. Browser features stay under `ui/`, styles under `ui/styles/`, reusable markup under `ui/templates/`, and localized documentation under `docs/index.<locale>.md`. Historical release entries live in `docs/changelog/` and are excluded from package hashes. Optional concerns are omitted when unsupported.

Consume public ctx capabilities and declared flows; do not import Cognis internals or sibling modules. Dashboard capability/navbar providers export `mountProvider(scopedUiCtx)` and return cleanup for owned resources. Imports must not register module behavior. The host disposes scoped capabilities, flow hooks, listeners and provider state when disabled, then mounts cached providers again when re-enabled. Settings/admin factories and authentication-footer descriptor providers follow their own documented host contracts. Test these contracts with standalone fakes, run the executable layout guard, regenerate hashes after the final packaged edit, and run lint, tests and manifest validation before publishing.

## Queued Delivery and Consent

Analytics records authenticated activity through `POST /api/v1/modules/analytics/activity` and the staged `analytics:recordActivity` browser flow. Events use account-scoped idempotency keys and original occurrence times. Navigation and queued Study actions contribute safe scalar metadata only (`component`, `action`, `result`, `count`, `durationMs`); arbitrary payloads are rejected before persistence. Accounts are hashed in reports. Disabling the provider detaches handlers and listeners.

The host exposes `offline:outbox`, `offline:state` and `offline:accessPolicy` through ctx. Components register delivery handlers for their provider lifetime and submit stable operation IDs through `offline:enqueue`; `offline:flush` authorizes and delivers. The durable account-bound queue holds at most 1,000 records and 1 MB for seven days, without tokens. It preserves original IDs and timestamps, retries transient failures and removes acknowledged or permanently rejected records. A localized warning reports rejected records. Logout clears the account queue; changing accounts never replays another account’s data. Disabling Offline Mode stops new queued writes. Pending writes may still deliver online.

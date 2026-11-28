# Technical Reference

Public interfaces, configuration and lifecycle of Analytics.

## Interfaces

The Analytics module gives Cognis administrators privacy-conscious account-health, adoption, registration, and module-owned event insights without sending telemetry to a third-party analytics service. It reads account facts through the public `auth:accountStore` capability and stores only events submitted to the module's own activity-log API.

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

## Configuration

Analytics declares no module preference form. Reporting ranges and explicit list limits are request inputs, not persisted configuration. Account metrics consume `auth:accountStore`; module-owned events use `db:executor`.

### Installation and lifecycle

Install the module through the Cognis Module Marketplace or place the complete repository in the configured external-modules directory. The manifest declares `bootstrap.js` as the sole enabled-module entrypoint. Cognis validates every runtime source before loading it, and `bootstrapModule(ctx)` registers the admin section and API routes through the scoped host context. All runtime API URLs remain within `/api/v1/modules/analytics`, and interface font sizes use preference-relative units, satisfying the host boundary contract during enablement and upgrade. Analytics has no pre-enablement configuration; disabled modules expose no runtime API or UI and do not run enabled bootstrap. The module requires the host `db:executor` and `auth:accountStore` capabilities. The module-owned event schema is ensured during startup; schema initialization failures are logged with safe component and operation metadata.

Keep `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, database migration, localized resources, documentation, assets, and manifest hashes together when distributing the module. The module UUID is permanent.

The marketplace artwork uses the files declared by `assets.icon` and `assets.banner` in `manifest.json`; both files are included in the verified package inventory. The banner keeps its complete logo, title and chart inside a central safe band for Cognis’ height-limited hero. The square PNG icon is a snapshot of the banner’s graph.

## Behavior

Report panels use the host Composer’s `data-composer-layout="compact"` hook for narrow content. Compact event summaries place each bar below its label and count; totals and filters wrap. Event tables retain fixed column proportions and wrap timestamps in compact views. These rules apply to the module-owned report content and preserve host theme and text-size settings.

### Responses and failures

Successful reads return HTTP `200` with a `data` property. If event storage is unavailable, event-summary and activity-log reads return safe empty results; metrics and series return `503`. Invalid JSON or a missing event type returns `400`, an oversized body returns `413`, and an event write without storage returns `503`. Query or write failures return a generic safe error and do not expose internal details. Query and schema failures are logged through the host logger.

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

### Queued Delivery and Consent

Analytics records authenticated activity through `POST /api/v1/modules/analytics/activity` and the staged `analytics:recordActivity` browser flow. Events use account-scoped idempotency keys and original occurrence times. Navigation and queued Study actions contribute safe scalar metadata only (`component`, `action`, `result`, `count`, `durationMs`); arbitrary payloads are rejected before persistence. Accounts are hashed in reports. Disabling the provider detaches handlers and listeners.

The host exposes `offline:outbox`, `offline:state` and `offline:accessPolicy` through ctx. Components register delivery handlers for their provider lifetime and submit stable operation IDs through `offline:enqueue`; `offline:flush` authorizes and delivers. The durable account-bound queue holds at most 1,000 records and 1 MB for seven days, without tokens. It preserves original IDs and timestamps, retries transient failures and removes acknowledged or permanently rejected records. A localized warning reports rejected records. Logout clears the account queue; changing accounts never replays another account’s data. Disabling Offline Mode stops new queued writes. Pending writes may still deliver online.

### Background queue warnings

Analytics registers its delivery owner with `protectOnClose: false` on the host outbox. Navigation and activity records remain durable and replay after authorized recovery, including a manual connectivity recheck, but does not trigger the browser close warning. User edits retain the host’s default protection. This requires the updated host close-warning classification contract.

### Account Activity Cleanup

The scoped `analytics:deleteAccountActivity` hook extends `deprovision-user` at `cleanup-dependencies`. After a persisted account deletion, it waits for schema readiness and deletes only events whose account digest matches the deleted identity, using the same SHA-256 derivation as authenticated ingestion. Other accounts and anonymous administrator events remain intact. Disable, archive and rejected deletion requests retain activity. Failures are logged and propagated; scoped host teardown removes the hook before re-enable.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.

### Refresh Before Reading The Chart

The reporting-window exercise covers both choosing a range and pressing Refresh. It advances only after all report requests and response parsing succeed and the report is rendered. Changing the selector alone, a failed request or closing the section cannot advance it. Failed refreshes leave the controls available for retry; active refreshes temporarily disable the range and Refresh controls.

## Security

Aggregate reporting requires administrator authorization. Authenticated activity ingestion derives identity from verified claims and accepts only bounded safe metadata. Reports use account digests instead of raw account identifiers. Retention and deletion apply only to the module’s events, preserving unrelated account and application records.

### Persistence and privacy

Account metrics read the public `auth:accountStore` capability; the module does not copy account records. Custom events are stored in the module-owned `sample_analytics_events` table with an ID, event type, optional account ID, serialized metadata, and creation timestamp. Current API-created events use a null account ID. Recent-event responses omit metadata, while summaries aggregate event type and non-null actor counts.

The module does not contact an external analytics provider. Operators remain responsible for defining appropriate event names, minimizing metadata, applying retention requirements to the module-owned table, and limiting administrative access.

## Reference

- [manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/blob/HEAD/manifest.json)
- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/blob/HEAD/bootstrap.js)
- [Cognis](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/modules/external/TECHNICAL.en.md)

### Naming validation

`npm test` checks binding names with the local syntax-tree detector, including bootstrap, scripts, tests and fixtures. Parsing errors fail validation. The detector regression fixtures cover declarations, parameters, private members, TypeScript assertions and legitimate type-only names. See the [host naming standard](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.en.md#binding-names) for the shared policy. Conventional vocabulary such as `args`, `db` and LDAP `dn` is accepted as standalone names. Composite identifiers, including upstream types and methods, use expanded words such as `DatabaseExecutor`, `createDatabaseExecutor` and `baseDistinguishedName`; owned APIs use one canonical name across declarations, exports and callers. Naming-only export aliases fail validation. Measurement-unit tokens (`ms`, `sec`, `px`, `rad`, `deg`) stay abbreviated within composites, such as `INVITE_EXPIRY_MS` and `widthPx`; other composite abbreviations still expand.

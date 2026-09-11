# Analytics Module

The Analytics module gives Cognis administrators privacy-conscious account-health, adoption, registration, and module-owned event insights without sending telemetry to a third-party analytics service. It reads account data through the host database capability and stores only events submitted to the module's own activity-log API.

## Usage examples

Open the **Analytics** section in Cognis Administration to review account totals, enabled accounts, seven-day activity, 30-day dormancy, role distribution, registration trends, event totals, and recent events. Select a 7-, 30-, or 90-day range and refresh the view to update the time-dependent reports.

Query the same contracts with the CLI:

```sh
cognisctl analytics:metrics
cognisctl analytics:series 30
cognisctl analytics:event-summary 30
cognisctl analytics:activity-log 20
```

Record a module-owned event with optional JSON metadata:

```sh
cognisctl analytics:activity-log:record report_exported '{"format":"csv"}'
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

Install the module through the Cognis Module Marketplace or place the complete repository in the configured external-modules directory. Cognis validates every runtime source before loading `bootstrap.js`, which registers the admin section and API routes through `ctx`. All runtime API URLs remain within `/api/v1/modules/analytics`, and interface font sizes use preference-relative units, satisfying the host boundary contract during enablement and upgrade. While disabled, Cognis loads the dedicated `api/disabled.js` entrypoint, which deliberately registers no routes or capabilities because Analytics has no pre-enablement configuration. The module requires the host `db:executor` capability. The module-owned event schema is ensured during startup; schema initialization failures are logged with safe component and operation metadata.

Keep `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, database migration, localized resources, documentation, assets, and manifest hashes together when distributing the module. The module UUID is permanent.

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

- `GET /api/v1/modules/analytics/metrics?days=<n>` returns account-health metrics. `days` defaults to `30`, must be positive, and is capped at `365`.
- `GET /api/v1/modules/analytics/series?days=<n>` returns one `{ date, count }` point per UTC date in the requested range. It uses the same `days` rules.
- `GET /api/v1/modules/analytics/type-summary?days=<n>` returns `{ total, uniqueActors, byType }`. The `event-summary` path is an equivalent compatibility route; browser UI uses `type-summary` to avoid privacy filters that block URLs containing `event`.
- `GET /api/v1/modules/analytics/activity-log?limit=<n>` returns recent events without stored metadata. `limit` defaults to `50`, must be positive, and is capped at `200`.
- `POST /api/v1/modules/analytics/activity-log` accepts `{ eventType, meta }`. The UTF-8 JSON body is limited to 16 KiB, `eventType` is trimmed and capped at 64 characters, and `meta` is stored only when it is a non-array object.

### Responses and failures

Successful reads return HTTP `200` with a `data` property. If event storage is unavailable, event-summary and activity-log reads return safe empty results; metrics and series return `503`. Invalid JSON or a missing event type returns `400`, an oversized body returns `413`, and an event write without storage returns `503`. Query or write failures return a generic safe error and do not expose internal details. Query and schema failures are logged through the host logger.

### Persistence and privacy

Account metrics read the host-owned `accounts` table through `db:executor`; the module does not copy account records. Custom events are stored in the module-owned `sample_analytics_events` table with an ID, event type, optional account ID, serialized metadata, and creation timestamp. Current API-created events use a null account ID. Recent-event responses omit metadata, while summaries aggregate event type and non-null actor counts.

The module does not contact an external analytics provider. Operators remain responsible for defining appropriate event names, minimizing metadata, applying retention requirements to the module-owned table, and limiting administrative access.

### CLI contracts

`analytics:metrics`, `analytics:series [days]`, `analytics:event-summary [days]`, and `analytics:activity-log [limit]` call the corresponding authenticated module routes. `analytics:activity-log:record <event-type> [meta-json]` parses the optional metadata as JSON before posting it. Invalid JSON and missing required arguments are reported by the CLI.

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

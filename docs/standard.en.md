# Analytics Content

Module-owned content lives under module paths and is loaded only when enabled.

## Reporting surface

The admin view combines account health, registration trends, role distribution,
event mix, and a recent-event audit view. All API routes require an administrator
role. Event metadata remains module-owned, event bodies are capped at 16 KiB, and
the module does not send telemetry to external services.

Operators can use `analytics:metrics`, `analytics:series [days]`,
`analytics:event-summary [days]`, and `analytics:activity-log [limit]` from the
CLI. Producers can record allow-listed organizational events through
`analytics:activity-log:record <event-type> [meta-json]`; avoid placing secrets or
sensitive personal information in metadata.

## External distribution

Analytics is self-contained for extraction into `Cognis-Labs-HQ/cognis-module-analytics`. Its manifest declares `db:executor` in `requiresCapabilities`; the module must not start until Cognis offers that capability. The root manifest, package, routes, license, assets, CLI, API, UI, migration, translated docs, and integrity hashes travel together.

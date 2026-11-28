# Usage

Review account activity and module-owned event reports without a third-party analytics service.

## Prerequisites

Sign in as an administrator after the module is enabled. Database and account services must be available for complete reports.

## Examples

Open Analytics in Administration, choose a reporting range and refresh before reading time-dependent charts.

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

The play introduces the administration analytics filters and chart. It requires an administrator session and a server connection.

## Expected Results

Reports reflect authorized account information and module-owned events for the selected range. Event submission does not send telemetry to an external analytics provider.

## Troubleshooting

Refresh stale charts, confirm administrator access and inspect service availability for failed reports. Keep secrets and private message contents out of event metadata.

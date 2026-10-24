# Queued Delivery and Consent

**Feature Branch:** feature-offline-delivery

## Queued Delivery and Consent

Analytics records authenticated activity through `POST /api/v1/modules/analytics/activity` and the staged `analytics:recordActivity` browser flow. Events use account-scoped idempotency keys and original occurrence times. Navigation and queued Study actions contribute safe scalar metadata only (`component`, `action`, `result`, `count`, `durationMs`); arbitrary payloads are rejected before persistence. Accounts are hashed in reports. Disabling the provider detaches handlers and listeners.

The host exposes `offline:outbox`, `offline:state` and `offline:accessPolicy` through ctx. Components register delivery handlers for their provider lifetime and submit stable operation IDs through `offline:enqueue`; `offline:flush` authorizes and delivers. The durable account-bound queue holds at most 1,000 records and 1 MB for seven days, without tokens. It preserves original IDs and timestamps, retries transient failures and removes acknowledged or permanently rejected records. A localized warning reports rejected records. Logout clears the account queue; changing accounts never replays another account’s data. Disabling Offline Mode stops new queued writes. Pending writes may still deliver online.

## Commits

- [16f40d7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/16f40d7bbb2a045da8b745f656150bcdc31c3489)
- [c6b5760](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6b57608b93128f46fe849c7a385805ab8ab0e55)

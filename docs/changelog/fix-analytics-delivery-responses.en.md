# Validate Delivery Responses

**Feature Branch:** fix-analytics-delivery-responses

## Validate Delivery Responses

Analytics acknowledges queued activity only after a successful, non-redirected JSON response containing the stored event ID. HTML, empty or malformed bodies and missing IDs produce a retryable 502-class delivery error, preserving the original event identity for a later attempt. Invalid JSON is logged with safe status metadata; response bodies are never logged.

## Commits

- [221efac](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/221efac097286f2fe90809303620d35bfa873fef)
- [84316b7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/84316b71a2250f56b4c189ff612ccc83e6b9eec7)

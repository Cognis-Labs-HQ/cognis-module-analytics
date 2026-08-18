# Cognis Analytics

Privacy-conscious usage insights and administrative reporting for Cognis. Track
registration trends, activation, account health, role distribution, and
module-owned events without introducing a third-party analytics service.

This repository is a self-contained Cognis extension module. Install it through the Module Marketplace or place it in the configured external modules directory. See `docs/standard.en.md` and its translations for configuration, capabilities, routes, and operational guidance.

## Analytics coverage

- Account totals, enabled/disabled status, seven-day activity, and 30-day dormancy
- Registration time series over configurable 7, 30, or 90-day windows
- Privacy-conscious custom event capture with a 16 KiB request limit
- Event volume, unique-actor, and event-type summaries
- Admin dashboard and CLI access, protected by host authorization

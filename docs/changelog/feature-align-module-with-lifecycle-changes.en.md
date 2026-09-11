# Restore Analytics Module Enablement

**Feature Branch:** work

## Lifecycle boundary compliance

Removed a packaged invalid-route fixture that addressed another module namespace and caused Cognis runtime-source boundary validation to reject Analytics during enablement. Analytics runtime sources now remain within the module-owned API namespace.

## Regression coverage and release metadata

Added a boundary regression test for runtime API URLs, documented the validated lifecycle contract in every supported language, and synchronized the release version at 2.1.3.

## Isolated disabled lifecycle

Analytics now declares a dedicated disabled API entrypoint, matching the lifecycle structure used by other external modules. Because Analytics has no pre-enablement configuration, this entrypoint intentionally registers no routes, capabilities, or runtime work. Automated coverage verifies this inert contract.

## Commits

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)

- [8da06b8](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/8da06b87b83b2335c17cdcd5c351f95d564dd6e0)

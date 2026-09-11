# Restore Analytics Module Enablement

**Feature Branch:** feature-align-module-with-lifecycle-changes

## Lifecycle boundary compliance

Replaced a packaged invalid-route fixture that addressed another module namespace with an inert module source, ensuring upgrades overwrite the violating file. Analytics runtime sources now remain within the module-owned API namespace.

## Regression coverage and release metadata

Added a boundary regression test for runtime API URLs, documented the validated lifecycle contract in every supported language, and synchronized the release version at 2.1.4.

## Isolated disabled lifecycle

Analytics now declares a dedicated disabled API entrypoint, matching the lifecycle structure used by other external modules. Because Analytics has no pre-enablement configuration, this entrypoint intentionally registers no routes, capabilities, or runtime work. Automated coverage verifies this inert contract.

## Complete boundary compliance

Converted the remaining absolute chart-label font size to a preference-relative unit and added regression coverage for absolute CSS font sizes. The inert replacement source and relative typography allow both upgraded and newly installed modules to pass the complete host boundary scan.

## Commits

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)
- [8da06b8](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/8da06b87b83b2335c17cdcd5c351f95d564dd6e0)
- [7773003](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/7773003e1c1c7913b3e4e5eb534141a7e90f252d)

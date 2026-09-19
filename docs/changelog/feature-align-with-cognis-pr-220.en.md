# Align Analytics with the Current External Module Structure

**Feature Branch:** work

## Bootstrap-only loading

Removed the obsolete API manifest entrypoint so Cognis loads the enabled Analytics module exclusively through `entrypoints.bootstrap` and `bootstrapModule(ctx)`. The dedicated disabled-state entrypoint remains available for the module lifecycle.

## Safer failure reporting

Analytics now records activity-write failures through the host logger with safe component and operation metadata before returning the generic API error.

## Contract verification and documentation

Updated the structural contract test, synchronized all localized standards, and released version 2.1.5 with regenerated package integrity hashes.

## Commits

- [f111f3c](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/f111f3c2c724f56b6bb7035bed174f9130a8b2db)

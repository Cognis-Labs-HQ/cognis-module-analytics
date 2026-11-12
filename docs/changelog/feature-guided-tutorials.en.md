# Guided tutorial

**Feature Branch:** feature-guided-tutorials

## Technical Specification

The play introduces the administration analytics filters and chart. It requires an administrator session and a server connection.

The module registers its own play and localized strings through ctx. The host owns the catalog, callouts, arrows, spotlight, keyboard and pointer controls, guarded SPA navigation and accessibility. Closing a tutorial, navigating away, losing access or disabling the module releases the session. Failed provider mounting rolls back its registrations.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

## Page-bound First Visits

The host owns callouts, arrows, spotlight, accessibility and the shared floating action menu. First-time runs offer Next throughout, without Cancel or Skip. Replays offer Cancel with `btn-cancel`. Completion is stored per account in the browser. Navigation, access loss and provider removal release the session; failed mounts roll back registrations.

## Actionable Tutorial Copy

Tutorial steps focus on the controls and tasks available on the page, without unrelated reassurances about permissions or actions the guide does not perform.

## Author Next cues per step

Each tutorial step now explicitly declares `highlightNext`: explanations that require Next or Finish enable it, while interaction- and wait-driven exercises disable it. The cue retains a static outline for reduced motion.

Tutorial coverage is required for every UI-facing component. Contributor guidance requires user-first, task-focused walkthroughs and a review of existing tutorials whenever features or UI behavior change.

## Visible tutorial regions

Tutorial regions and Next cues are authored explicitly.

## Shared floating-menu queue

Menus follow the shared queued host contract and component lifetime.

## Documented recovery controls

Missing-target views provide Next and Restart Tutorial; replay also provides Cancel.

## Intentional tutorial guidance

Tutorials explain distinct visible controls in UI order. Shared guidance covers active-view discovery, stable examples, empty states, conditional branches and lifecycle cleanup. Replay controls and reduced-motion documentation match the shared host.

## Consistent Translation Catalogs

Translation keys use lowercase period-delimited words throughout the module metadata and tutorials. Catalog entries retain their original translated values and match the surrounding XML indentation. Strict namespace checks reject hyphens and underscores in translation keys. Module IDs, UUIDs, capabilities and tutorial completion identities remain unchanged.

## Refresh Before Reading The Chart

The reporting-window exercise covers both choosing a range and pressing Refresh. It advances only after all report requests and response parsing succeed and the report is rendered. Changing the selector alone, a failed request or closing the section cannot advance it. Failed refreshes leave the controls available for retry; active refreshes temporarily disable the range and Refresh controls.

## Commits

- [c94a229](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c94a229fbd1e0f68a8bee382180dd7734aa8e6a2)
- [2f45c6b](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/2f45c6b185472dae1846ee7c66cf2ec832c17028)
- [1d84d69](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/1d84d69054daa49d6f6bf9c95d02f0005654b412)
- [5fff2b0](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/5fff2b07337f60998f18f2cd8629e943271db7fd)
- [c4d5e25](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c4d5e251629e45a50090f40e3d003243cd744449)
- [ed63571](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/ed6357135a3def805ecd524df994a8897de4e27a)
- [1345101f0](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/1345101f062e36f53e25e5bc7ff168b3a1bc9e08)
- [60f7c7523](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/60f7c75230d8874fbb3b62fa8ba79282a946c766)
- [ab750ad](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/ab750add827105b1d8f58e6ba0a0542bfe2e207a)

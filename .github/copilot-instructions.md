# AI Instructions for Analytics

Follow the repository-wide instructions in `AGENTS.md` for every change. In particular, run `npm install` before exploration, use `rg` for searches, preserve the external module contract, and complete every required test and manifest check before committing.

## Changelogs

Store pull-request changelogs as four translated variants under `docs/changelog/` named `<stable-slug>.de.md`, `<stable-slug>.en.md`, `<stable-slug>.id.md`, and `<stable-slug>.ja.md`.

Each changelog must contain a localized `#` title, a localized feature-branch label immediately below it, one change point per `##` heading with explanatory body content, and a final localized commits section. Commit links must target `https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/<full-sha>` and display a seven-character commit reference. Use `N/A` only if no feature branch or implementation commit exists.

Translate each locale rather than copying English prose. Never create a global monolithic changelog, and do not rewrite historical entries except to correct facts.

Finish changelog provenance in a dedicated final commit that changes only the localized changelog family and generated manifest digests. Its commit list must link the immediately preceding implementation commit, not the provenance commit itself.

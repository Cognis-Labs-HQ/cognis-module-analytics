# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

The play introduces the administration analytics filters and chart. It requires an administrator session and a server connection.

## Technical Specification

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.

## Refresh Before Reading The Chart

The reporting-window exercise covers both choosing a range and pressing Refresh. It advances only after all report requests and response parsing succeed and the report is rendered. Changing the selector alone, a failed request or closing the section cannot advance it. Failed refreshes leave the controls available for retry; active refreshes temporarily disable the range and Refresh controls.

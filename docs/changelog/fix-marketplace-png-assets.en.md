# Use the Marketplace PNG banner

**Feature Branch:** feature-fix-broken-commit-for-banner.png-and-icon.png

## Correct icon and banner references

The module manifest now points to the packaged PNG banner while continuing to use the themeable SVG icon, so Cognis loads each intended Marketplace asset with exact filename casing.

## Validate declared artwork

Structural coverage now verifies that both declared Marketplace assets are safe repository-relative files and are present in the manifest package inventory.

## Commits

- [0254f55](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/0254f558b42b406c1532c1474e12fe2b46362805)

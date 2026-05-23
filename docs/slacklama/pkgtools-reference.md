---
id: pkgtools-reference
title: Pkgtools Reference
tags:
  - installpkg
  - upgradepkg
  - removepkg
  - pkgtool
  - makepkg
summary: A compact reference for the traditional Slackware package tools and common package operations.
sources:
  - https://docs.slackware.com/slackware:package_management
  - https://docs.slackware.com/slackware:package_management_hands_on
---
# Pkgtools Reference

Slackware's traditional package tools are intentionally small and direct.

## Commands

- `installpkg` installs a package.
- `upgradepkg` upgrades a package in place.
- `removepkg` removes an installed package.
- `explodepkg` unpacks a package for inspection.
- `makepkg` creates a Slackware package from a directory tree.
- `pkgtool` wraps common maintenance tasks in a menu.

## Example

```sh
# installpkg /tmp/foo-1.0-x86_64-1.txz
# upgradepkg foo-1.1-x86_64-1.txz
# removepkg foo
```

## When to use what

- Use `pkgtool` when you want the menu.
- Use `installpkg` and `upgradepkg` when you know the package name.
- Use `makepkg` after staging a build.

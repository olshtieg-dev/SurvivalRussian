---
id: slackpkg-update
title: Slackpkg Update Flow
tags:
  - slackpkg
  - mirrors
  - update
  - upgrade-all
  - file-search
summary: Mirror selection, update cadence, package search, reinstall, and safe upgrade habits.
sources:
  - https://docs.slackware.com/slackware:slackpkg
  - https://docs.slackware.com/slackware:package_management_hands_on
  - https://docs.slackware.com/slackware:faq
---
# Slackpkg Update Flow

`slackpkg` is the official helper for tracking and updating Slackware packages
from a selected mirror.

## Basic flow

1. edit `/etc/slackpkg/mirrors`
2. enable one mirror
3. run `slackpkg update`
4. inspect available changes
5. run `slackpkg install`, `upgrade-all`, or `reinstall` as needed

## Useful commands

```sh
# slackpkg search kernel
# slackpkg file-search libncurses.so
# slackpkg reinstall bash
# slackpkg upgrade-all
```

## Notes

- Keep only one mirror enabled.
- Don’t jump to `-current` unless you mean to track the development branch.
- `slackpkg` handles official packages; third-party packages need separate care.

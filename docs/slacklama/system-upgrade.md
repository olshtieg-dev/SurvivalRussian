---
id: system-upgrade
title: System Upgrade
tags:
  - upgrade
  - current
  - lilo
  - initrd
  - kernel
summary: High-level upgrade reminders: read changelogs, update kernel entries, and rerun lilo.
sources:
  - https://docs.slackware.com/howtos:slackware_admin:systemupgrade
  - https://docs.slackware.com/slackware:faq
---
# System Upgrade

Slackware upgrades work best when you read the docs first and change things in a
controlled order.

## Good habits

- read the current `ChangeLog` and any `UPGRADING.TXT`
- update package mirrors or local media carefully
- keep a working boot entry
- rerun `lilo` after bootloader changes
- make sure your kernel and initrd still match

## High-level reminder

If you switched kernels, don’t forget:

```sh
# lilo -v
```

and verify that the new entry actually boots before deleting the fallback.

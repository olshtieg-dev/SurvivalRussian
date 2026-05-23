---
id: runlevels-checklist
title: Runlevels Checklist
tags:
  - rc.S
  - rc.M
  - rc.4
  - rc.local
  - services
summary: A small cheat sheet for Slackware runlevels and the startup/shutdown rc scripts.
sources:
  - https://docs.slackware.com/howtos:misc:get_acquainted_with_slackware
---
# Runlevels Checklist

Slackware uses straightforward rc scripts instead of hiding system startup in a
large service framework.

## Common runlevels

- `0` power off
- `1` single-user rescue mode
- `3` multi-user text mode
- `4` graphical login
- `6` reboot

## rc scripts to remember

- `rc.S` starts system initialization
- `rc.M` starts multi-user services
- `rc.4` starts the display manager
- `rc.0` shuts the system down
- `rc.6` reboots or shuts the system down

## Local customizations

- `rc.local` for startup additions
- `rc.local_shutdown` for shutdown cleanup

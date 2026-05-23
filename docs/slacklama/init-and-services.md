---
id: init-and-services
title: Init and Services
tags:
  - runlevels
  - rc.d
  - services
  - init
summary: Slackware runlevels, rc scripts, and how executable bits control service startup.
sources:
  - https://docs.slackware.com/howtos:misc:get_acquainted_with_slackware
---
# Init and Services

Slackware uses a traditional Unix-style init layout with explicit runlevels and
rc scripts.

## Runlevels

- `0` shutdown
- `1` single-user mode
- `3` multi-user mode, and the default text-mode runlevel
- `4` multi-user mode with a display manager
- `7` reboot

## Key rc scripts

- `rc.S` starts system initialization
- `rc.M` starts multi-user services
- `rc.K` handles the transition into single-user mode
- `rc.4` starts the display manager
- `rc.0` shuts the system down
- `rc.6` reboots or shuts down cleanly, depending on how it is invoked

## Custom services

Slackware makes service control very explicit.

- Put startup actions in `/etc/rc.d/rc.local`
- Put shutdown actions in `/etc/rc.d/rc.local_shutdown`
- Use the executable bit on scripts in `/etc/rc.d` to control whether they run

### Example

```sh
# chmod 755 /etc/rc.d/rc.myservice
# chmod 644 /etc/rc.d/rc.myservice
```

## pkgtool shortcut

`pkgtool` includes a setup area where you can manage services without editing
everything by hand.

## Practical use

- Add daemons carefully and keep shutdown steps mirrored.
- Prefer small explicit scripts over hidden background automation.
- Use the standard rc layout so the next person can understand what runs at boot.

---
id: boot-recovery
title: Boot Recovery
tags:
  - lilo
  - recovery
  - boot
  - newkernel
  - default
summary: A safe boot-fix checklist for LILO entries, kernel labels, and fallback boot paths.
sources:
  - https://docs.slackware.com/howtos:slackware_admin:recovery_boot_option
  - https://docs.slackware.com/howtos:slackware_admin:kernelbuilding
  - https://docs.slackware.com/slackbook:booting
---
# Boot Recovery

When you change kernels or touch LILO, keep a fallback boot entry intact.

## Recovery checklist

- keep the working kernel stanza
- add the new kernel as a separate `image` section
- confirm the `root` and `initrd` lines
- run `lilo -v`
- reboot and test the new label

## Example

```ini
image = /boot/vmlinuz
  root = /dev/sda1
  label = linux
  read-only

image = /boot/vmlinuz-custom
  root = /dev/sda1
  label = newkernel
  read-only
```

If the new kernel fails, boot the older entry and fix `/etc/lilo.conf` before
trying again.

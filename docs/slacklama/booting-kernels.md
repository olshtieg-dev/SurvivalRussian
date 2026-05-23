---
id: booting-kernels
title: Booting and Kernels
tags:
  - kernel
  - initrd
  - lilo
  - huge
  - generic
summary: Switching from huge to generic kernels, generating initrd, and updating LILO safely.
sources:
  - https://docs.slackware.com/slackware:beginners_guide
  - https://docs.slackware.com/slackbook:booting
  - https://docs.slackware.com/howtos:slackware_admin:kernelbuilding
---
# Booting and Kernels

Slackware commonly installs a huge kernel by default because it is broadly
compatible during first boot and installation. The recommended long-term setup
is often the generic kernel plus an initrd.

## Huge vs generic

- `huge` kernels have many drivers built in and are easy to boot with.
- `generic` kernels are leaner and usually need an `initrd`.
- If you use the generic kernel without an initrd, booting can fail.

## Typical generic-kernel flow

1. build or select the generic kernel image
2. generate an initrd with `mkinitrd`
3. add a new section to `/etc/lilo.conf`
4. run `lilo` to make the change permanent
5. reboot and test the new entry

### Example initrd command

```sh
# mkinitrd -c -k <kernel-version> -f <root-fs> -r /dev/<root-partition> \
  -m <modules> -u -o /boot/initrd.gz
```

Slackware also ships a helper that can suggest the right command:

```sh
# /usr/share/mkinitrd/mkinitrd_command_generator.sh -l /boot/vmlinuz-generic-<version>
```

## LILO example

Add a separate entry instead of overwriting your working one:

```ini
image = /boot/vmlinuz-generic-<version>
  initrd = /boot/initrd.gz
  root = /dev/sda1
  label = Slackware
  read-only
```

After editing:

```sh
# lilo -v
```

Then reboot and choose the new entry. Keep the working huge-kernel entry as a
fallback until you are confident the new setup is stable.

## Kernel safety notes

- Add the new kernel as a separate LILO stanza.
- Keep the existing working kernel entry intact.
- If the new kernel works, you can make it the default later.
- The `default = newkernel` line is the usual way to switch the boot default.

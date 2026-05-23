---
id: localization-console
title: Localization and Console
tags:
  - utf-8
  - console
  - font
  - liloconfig
summary: UTF-8 console setup, LILO unicode options, rc.font, and setconsolefont.
sources:
  - https://docs.slackware.com/slackware:localization
---
# Localization and Console

Slackware lets you set up console encoding and fonts directly from the standard
tools.

## UTF-8 console

If you want UTF-8 in the console, add the kernel parameter in `/etc/lilo.conf`:

```ini
append="vt.default_utf8=1"
boot = /dev/sdx
```

You can also use `liloconfig` to adjust LILO settings interactively.

`liloconfig` is available from the `setup` section of `pkgtool`.

## Console font

Console font settings are kept in `/etc/rc.d/rc.font`.

If you need to change the font later:

```sh
# setconsolefont
```

## Practical notes

- Use this when you want readable Cyrillic or other UTF-8 console output.
- Keep font changes in `rc.font` so they persist.
- Reboot after changing LILO options.

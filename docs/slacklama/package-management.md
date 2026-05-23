---
id: package-management
title: Package Management
tags:
  - pkgtools
  - slackpkg
  - slackbuilds
  - packages
summary: Core package tools, slackpkg workflows, search, cleanup, reinstall, and SlackBuild-based builds.
sources:
  - https://docs.slackware.com/slackware:package_management
  - https://docs.slackware.com/slackware:package_management_hands_on
---
# Package Management

Slackware keeps package management intentionally simple and explicit. The core
tools are designed for direct control instead of hidden dependency magic.

## Core tools

- `installpkg` installs a Slackware package.
- `upgradepkg` replaces an old package with a newer one.
- `removepkg` removes an installed package.
- `explodepkg` unpacks a package so you can inspect it.
- `makepkg` builds a Slackware package from a prepared directory tree.
- `pkgtool` provides a menu-driven wrapper around common maintenance tasks.

### Example commands

```sh
# installpkg /tmp/foo-1.0-x86_64-1.txz
# upgradepkg foo-1.1-x86_64-1.txz
# removepkg foo
# explodepkg foo-1.1-x86_64-1.txz
```

## slackpkg

`slackpkg` is the official update and package management helper for Slackware
packages from the Slackware mirrors.

Typical workflow:

```sh
# edit /etc/slackpkg/mirrors and enable one mirror
# slackpkg update
# slackpkg install mplayerplug-in
# slackpkg upgrade-all
# slackpkg clean-system
```

Useful operations:

- `slackpkg search <name>` finds matching packages.
- `slackpkg file-search <file>` finds packages that contain a file.
- `slackpkg info <package>` shows package details.
- `slackpkg reinstall <package>` repairs a damaged package install.

### Local media source

If you want to work offline, you can point `slackpkg` at the installation media
instead of a network mirror.

```sh
# mount /dev/cdrom /mnt/cdrom
# slackpkg update
```

## Rebuilding packages

Slackware is source-friendly. The distro ships source trees and `*.SlackBuild`
recipes so you can rebuild packages in a repeatable way.

General flow:

1. unpack the source
2. review the `slack-desc`
3. configure and patch
4. build into a temporary staging directory
5. run `makepkg`
6. install the resulting package with `installpkg`

### SlackBuild example

```sh
# tar xvzf cowsay.tar.gz
# cd cowsay
# ./cowsay.SlackBuild
# installpkg /tmp/cowsay-3.03-noarch-1_SBo.tgz
```

## Practical mental model

- Use `pkgtool` for menu-driven local maintenance.
- Use `slackpkg` for official mirror updates and repair.
- Use SlackBuilds when you want a reproducible package built from source.

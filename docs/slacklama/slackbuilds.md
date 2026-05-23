---
id: slackbuilds
title: SlackBuilds Workflow
tags:
  - slackbuild
  - makepkg
  - installpkg
  - source
summary: The standard SlackBuild packaging flow from source archive to installable package.
sources:
  - https://docs.slackware.com/slackware:slackbuild_scripts
  - https://docs.slackware.com/slackware:package_management_hands_on
---
# SlackBuilds Workflow

A SlackBuild is a Bourne-shell-compatible script that automates building a
Slackware package from source archives.

## Standard shape

1. unpack the source tarball into a working directory
2. create a `slack-desc`
3. configure and patch the source
4. compile the software
5. install into a temporary staging directory
6. copy docs and package metadata into the staging tree
7. run `makepkg`
8. install the resulting package with `installpkg`

## Typical directory contents

```text
app/
  app.SlackBuild
  app.info
  slack-desc
  app-1.0.tar.gz
  README
```

## Example build flow

```sh
# tar xvzf cowsay.tar.gz
# cd cowsay
# ./cowsay.SlackBuild
# installpkg /tmp/cowsay-3.03-noarch-1_SBo.tgz
```

## Practical advice

- Study the build system before writing a SlackBuild.
- Test the build manually before turning it into a script.
- Prefer reusable scripts over ad hoc `make install` runs.
- Keep package creation reproducible so you can rebuild later.

## Why Slackware likes this

Slackware treats packaging as something you should be able to inspect and
repeat. SlackBuilds keep the build steps visible and shareable while still
producing native Slackware packages.

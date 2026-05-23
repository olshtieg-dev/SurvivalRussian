# SlackLlama Knowledge Archive

This directory is a local, human-readable and machine-readable reference pack
for Slackware maintenance, packaging, booting, and basic system administration.

It is designed to be paired with the `slacklama` wrapper in `tools/slacklama/`
inside this repo, or with the live wrapper in `~/.local/bin`.
Both wrappers use the local `codellama:13b-instruct` model and feed it relevant
archive excerpts before each answer.

Repo archive path: `docs/slacklama`
Live archive path: `/home/c/slacklama`

## What is in here

- `index.json` - machine-readable topic index.
- `package-management.md` - pkgtools, slackpkg, rebuilds, and SlackBuilds.
- `booting-kernels.md` - huge vs generic kernels, initrd, and LILO updates.
- `init-and-services.md` - runlevels, rc scripts, and service startup behavior.
- `localization-console.md` - UTF-8 console setup and font helpers.
- `slackbuilds.md` - package-building workflow and directory layout.

## Source material

The archive is distilled from official Slackware documentation and SlackDocs:

- https://docs.slackware.com/slackware:package_management
- https://docs.slackware.com/slackware:package_management_hands_on
- https://docs.slackware.com/slackware:beginners_guide
- https://docs.slackware.com/slackbook:booting
- https://docs.slackware.com/howtos:slackware_admin:kernelbuilding
- https://docs.slackware.com/slackware:localization
- https://docs.slackware.com/howtos:misc:get_acquainted_with_slackware
- https://docs.slackware.com/slackware:slackbuild_scripts

## Usage idea

Ask `slacklama` for things like:

- package installation and removal
- kernel switching and initrd setup
- LILO edits
- service and runlevel questions
- SlackBuild packaging flow
- console encoding and font setup

## Rebuilding the index

Use the local generator whenever you add or change a topic page:

```sh
tools/slacklama/rebuild-slacklama-index
```

It scans the markdown front matter and regenerates `index.json`.

# Repository Instructions

## Default Response Rules

- Respond in polite Korean by default, unless the user explicitly asks for another language.
- Put the conclusion first, then separate confirmed facts from assumptions or unverified items.
- Do not make commits, create branches, push, publish, or deploy unless the user explicitly asks.
- Treat existing modified or untracked files as user or previous-work changes. Do not revert or overwrite them unless the user clearly requests it.
- Keep changes tightly scoped to the user's request. Avoid unrelated refactors, formatting churn, dependency updates, or generated-file changes.
- Do not claim that a command, test, build, deploy, or publish step succeeded unless it was actually run and completed successfully.

## Repository Role

This repository maintains the GitHub profile README for `Taeyoon0137`.

It is not an application runtime package or a reusable library. Its primary job is to generate and publish `README.md` from local source assets and templates.

Important files:

- `resources/README.preset.md`: source of truth for the profile README body.
- `resources/assets/preview/preview.light.png`: light-mode hero image source.
- `resources/assets/preview/preview.dark.png`: dark-mode hero image source.
- `resources/assets/preview/preview.preset.svg`: SVG template that embeds the light and dark preview images.
- `resources/assets/preview/preview.svg`: generated README hero SVG.
- `resources/assets/whatssub/whatssub.svg`: source logo embedded into the Whatssub badge.
- `scripts/readme.preview.ts`: generates `resources/assets/preview/preview.svg`.
- `scripts/readme.build.ts`: generates `README.md` from `resources/README.preset.md`.
- `package.json`: Yarn scripts and package metadata.

## Start-of-Work Checks

Before editing, check the current repository state and the relevant source files:

- Run `git status --short`.
- Confirm whether the requested change belongs in a source file or generated file.
- Check whether `CLAUDE.md` is a symbolic link to `AGENTS.md` when touching agent instructions.
- Read `package.json` before changing scripts, dependencies, or build behavior.
- Read `resources/README.preset.md` before changing README content.
- Read `scripts/readme.preview.ts` and `scripts/readme.build.ts` before changing README generation behavior.

## Source of Truth

- `AGENTS.md` is the source of truth for agent instructions.
- `CLAUDE.md` must remain a symbolic link to `AGENTS.md`.
- `resources/README.preset.md` is the source of truth for profile README content.
- `README.md` is generated. Do not finish README content changes by editing only `README.md`.
- `resources/assets/preview/preview.preset.svg`, `preview.light.png`, and `preview.dark.png` are the sources for `resources/assets/preview/preview.svg`.
- `resources/assets/preview/preview.svg` is generated. Do not finish hero SVG changes by editing only `preview.svg`.
- If a source file changes, regenerate the corresponding generated file and report the command used.

## Commands

Use the repository's Yarn Berry setup.

- Install dependencies: `yarn install`
- Generate the preview SVG: `yarn run readme:preview`
- Generate the README: `yarn run readme:build`
- Generate all README outputs: `yarn run readme`
- Publish workflow: `yarn run publish`

The `publish` script switches branches, commits, pulls from `develop` into `main`, and pushes. Do not run it unless the user explicitly requests publishing.

## Development Guidelines

- Prefer the existing TypeScript script style in `scripts/`.
- Keep generated README logic simple and explicit. This package only injects known local assets into templates.
- Use structured file APIs for file reads and writes in scripts.
- Keep Markdown and generated output formatted through the existing Prettier flow.
- Do not introduce new frameworks, build systems, or runtime abstractions for this small automation package.
- Do not store secrets, tokens, credentials, private URLs, or private operational details in this repository.

## Validation

After changes, run the smallest relevant checks:

- Agent instruction changes: `test -f AGENTS.md`, `test -L CLAUDE.md`, `test "$(readlink CLAUDE.md)" = "AGENTS.md"`, and `git diff --check`.
- README template or badge changes: `yarn run readme:build` and `git diff --check`.
- Preview image or SVG template changes: `yarn run readme:preview`, then `yarn run readme:build`, and `git diff --check`.
- Script or TypeScript configuration changes: run the affected `yarn run readme:*` command and `git diff --check`.
- Always finish by checking `git status --short`.

If a validation step cannot be run, report the reason clearly.

## Commit Guidelines

Only commit when the user explicitly requests it.

Use the recent repository style when it is clear from `git log`. Otherwise, prefer concise commit subjects such as:

- `chore: build`
- `docs: update agent instructions`
- `fix: update readme generation`
- `chore: update tooling`

Keep unrelated changes out of the commit. If user changes and agent changes are mixed in the same file, inspect the diff carefully and stage only the intended hunks.

## Claude Link

`CLAUDE.md` should be a symbolic link to `AGENTS.md`:

```sh
ln -s AGENTS.md CLAUDE.md
```

If `CLAUDE.md` already exists as a regular file or points somewhere else, do not overwrite it without user confirmation.

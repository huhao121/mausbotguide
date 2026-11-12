---
title: OpenMausBot CLI reference
description: The openmausbot commands you will actually use, covering host checks, the service, pairing, team files, engines, tokens and MCP.
verifiedOn: 0.1.152
sidebar:
  order: 1
  label: CLI reference
---

The common jobs, from setting up a server to giving bots work and changing the team, can be done with the `openmausbot` CLI, which is what you hand to an AI agent. Run `openmausbot help <command>` for details; the full docs are [upstream](https://github.com/milind-soni/OpenMausBot/blob/main/docs/headless-cli.md).

## Server

| Command | What it does |
|---|---|
| `openmausbot doctor --host` | Checks this Linux machine can run the server: OS, Docker, sandbox, disk, ports, clock |
| `openmausbot service install` | Installs a system service (start at boot, restart on crash); add `--tailscale` or `--tunnel` for remote access |
| `openmausbot browser install` | Installs the bots' browser; `browser status` checks it |
| `openmausbot doctor` | Checks the server answers, its version, who you are, and that an engine is ready |

## Pairing and access

| Command | What it does |
|---|---|
| `openmausbot pair --label "device"` | One-time pairing code (10 minutes); add `--public-url https://…` for a full link |
| `openmausbot connect <URL> --code <code> --out <file>` | Gets an access token from another machine |
| `openmausbot devices` | Lists paired devices; `devices revoke <ID>` signs one out |
| `openmausbot token create "name" --expires 90d --out <file>` | A token for scripts or CI that ends on its date; `token list`, `token revoke` |

## Giving bots work

| Command | What it does |
|---|---|
| `openmausbot bots` | All bots and what each is doing |
| `openmausbot run "<bot>" "<job>"` | Gives a job and waits for it to finish, printing the final reply |
| `openmausbot send "<bot>" "<message>" --task new` | Sends without waiting; `--task new` starts a new conversation |
| `openmausbot messages "<bot>" --limit 30` | The latest messages |
| `openmausbot wait "<bot>"` | Waits for running work |
| `openmausbot interrupt "<bot>"` | Presses Stop; `--tree` also stops every job it delegated |
| `openmausbot export "<bot>" --out <dir>` | Writes a job's result and files to a folder |

Long briefs: `--message-file brief.md`, or `-` to read stdin.

## Teams and models

| Command | What it does |
|---|---|
| `openmausbot team export --out team.yaml` | Writes your bots, rooms, models and permissions to a file |
| `openmausbot team apply team.yaml --dry-run` | Previews the changes without making them; `--check` exits 6 when there are changes, for CI |
| `openmausbot team apply team.yaml` | Makes the workspace match the file |
| `openmausbot models` | Models each engine offers |
| `openmausbot channels` | Your rooms |
| `openmausbot set-model "<bot>" <engine>/<model>` | Changes a bot's model |
| `openmausbot engine set <engine> --key-env <ENV_VAR>` | Gives an engine an API key without a screen; `--rotate` replaces one it already has |
| `openmausbot engine list` | The engines and whether each has a key |

`engine set` takes `claude`, `openai`, `openrouter`, `openai-compatible` (with `--base-url`), `xai`, `groq`, `greenference`, `modelgo`, `mistral` or `cerebras`. The key comes from an environment variable (`--key-env`) or a file (`--key-file`) and is never printed back.

## For scripts and other agents

- `--json` prints one JSON document; progress goes to stderr.
- `openmausbot mcp` serves the workspace as an MCP server, so Claude Code, Codex or OpenCode can hand jobs to your bots.
- `openmausbot events` streams the server's live events as JSON lines.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Done |
| 1 | Failed, stopped or stalled |
| 2 | Bad command line or file |
| 3 | A human must answer (question or approval card) |
| 4 | Timed out (the work keeps running) |
| 5 | Can't reach the server, not allowed, or the server is too old |
| 6 | `team apply --check` found changes to apply |
| 7 | `doctor --host`: this machine is missing something the server needs |
| 130 | Ctrl-C (the work keeps running) |

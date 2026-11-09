---
title: Glossary
description: The terms this guide uses and what the OpenMausBot app and CLI call them, from bots and engines to approval levels and routines.
sidebar:
  order: 3
  label: Glossary
---

The table maps the words in this guide to the labels in the OpenMausBot app and the values the CLI and team file use.

## Basics

| This guide | App / CLI | What it is |
|---|---|---|
| Bot | bot | A contact in the chat list, backed by a real AI agent with its own model, memory, working folder and permissions |
| MausBot | Chief of Staff | The first bot on a new install. It can hand work to other bots, and its approval level carries over to the work it hands out |
| Server | home, server | The machine running OpenMausBot. All bots, sign-ins and memory live there |
| Engine | Model providers, engine | The agent CLI or API a bot runs on: Claude Code, Codex, OpenCode, Antigravity, any OpenAI-compatible endpoint… |
| Conversation | thread, `--task new` | One stretch of chat with a bot. One job per conversation keeps context small |
| Standing instructions | Soul, `SOUL.md` | Instructions included in every turn: what the bot owns and whom to hand which problems to |
| Skill | skill | A procedure the bot saved and reuses for similar jobs |
| Routine | Routines; the Automations page | A schedule that wakes a bot to do a job, such as every day at 9:00 |
| Team file | team file, `team.yaml` | One YAML file describing all bots, rooms, models and permissions; export, edit, apply |
| Computer | Bot desktops; `computer: vm`, `local`, `cloud`… | A desktop the bot can screenshot, click and type in |
| Pairing | pair | Giving a new browser, desktop app or phone access to the server. Codes last 5 minutes and work once |

## Approval levels

The approval level decides what a bot asks you about first; the full explanation is in [approval levels](/concepts/approval-levels/). Change it under **Bot settings → Permissions**, or for one conversation only.

| App | Team file / CLI | Behavior |
|---|---|---|
| Ask for approval | `ask` | Asks before commands and file changes |
| Auto-accept edits | `edits` | Edits files freely, asks before commands. Only on engines that offer it (Claude, Antigravity, Grok…), not OpenCode or Codex |
| Approve for me | `auto` | The engine's own reviewer approves routine actions and asks about the rest; engines without one fall back to Ask |
| Full access | `full` | No approval cards. **Every new bot starts here** |

Notes:

- Unattended bots (routines, webhooks) need Full access, or they wait on a card nobody answers.
- Full access doesn't sign in for you or bypass CAPTCHAs, MFA or OS privacy controls.
- Approval cards offer **Allow once**, **Always allow** and **Deny**.

## Conventions in this guide

- **`<…>` is a placeholder** for your own value, such as `<server-ip>` or `<bot>`.
- **`myserver`** is the example SSH alias. Use the name you gave your server in `~/.ssh/config`.
- **"Hand this to your agent" prompts** are for a local agent such as Claude Code, Codex or OpenCode; paste the whole block.
- **"Brief for the bot"** blocks are messages you send to a bot inside OpenMausBot.

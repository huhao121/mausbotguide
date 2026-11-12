---
title: Glossary
description: The terms this guide uses and what the OpenMausBot app and CLI call them, from bots and engines to approval levels and routines.
verifiedOn: 0.1.152
sidebar:
  order: 3
  label: Glossary
---

The app has a simple interface (the default on a new install) and an advanced one (**Settings → General → Advanced mode**), and a few labels differ between them. The table maps the words in this guide to the labels in the app and the values the CLI and team file use.

## Basics

| This guide | App / CLI | What it is |
|---|---|---|
| Bot | bot | A contact in the chat list, backed by a real AI agent with its own model, memory, working folder and permissions |
| MausBot | Chief of Staff | The first bot on a new install. It can hand work to other bots, and the level of its conversation may carry over to the work it hands out (with exceptions; see approval levels) |
| Server | home, server | The machine running OpenMausBot. All bots, sign-ins and memory live there |
| Engine | Settings → AI (simple); Model providers (advanced); engine | The agent CLI or API a bot runs on: Claude Code, Codex, OpenCode, Antigravity, any OpenAI-compatible endpoint… |
| Conversation | thread, `--task new` | One stretch of chat with a bot. One job per conversation keeps context small |
| Standing instructions | Instructions (simple), Soul (advanced), `SOUL.md` | Instructions included in every turn: what the bot owns and whom to hand which problems to |
| Skill | skill | A procedure the bot saved and reuses for similar jobs |
| Routine | Routines in the bot's profile (simple); Tools → Automations (advanced) | A schedule that wakes a bot to do a job, such as every day at 9:00 |
| Team file | team file, `team.yaml` | One YAML file describing all bots, rooms, models and permissions; export, edit, apply |
| Computer | Your bots' computers (simple); Bot desktops (advanced); `computer: vm`, `local`, `cloud`… | A desktop the bot can screenshot, click and type in |
| Pairing | pair | Giving a new browser, desktop app or phone access to the server. On a self-hosted server a code lasts 10 minutes by default and works once |

## Approval levels

The approval level decides what a bot asks you about first; the full explanation is in [approval levels](/concepts/approval-levels/). In the simple interface, change it under **Before \{bot\} acts** in **Bot settings** (Ask me first or Just do it), or pick a level for one conversation (which ones depends on the engine). In the advanced interface it is **Permissions → Approval level**.

| Simple | Advanced | Team file / CLI | Behavior |
|---|---|---|---|
| Ask me first | Ask for approval | `ask` | Usually asks before commands and file changes; Codex and a few exemptions differ |
| Auto-accept edits | Auto-accept edits | `edits` | Edits files freely; other actions can still ask. Only Claude, Grok, Antigravity, Qwen and Gemini offer it, not OpenCode or Codex |
| Decide for me | Approve for me | `auto` | The engine's own automatic review approves routine actions and asks about the rest, and web search doesn't ask; when it isn't available, other requests usually fall back to asking; Antigravity's Auto is full access |
| Just do it | Full access | `full` | No ordinary approval cards (sending through connected apps has its own setting). **New bots start here** (a hosted company workspace starts at Ask me first) |

Notes:

- Unattended bots (routines, webhooks) at Ask me first stop at any action that needs approval and wait on a card nobody answers, or stop when the wait times out. For unattended bots that can't reach anything sensitive, Just do it is simpler.
- Just do it doesn't sign in for you or bypass CAPTCHAs, MFA or OS privacy controls.
- Approval cards offer **Allow once** and **Deny**, and depending on the request one more button, **Always allow**. Its hover hint says how far it reaches: that tool, that command or this session.

## Conventions in this guide

- **`<…>` is a placeholder** for your own value, such as `<server-ip>` or `<bot>`.
- **`myserver`** is the example SSH alias. Use the name you gave your server in `~/.ssh/config`.
- **"Hand this to your agent" prompts** are for a local agent such as Claude Code, Codex or OpenCode; paste the whole block.
- **"Brief for the bot"** blocks are messages you send to a bot inside OpenMausBot.

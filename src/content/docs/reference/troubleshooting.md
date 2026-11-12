---
title: Common problems and fixes
description: Common problems when setting up a self-hosted OpenMausBot server, with the exact messages and what fixes them.
verifiedOn: 0.1.152
sidebar:
  order: 2
  label: Troubleshooting
---

Each heading is the message or symptom you will see. Paste any of them into your agent together with the fix
below.

## A task ran for tens of minutes

Look at how many steps the turn took first. A turn with dozens of model calls and tool runs adds up, since each one takes time. Split the job, start a new conversation, or have the bot turn repeat work into a script. See [why a bot takes tens of minutes on one task](/concepts/long-tasks/).

## "Tailscale refused: on Linux run `sudo tailscale set --operator=$USER` once, then try again"

You see this when a service that uses Tailscale starts. Tailscale on Linux refused an action from a non-root user. Run `sudo tailscale set --operator=<server user>` so the user running OpenMausBot may operate Tailscale too, then try again.

## The pairing link says the code expired

On a self-hosted server a code lasts ten minutes and works once. Make a new one on the server with `openmausbot pair --label "<device>"` (add `--public-url https://…` when you use Tailscale or a tunnel), or under **Settings → Computer → This server → Create code** on a device paired with full access.

## Connected apps (Gmail, Slack, GitHub…) are all gray

If Connected apps says "Connected apps are not set up yet", add a **Composio project key** under **Settings → AI → API keys → Apps and tools**. You can also add your own MCP server under **Apps → MCP servers**, or install a CLI such as `gh` on the server. A server using its own Composio key can call app tools but can't watch app events yet.

## Claude sign-in fails

In the simple interface, open **Settings → AI** and click the button on Claude's row (**Set up** when it isn't ready, **Manage** when it is), open the complete sign-in page, check the browser is signed into the Claude account with the subscription, and paste back the whole code it shows. See [how to sign in to engines](/guides/sign-in-engines/).

## New OpenCode models don't show up

0.1.145 fixed this: OpenCode 2.2.5, which the app installed then, rejected the old refresh command, so Refresh didn't pick up new models; now the running server checks periodically and reads the model list again once the last read is more than three hours old, and Refresh now uses a method OpenCode 2 accepts. On an older version, upgrade: see [how to upgrade safely](/guides/upgrade/).

## The phone loads the page but stays on "connecting"

Check whether the path is relayed: when Tailscale can't open a direct connection it falls back to a relay (DERP), which is slower than direct. Run `tailscale status` on the server: if the phone's line shows `relay "…"`, the connection is relayed. See [remote access](/guides/remote-access/).

## Ubuntu desktop: bots can't see or control the screen

In a GNOME Wayland session, OpenMausBot can only preview this computer's screen for now, not control it. Use Ubuntu Server and give bots a desktop in a container (a local virtual desktop), or switch to a GNOME Xorg session, turn on **Enable local control (Beta)** and assign the bot to this computer.

## `service install` from npx installs a copy first

npm prunes the npx cache, so when run from npx, `service install` first installs the same version under `app/<version>` in the data folder and points the service at that copy. If that install fails, it prints an `npm install --prefix …` command; run it, then run `service install` again from that copy.

## `service install` succeeded but nothing starts at boot

On Linux it only writes the unit and prints three sudo commands: copy the file to `/etc/systemd/system/openmausbot.service`, `daemon-reload`, then `enable --now`. On a Mac it writes a launchd agent and prints its commands too; it then starts when you log in, not at boot. Then check with `openmausbot doctor` that the server answers.

## Bots can't use a browser on an Ubuntu server

Two steps, in order: install the system libraries once as administrator (`sudo -H npx --yes openmausbot browser install --with-deps`), then install the browser as the account that runs the server (`openmausbot browser install`). The administrator's install lands in a different home and doesn't count. On Ubuntu 24.04, an AppArmor `DENIED` for `userns` means the sandbox is blocked: add a per-program AppArmor profile as the OpenMausBot docs describe. Don't add `--no-sandbox` and don't turn off the kernel restriction globally.

## `doctor --host` exits 7

The machine is missing something the server needs, and each `FAIL` line is followed by a `fix:`. It checks whether AppArmor allows unprivileged user namespaces, cgroup v2, seccomp, free space for the data folder (at least 10 GB, 100 GB for a Team server), CPUs and memory, ports and the clock. Run it with `sudo` and work through each line before installing. Watch the AppArmor line: its `fix:` may suggest turning the restriction off server-wide with `sysctl`; if you'd rather not, see the section above first.

## "… is waiting on its model: no reply for …, but its request is still open."

The model request is still open: it may be waiting on the model or compressing history, though the request itself could also be stuck. The server's own explanation: slow models and rate limits look like this, and if the message says the history is nearly full, it may be compressing it. Wait, or start a new conversation.

## "Computer still busy … Parked — it continues automatically when the computer is free."

The computer is in use. This job queues and carries on by itself once the computer is free. Not a fault. If it matters, give the bot its own computer or move jobs to other times.

## A pairing code is refused

On a self-hosted server a code expires after ten minutes (or its `--ttl`, up to a day) and works once; make a new one. The pairing card in Settings says codes "expire after five minutes"; go by the expiry time shown under the code. Five wrong codes in five minutes from one address lock that address for five minutes, with "Too many wrong codes. Try again at …". Behind a proxy that doesn't pass on the client's address, five wrong codes lock no one out; instead unused codes stop working (except the browser sign-in kind) and you make a new one. A server restart drops every unused code.

## An engine is listed but won't run

Check which reason it is. If the engine's CLI isn't installed or isn't on the PATH of the account running OpenMausBot, install it for that account, or in the advanced interface open **Settings → Model providers and accounts**, expand **CLI path and updates** and point at the executable with **Set CLI…**. "No API key — open Settings → API keys." means the key is missing. Neither is a sign-in problem.

## "A newer stable Codex CLI is available … Update it, then refresh models."

You see this when a newer stable Codex CLI is out and yours is behind. Update with the command the app's Codex engine card shows (if Codex isn't on the default path, it points at the one you configured), then refresh the model list in the app. Which models you get also depends on the signed-in account.

## Same-name OpenCode models cost differently

`Go · …` uses your Go subscription; `Zen · …` is an OpenCode Zen model, outside the Go subscription, and Zen's free models have an allowance of their own. Check the prefix before you pick.

## A Claude account ran out of quota

Not a fault: switch that bot to another engine for now, or wait. A routine that hits this moves to another AI if one can carry on; if none can, and the limit says it resets within 12 hours, the run is put back for just after the reset.

## `team apply` exits 2

It refused before writing anything and says why. Common causes: a `cwd` that isn't a full path on the server (`~` is refused too), a model not written as `INSTANCE/MODEL`, a key written into the file instead of `{ env: NAME }`, a duplicate name, two Chiefs of Staff in one team, or a missing file or environment variable. Use `--dry-run` to see the plan first; `--check` returning 6 means there are changes to apply.

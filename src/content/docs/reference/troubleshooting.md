---
title: Common problems and fixes
description: Common problems when setting up a self-hosted OpenMausBot server, with the exact messages and what fixes them.
verifiedOn: 0.1.146
sidebar:
  order: 2
  label: Troubleshooting
---

Each heading is the message or symptom you will see. Paste any of them into your agent together with the fix
below.

## A task runs for tens of minutes

Look at how many steps it took. A single model call usually takes 5 to 17 seconds; a turn with dozens of model calls
and tool runs adds up fast. Split the job, start a new conversation, or have the bot turn repeat work into a script.
See [why one task can take an hour](/concepts/long-tasks/).

## "Tailscale refused: on Linux run `sudo tailscale set --operator=$USER` once"

The service crash-loops after `service install --tailscale`. Tailscale only lets root manage it by default. Run
`sudo tailscale set --operator=<server user>` and restart the service.

## The pairing link says the code expired

Codes last five minutes and work once. Make a new one on the server with `openmausbot pair --label "<device>"`
(add `--public-url https://…` when you use Tailscale or a tunnel), or under **Settings → Remote access → Create pairing code** from a device
that is already paired.

## Connected apps (Gmail, Slack, GitHub…) are all greyed out

On a self-hosted server they need a **Composio project key**: **Settings → API keys → Self-host connected apps**. Or
use an MCP server instead, or install a CLI such as `gh` on the server. A self-hosted Composio key can call tools
but cannot watch app events yet.

## Claude sign-in: "try a different browser"

Generic message. Start a fresh sign-in, open the complete link (nothing cut off), make sure the browser is signed into
the Claude account that has the subscription, and paste the whole code back. [More on engine sign-in](/guides/sign-in-engines/).

## Gemini / Antigravity: "User location is not supported"

The server may reach Google by a different route from your other machines. Compare their DNS and outbound routes first, then fix the difference.

## Only Zen models show up after copying an OpenCode login

Fixed in 0.1.145: the model list now refreshes on its own. On an older version, [upgrade](/guides/upgrade/).

## The phone loads the page but stays on "connecting"

Usually a slow relay path: `tailscale ping <phone>` shows `via DERP` with high latency. Static files load but the live
event stream does not. See [remote access](/guides/remote-access/).

## `cloudflared`: "TLS handshake with edge error: EOF"

A proxy between the server and the internet is interfering with the tunnel connection. A tunnel cannot work through
that path; the server needs direct outbound access on the tunnel's ports.

## Ubuntu desktop: bots cannot see or control the screen

Ubuntu's Wayland session is disabled for host control. Use Ubuntu Server and let bots use a containerized desktop
(local VM), or pick an Xorg session (beta).

## `service install` refuses to run from an npx cache

It says the command runs from an npx cache, which npm may delete at any time. Install the package permanently
(`npm install -g openmausbot`), then run `openmausbot service install` from that install.

## `service install` succeeds, but nothing starts at boot

On Linux it only writes the unit file and prints three commands. Run them: copy the file to
`/etc/systemd/system/openmausbot.service`, `daemon-reload`, then `enable --now`. On a Mac it writes a launchd plist and
prints what to run. `openmausbot doctor` then confirms the server answers.

## Bots cannot use a browser on an Ubuntu server

Two steps are needed, in this order: install the system libraries once as an administrator
(`sudo -H npx --yes openmausbot browser install --with-deps`), then install the browser as the account that runs the
server (`openmausbot browser install`). The administrator's download lands in a different home and does not count. On
Ubuntu 24.04 an AppArmor `DENIED` for `userns` means the sandbox is blocked: add the per-binary AppArmor profile from
the OpenMausBot docs. Do not pass `--no-sandbox` or switch the kernel restriction off globally.

## `doctor --host` exits with code 7

That is its way of saying this machine is missing something the server needs; each `FAIL` line carries a `fix:`.
Common ones: AppArmor blocking unprivileged user namespaces, only cgroup v1, no seccomp, and too little free space in
the data folder (it wants at least 10 GB, and 100 GB for a Team server). Run it with `sudo` and fix the `FAIL`s one by
one before installing.

## "… is waiting on its model: no reply for 60 s, but its request is still open"

Not a hang. Slow models and provider rate limits look exactly like this, and a conversation close to the context limit
may be compressing its history. Wait, or start a new conversation. On a plan quota, the notice says when it resets.

## "Waiting for its turn on this computer — 1st in queue"

Two bots wanted the same computer. The second one queues and starts by itself; the message "Computer free — continuing
after waiting 3 minutes" means it resumed. Nothing to fix; if it matters, give that bot its own computer or run the
jobs at different times.

## A pairing code is refused

Codes expire after five minutes (or their `--ttl`) and work once; mint a new one. "Too many failed pairing attempts"
means wait a minute. A server restart ends every open code.

## An engine is listed but unusable

Two different reasons, both shown in **Settings → Model providers**: "`x` isn't installed, or isn't on this app's PATH"
means install the CLI for the account running OpenMausBot, or use **Set CLI** to point at it; "No API key — open
Settings → API keys" means add the key. Neither is a sign-in problem.

## A ChatGPT plan says "Continue with ChatGPT in Settings"

The Codex CLI is signed in, but the separate ChatGPT-plan instance is not. Open **Settings → Model providers → ChatGPT**
and continue the sign-in there; the one sign-in covers both rows in the usage page.

## Codex works, but some models are missing

Codex itself prints "A newer stable Codex CLI is available… Update it, then refresh models." Run `codex update`, then
refresh the model list in the app. Model availability also depends on the signed-in account.

## Models are missing from OpenCode

OpenCode hides any model listed in a `whitelist` or `blacklist` under its provider in `opencode.json`. Remove it from
that list and refresh. A different provider prefix (`opencode-go/` versus `opencode/`) also means a different quota:
the first uses your Go subscription, the second bills your Zen balance.

## A Claude account has reached its limit

The conversation says which limit and when it resets ("…which resets in 1 hour 39 minutes"). Nothing is broken: switch
that bot to another engine for now, or wait. A routine that hits this is put back just after the reset when that is
within 12 hours.

## `team apply` exits with code 2

It refuses before writing anything, naming the problem. Usual causes: `cwd` that is not a full path on the server
(`~` is refused too), a model not written as `INSTANCE/MODEL`, a key written into the file instead of `{ env: NAME }`,
a duplicate name, two Chiefs in one team, or a file or environment variable that does not exist. `--check` shows the
same list without changing anything; exit code 6 from `--check` means there are changes to apply.

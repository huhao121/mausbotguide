---
title: 故障排除
description: 搭建自托管 OpenMausBot 服务器时的常见问题，附原始报错和解决办法。
verifiedOn: 0.1.146
sidebar:
  order: 2
  label: 故障排除
---

每个标题就是你会看到的报错或现象。把它连同下面的解决办法一起贴给你的 AI Agent 即可。

## 一个任务跑了几十分钟

先看它这一轮走了多少步。一次模型调用通常 5 到 17 秒，一轮里有几十次模型调用和工具执行，时间就会累积起来。把任务拆小、开一个新会话，或者让 Bot 把重复的活写成脚本。请参阅[为什么 Bot 一个任务要跑几十分钟](/zh/concepts/long-tasks/)。

## "Tailscale refused: on Linux run `sudo tailscale set --operator=$USER` once"

执行 `service install --tailscale` 后服务一直崩溃重启。Tailscale 默认只允许 root 管理它。运行 `sudo tailscale set --operator=<服务器用户>`，然后重启服务。

## 配对链接提示码已过期

配对码只有 5 分钟有效，而且只能用一次。在服务器上用 `openmausbot pair --label "<设备名>"` 生成一个新的（用 Tailscale 或隧道时加上 `--public-url https://…`），或者在已配对的设备上，到 **设置 → 远程访问 → 生成配对代码** 里生成。

## 已连接的应用（Gmail、Slack、GitHub……）全是灰的

自托管服务器需要在 **设置 → API 密钥 → 自建已连接应用服务** 里填一个 **Composio 项目密钥**。也可以改用 MCP server，或者在服务器上装 `gh` 这类命令行工具。自托管的 Composio 密钥能调用工具，但暂时不能监听应用事件。

## Claude 登录提示 "try a different browser"

这是一句笼统的提示。重新发起一次登录，打开完整的链接（不要被截断），确认浏览器里登录的是有订阅的那个 Claude 账号，再把整段授权码粘回去。[详见如何登录引擎](/zh/guides/sign-in-engines/)。

## Gemini / Antigravity 提示 "User location is not supported"

服务器访问 Google 的线路可能和其他机器不同。先比较两台机器的 DNS 和出站线路，找到差别再处理。

## 搬了 OpenCode 登录后只看到 Zen 的模型

0.1.145 已修复：模型列表会自动刷新。用的是更老的版本就升级，见[如何安全升级](/zh/guides/upgrade/)。

## 手机能打开页面，但一直卡在“正在连接”

通常是走了很慢的中继线路：`tailscale ping <手机>` 显示 `via DERP`，延迟很高。页面能加载，但实时事件流跟不上。请参阅[远程访问](/zh/guides/remote-access/)。

## `cloudflared` 报 "TLS handshake with edge error: EOF"

服务器和互联网之间的代理干扰了隧道连接。经过这条线路，隧道无法工作；服务器需要能直接访问隧道所用的出站端口。

## Ubuntu 桌面版：Bot 看不到也控制不了屏幕

出于安全考虑，OpenMausBot 不支持操控 Ubuntu 的 Wayland 会话。改用 Ubuntu Server，让 Bot 用容器里的桌面（本地 VM），或者切换到 Xorg 会话（beta）。

## `service install` 拒绝执行，说自己在 npx 缓存里

它提示这条命令是从 npx 的缓存目录运行的，而 npm 随时可能删掉那个目录。先用 `npm install -g openmausbot` 正式安装，再从那套安装里运行 `openmausbot service install`。

## `service install` 执行成功，但开机没有自启

在 Linux 上它只写出服务文件，然后打印三条命令。照着执行：把文件复制到 `/etc/systemd/system/openmausbot.service`，`daemon-reload`，再 `enable --now`。在 Mac 上它写的是 launchd 配置，同样会打印要执行的命令。之后用 `openmausbot doctor` 确认服务端有响应。

## Ubuntu 服务器上 Bot 用不了浏览器

要按顺序做两步：先用管理员身份装一次系统依赖（`sudo -H npx --yes openmausbot browser install --with-deps`），再以运行服务端的那个账号装浏览器（`openmausbot browser install`）。管理员装到的是另一个家目录，不算数。Ubuntu 24.04 上如果看到 AppArmor 对 `userns` 报 `DENIED`，说明沙箱被拦了：按 OpenMausBot 文档给这个程序单独加 AppArmor 配置，不要加 `--no-sandbox`，也不要全局关掉内核限制。

## `doctor --host` 退出码是 7

这是在说这台机器缺少服务端需要的东西，每条 `FAIL` 后面都跟着 `fix:`。常见的几条：AppArmor 不允许非特权用户命名空间、只有 cgroup v1、没有 seccomp、数据目录剩余空间不够（至少要 10 GB，Team 服务端要 100 GB）。用 `sudo` 运行它，逐条修好再装。

## “……在等模型：60 秒没有回复，但请求还开着”

不是卡死。模型慢、服务商限流，都是这个表现；上下文快满的会话也可能正在压缩历史。等一会儿，或者新开一个会话。如果是订阅额度用完了，提示里会写什么时候重置。

## “正在等这台电脑空出来——排第 1 位”

两个 Bot 同时要用同一台电脑。后到的会排队，之后自己开始；看到“电脑已空出——等待 3 分钟后继续”，说明它接着跑了。这不是故障。要紧的话，给这个 Bot 单独配一台电脑，或者把两个任务错开时间。

## 配对码被拒绝

配对码 5 分钟后失效（或者按 `--ttl` 指定的时间），而且只能用一次；重新生成一个。提示“尝试次数过多”就等一分钟。服务端重启会让所有还没用掉的配对码失效。

## 引擎已列出，但用不了

**设置 → 模型提供方** 里会把两种原因分开写：“`x` 没有安装，或者不在这个应用的 PATH 里”，意思是给运行 OpenMausBot 的那个账号装上这个 CLI，或者在 **设置 CLI** 里指定路径；“没有 API key——请在设置 → API 密钥里添加”，意思是缺密钥。这两种都不是登录问题。

## ChatGPT 方案提示“在设置里继续登录 ChatGPT”

Codex CLI 已经登录了，但单独的 ChatGPT 方案实例还没有。打开 **设置 → 模型提供方 → ChatGPT** 在那里继续登录；登录一次，用量页上那两行就都有了。

## Codex 能用，但少了几个模型

Codex 自己会提示“有更新的稳定版……更新后刷新模型”。先运行 `codex update`，再在应用里刷新模型列表。另外，能选哪些模型还取决于登录的账号。

## OpenCode 里少了某些模型

OpenCode 会隐藏 `opencode.json` 里对应服务商下 `whitelist` 或 `blacklist` 中的模型，把它们从名单里去掉再刷新就好。还要注意前缀不同的模型扣的钱不一样：`opencode-go/` 走 Go 订阅，`opencode/` 扣 Zen 余额。

## Claude 账号额度用完了

对话里会写明是哪个额度、什么时候重置（比如“……将在 1 小时 39 分钟后重置”）。这不是故障：先把那个 Bot 临时换到别的引擎，或者等它恢复。定时任务遇到这种情况，如果重置在 12 小时以内，会排到重置之后重跑。

## `team apply` 退出码是 2

它在写入任何东西之前就拒绝，并指出问题。常见原因：`cwd` 不是服务器上的绝对路径（写 `~` 也会被拒绝）、模型没写成 `INSTANCE/MODEL`、把 key 直接写进了文件而不是 `{ env: NAME }`、名字重复、一个团队里有两个 Chief of Staff、引用的文件或环境变量不存在。加 `--check` 可以在不改动的情况下看到同样的清单；`--check` 返回 6 表示确实有改动要应用。

---
title: 故障排除
description: 搭建自托管 OpenMausBot 服务器时的常见问题，附原始报错和解决办法。
verifiedOn: 0.1.152
sidebar:
  order: 2
  label: 故障排除
---

每个标题就是你会看到的报错或现象。标题里写成英文的提示，在中文界面里也显示英文，所以照原样写。把它连同下面的解决办法一起贴给你的 AI Agent 即可。

## 一个任务跑了几十分钟

先看它这一轮走了多少步。一轮里有几十次模型调用和工具执行，每次都要花时间，就会累积起来。把任务拆小、开一个新会话，或者让 Bot 把重复的活写成脚本。请参阅[为什么 Bot 一个任务要跑几十分钟](/zh/concepts/long-tasks/)。

## "Tailscale refused: on Linux run `sudo tailscale set --operator=$USER` once, then try again"

启动用 Tailscale 的服务时出现这句。Linux 上的 Tailscale 拒绝了非 root 用户的操作。运行 `sudo tailscale set --operator=<服务器用户>`，让运行 OpenMausBot 的那个用户也能操作 Tailscale，然后再试一次。

## 配对链接提示码已过期

自托管服务器的配对码 10 分钟内有效，只能用一次。在服务器上用 `openmausbot pair --label "<设备名>"` 生成一个新的（用 Tailscale 或隧道时加上 `--public-url https://…`），或者在已配对、有完全访问权限的设备上，到 **设置 → 电脑 → 这台服务器 → 生成配对码** 里生成。

## 已连接的应用（Gmail、Slack、GitHub……）全是灰的

如果已连接的应用提示「尚未设置已连接的应用」，就在 **设置 → AI → API 密钥 → 应用与工具** 里填一个 **Composio 项目密钥**。也可以在 **应用 → MCP 服务器** 里加自己的 MCP 服务器，或者在服务器上装 `gh` 这类命令行工具。用自己 Composio 密钥的服务器能调用工具，但暂时不能监听应用事件。

## Claude 登录失败

在简洁模式的 **设置 → AI** 里点 Claude 那一行的按钮（没就绪时叫 **设置**，已就绪时叫 **管理**），打开完整的登录页，确认浏览器里登录的是有订阅的那个 Claude 账号，再把页面上显示的代码整段粘回去。详见[如何登录引擎](/zh/guides/sign-in-engines/)。

## OpenCode 的新模型没出现

0.1.145 修了这个问题：之前 App 安装的 OpenCode 2.2.5 不认旧的刷新命令，点刷新也读不到新模型；现在服务运行时会定期检查，上次读取超过三小时就重读模型列表，刷新也改成了 OpenCode 2 能用的方式。用的是更老的版本就升级，见[如何安全升级](/zh/guides/upgrade/)。

## 手机能打开页面，但一直卡在“正在连接”

先看是不是走了中继线路：Tailscale 打不通直连时会改走中继（DERP），比直连慢。在服务器上运行 `tailscale status`，手机那一行写着 `relay "…"` 就是在走中继。请参阅[远程访问](/zh/guides/remote-access/)。

## Ubuntu 桌面版：Bot 看不到也控制不了屏幕

在 GNOME Wayland 会话里，OpenMausBot 目前只能预览本机屏幕，不能操控。改用 Ubuntu Server，让 Bot 用容器里的桌面（本地虚拟桌面），或者切换到 GNOME Xorg 会话，打开 **启用本机控制（测试版）**，再把 Bot 的电脑指派为这台电脑。

## 从 npx 运行 `service install` 时先装了一份程序

npm 会清理 npx 的缓存，所以从 npx 运行时，`service install` 会先把同一个版本装到数据目录下的 `app/<版本>` 里，服务用那一份。装不上的话它会打印一条 `npm install --prefix …` 命令，手动执行后再用那份程序运行 `service install`。

## `service install` 执行成功，但开机没有自启

在 Linux 上它只写出服务文件，然后打印三条要用 sudo 执行的命令：把文件复制到 `/etc/systemd/system/openmausbot.service`，`daemon-reload`，再 `enable --now`。在 Mac 上它写的是 launchd 配置，同样会打印要执行的命令，装好后在你登录时启动，不是开机就启动。之后用 `openmausbot doctor` 确认服务端有响应。

## Ubuntu 服务器上 Bot 用不了浏览器

要按顺序做两步：先用管理员身份装一次系统依赖（`sudo -H npx --yes openmausbot browser install --with-deps`），再以运行服务端的那个账号装浏览器（`openmausbot browser install`）。管理员装到的是另一个家目录，不算数。Ubuntu 24.04 上如果看到 AppArmor 对 `userns` 报 `DENIED`，说明沙箱被拦了：按 OpenMausBot 文档给这个程序单独加 AppArmor 配置，不要加 `--no-sandbox`，也不要全局关掉内核限制。

## `doctor --host` 退出码是 7

这是在说这台机器缺少服务端需要的东西，每条 `FAIL` 后面都跟着 `fix:`。会检查的有：AppArmor 是否允许非特权用户命名空间、cgroup v2、seccomp、数据目录剩余空间（至少 10 GB，Team 服务端要 100 GB）、CPU 和内存、端口、时钟。用 `sudo` 运行它，逐条处理再装。注意 AppArmor 那一条，`fix:` 可能建议用 `sysctl` 全局关掉这项限制；不想全局放开的话，先看上一节的做法。

## "… is waiting on its model: no reply for …, but its request is still open."

这表示模型请求还开着，可能是在等模型或在压缩历史，但也不排除请求本身卡住。服务端的说明是：模型慢、服务商限流都是这个表现；如果提示后面写着会话历史快满了，它可能正在压缩历史。等一会儿，或者新开一个会话。

## "Computer still busy … Parked — it continues automatically when the computer is free."

这台电脑正被占用。这个任务会排队，电脑空出来后自己接着跑。这不是故障。要紧的话，给这个 Bot 单独配一台电脑，或者把任务错开时间。

## 配对码被拒绝

自托管服务器的配对码 10 分钟后失效（或者按 `--ttl` 指定的时间，最长一天），而且只能用一次；重新生成一个。设置页配对卡片的说明写着「五分钟后失效」，实际以代码下面显示的到期时间为准。同一个地址 5 分钟内输错 5 次会被锁 5 分钟，提示「错误的代码太多。请在 … 再试一次。」。如果服务器在一个不转发客户端地址的代理后面，输错 5 次不会锁人，而是让没用掉的配对码失效（浏览器登录用的那类除外），需要重新生成。服务端重启会让所有还没用掉的配对码失效。

## 引擎已列出，但用不了

先看是哪种原因：引擎的命令行没装，或者不在运行 OpenMausBot 的那个账号的 PATH 里，就给那个账号装上，或者在高级模式的 **设置 → 模型提供方与账户** 里展开 **CLI 路径与更新**，用 **设置命令行…** 指定可执行文件；提示 "No API key — open Settings → API keys." 就是缺密钥。这两种都不是登录问题。

## "A newer stable Codex CLI is available … Update it, then refresh models."

检测到有更新的 Codex 稳定版、而你装的版本落后时会看到这句。用应用里 Codex 引擎卡片给出的更新命令更新（Codex 不在默认路径时，命令会指向你配置的那份），再在应用里刷新模型列表。能选哪些模型还取决于登录的账号。

## OpenCode 里同名模型扣的钱不一样

`Go · …` 用的是 Go 订阅，`Zen · …` 是 OpenCode Zen 的模型，不算在 Go 订阅里；Zen 的免费模型另有自己的额度。选模型时看清前缀。

## Claude 账号额度用完了

这不是故障：先把那个 Bot 临时换到别的引擎，或者等它恢复。定时任务遇到这种情况：有别的 AI 能接手时，会换到那个 AI 上重跑；没有的话，如果提示里写了重置时间、而且在 12 小时以内，会排到重置之后重跑。

## `team apply` 退出码是 2

它在写入任何东西之前就拒绝，并指出问题。常见原因：`cwd` 不是服务器上的绝对路径（写 `~` 也会被拒绝）、模型没写成 `INSTANCE/MODEL`、把 key 直接写进了文件而不是 `{ env: NAME }`、名字重复、一个团队里有两个 Chief of Staff、引用的文件或环境变量不存在。先用 `--dry-run` 看计划；`--check` 返回 6 表示确实有改动要应用。

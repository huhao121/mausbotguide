---
title: 术语表
description: 本站用语和 OpenMausBot 界面用语的对照：Bot、引擎、会话、审批级别、定时任务、常驻指令……以及教程里占位符的写法。
sidebar:
  order: 3
  label: 术语表
---

OpenMausBot 的界面会跟随系统语言显示，简体中文界面里的叫法和本站略有不同。下表列出两边的对应关系，命令行和团队文件里的写法也一并列出。

## 基本概念

| 本站用语 | 中文界面 | 英文界面 / CLI | 是什么 |
|---|---|---|---|
| Bot | 机器人 | bot | 聊天列表里的一个联系人，背后是一个 AI Agent，有自己的模型、记忆、工作目录和权限 |
| MausBot | 总协调机器人 | Chief of Staff | 新装好后的第一个 Bot，可以给其他 Bot 派活，它的审批级别会传给它派出去的任务 |
| 服务端 / 服务器 | 服务器；「把 X 设为我常用的」就是把 X 设为主服务器 | home、server | 运行 OpenMausBot 的那台机器。所有 Bot、登录和记忆都在这台机器上 |
| 引擎 | 模型提供方 | engine、provider | Bot 背后实际干活的 Agent CLI 或接口：Claude Code、Codex、OpenCode、Antigravity、OpenAI 兼容接口等 |
| 会话 | 对话；「新建对话」 | thread、`--task new` | 和某个 Bot 的一段对话。一件事开一个会话，上下文不会越积越大 |
| 常驻指令 | SOUL | soul、`SOUL.md` | 每次对话都会带上的指令，写这个 Bot 负责什么、遇到什么情况交给谁 |
| 技能 | 技能 | skill | Bot 存下来的做事方法，下次遇到同类任务直接照做 |
| 定时任务 | 例行任务；入口在「自动化」 | routine、Automations | 按时间表自动唤醒 Bot 干活，比如每天 9:00 |
| 团队文件 | —（命令行用 `team export` / `team apply`） | team file、`team.yaml` | 用一个 YAML 文件描述所有 Bot、房间、模型和权限，可以导出、修改、再应用 |
| 电脑 | 机器人桌面 | computer：`vm`、`local`、`cloud`… | 给 Bot 用的桌面环境，它能在里面截图、点鼠标、打字 |
| 配对 | 配对 | pair | 让新设备（浏览器、桌面 App、手机）获得访问服务器的权限。配对码 5 分钟内有效，只能用一次 |

## 审批级别

审批级别决定 Bot 做哪些事之前要先问你；完整说明见[审批级别](/zh/concepts/approval-levels/)。在 **机器人设置 → 权限** 里修改，也可以只改当前会话。

| 中文界面 | 英文界面 | 团队文件 / CLI | 行为 |
|---|---|---|---|
| 请求批准 | Ask for approval | `ask` | 执行命令和改文件之前都要你批准 |
| 自动接受编辑 | Auto-accept edits | `edits` | 改文件不问，执行命令要问。只有 Claude、Antigravity、Grok 等引擎提供，OpenCode 和 Codex 没有 |
| 代我批准 | Approve for me | `auto` | 由引擎自带的自动审核放行常规操作，其余的问你。没有自动审核的引擎会退回到「请求批准」 |
| 完全访问 | Full access | `full` | 不再弹出审批卡片。**所有新建的 Bot 默认是这一档** |

几点说明：

- 无人值守的 Bot（跑定时任务、由 webhook 触发）应该用「完全访问」，否则会卡在没人批的审批卡片上。
- 「完全访问」不会替你登录，也不会绕过验证码、多重验证和系统隐私权限。
- 审批卡片上的按钮是 **允许一次**、**始终允许** 和 **拒绝**。

## 教程里的写法约定

- **`<…>` 是占位符**，要换成你自己的值，比如 `<服务器IP>`、`<Bot 名>`。
- **`myserver`** 是示例服务器的 SSH 别名。换成你在 `~/.ssh/config` 里给自己服务器起的名字。
- **「交给 AI Agent」的提示词** 是写给 Claude Code、Codex、OpenCode 这类本机 Agent 的，整段复制给它即可。
- **「发给 Bot 的需求」** 是在 OpenMausBot 里直接发给某个 Bot 的消息。
- 界面路径写成 **设置 → API 密钥** 的形式，使用简体中文界面的叫法。桌面 App 的系统菜单（如 **Server → Add Server from Copied Pairing Link…**）目前只有英文。

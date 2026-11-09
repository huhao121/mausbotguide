---
title: OpenMausBot CLI 参考
description: openmausbot 常用命令一览：环境检查、服务、配对、给 Bot 派活、团队文件、引擎、令牌和 MCP。设置界面能做的事，命令行基本都能做。
verifiedOn: 0.1.146
sidebar:
  order: 1
  label: CLI 参考
---

设置界面能做的事，`openmausbot` 命令行基本都能做，而且适合交给 AI Agent 去执行。任何命令都可以用 `openmausbot help <命令>` 查看详细用法，完整说明请参阅[官方文档](https://github.com/milind-soni/OpenMausBot/blob/main/docs/headless-cli.md)。

## 服务器

| 命令 | 作用 |
|---|---|
| `openmausbot doctor --host` | 检查这台 Linux 机器能不能跑服务端：系统、Docker、沙箱、磁盘、端口、时钟 |
| `openmausbot service install` | 安装为系统服务，开机自启、崩溃自动重启；加 `--tailscale` 或 `--tunnel` 切换远程访问方式 |
| `openmausbot browser install` | 安装 Bot 用的浏览器；`browser status` 查看状态 |
| `openmausbot doctor` | 检查服务端是否响应、版本、你的身份、引擎是否就绪 |

## 配对与访问

| 命令 | 作用 |
|---|---|
| `openmausbot pair --label "设备名"` | 生成一次性配对码（5 分钟有效）；加 `--public-url https://…` 生成带地址的链接 |
| `openmausbot connect <URL> --code <码> --out <文件>` | 从另一台机器拿到访问令牌 |
| `openmausbot sessions` | 列出所有已配对的设备和会话 |
| `openmausbot token create "名字" --expires 90d --out <文件>` | 给脚本或 CI 用的令牌，到期自动失效；`token list` 查看、`token revoke` 吊销 |

## 给 Bot 派活

| 命令 | 作用 |
|---|---|
| `openmausbot bots` | 列出所有 Bot 及其当前状态 |
| `openmausbot run "<Bot>" "<任务>"` | 派发任务并等待完成，输出最终回复 |
| `openmausbot send "<Bot>" "<消息>" --task new` | 只发送、不等待；`--task new` 新开一个会话 |
| `openmausbot messages "<Bot>" --limit 30` | 查看最近的消息 |
| `openmausbot wait "<Bot>"` | 等待正在进行的任务完成 |
| `openmausbot interrupt "<Bot>"` | 相当于按停止；加 `--tree` 连同它派出的所有子任务一起停止 |
| `openmausbot export "<Bot>" --out <目录>` | 把一次任务的结果和文件导出到目录 |

需求很长时，可以用 `--message-file brief.md`，或者用 `-` 从标准输入读取。

## 团队与模型

| 命令 | 作用 |
|---|---|
| `openmausbot team export --out team.yaml` | 把现有的 Bot、房间、模型、权限导出成文件 |
| `openmausbot team apply team.yaml --check` | 只预览会改什么，不实际修改 |
| `openmausbot team apply team.yaml` | 按文件修改工作区，使两者一致 |
| `openmausbot models` | 每个引擎能用的模型 |
| `openmausbot channels` | 你的房间列表 |
| `openmausbot set-model "<Bot>" <引擎>/<模型>` | 修改某个 Bot 的模型 |
| `openmausbot engine set <引擎> --key-env <环境变量>` | 不通过界面，直接给引擎配置 API key；`--rotate` 替换已有的 key |
| `openmausbot engine list` | 列出引擎，以及每个引擎有没有配 key |

`engine set` 支持 `claude`、`openai`、`openrouter`、`openai-compatible`（要带 `--base-url`）、`xai`、`groq`、`greenference`、`mistral`、`cerebras`。写进去的 key 不会回显。

## 供脚本和其他 Agent 调用

- 加 `--json`：输出一个 JSON 文档，进度信息走 stderr。
- `openmausbot mcp`：把整个工作区作为 MCP server 提供出去，Claude Code、Codex、OpenCode 都能把活派给你的 Bot。
- `openmausbot events`：以 JSON Lines 格式输出服务端的实时事件。

## 退出码

| 退出码 | 含义 |
|---|---|
| 0 | 完成 |
| 1 | 失败、被停止或卡住 |
| 2 | 命令行参数或文件有误 |
| 3 | 需要人来回答（问题或审批卡片） |
| 4 | 超时（任务仍在继续） |
| 5 | 连不上服务端、没有权限，或服务端版本太旧 |
| 6 | `team apply --check` 发现有需要应用的改动 |
| 7 | `doctor --host`：这台机器缺少服务端需要的东西 |
| 130 | 按了 Ctrl-C（任务仍在继续） |

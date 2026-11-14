# 各 Agent 安装教程

一个核心技能文件夹 `skills/quiz-site-builder/`，所有平台只安装或复制它，不维护不同的指令副本。请在**本仓库根目录**执行下列命令。

## Codex（OpenAI）

```bash
python3 scripts/install_skill.py --target codex --scope user
```

位置：macOS/Linux `~/.agents/skills/quiz-site-builder/SKILL.md`，Windows 用户主目录下 `.agents/skills/quiz-site-builder/SKILL.md`。

- 项目级安装：`python3 scripts/install_skill.py --target codex --scope project --project-root .`
- Codex 中输入 `$quiz-site-builder`，或直接描述测试网站需求；自动识别并非每次都保证触发。
- 默认先参与创意、机制、视觉三个阶段的共创，每阶段最多 1～2 个问题；确认后自主开发。说“直接做”“一键生成”或“你来决定”即可自动生成。详见 [工作流](WORKFLOW.md)。
- 新建 Codex 会话；若未显示，检查目录和 `SKILL.md` 元数据。更新安装需显式加 `--force`（覆盖安装目录）。

## WorkBuddy（腾讯桌面端）

WorkBuddy 客户端可通过 UI 上传 ZIP：

1. 下载发布包 `quiz-site-builder-workbuddy-v0.3.0.zip`（或本地执行 `python3 scripts/package.py --output dist` 来生成）。
2. WorkBuddy → **专家·技能·连接器** → **技能** → **添加技能** → **上传技能**。
3. 选择 ZIP，检查是否安装成功；进入新任务，在技能选择器里启用 `互动测试网站生成器`。
4. 输入：“使用互动测试网站生成器制作 10 道国风人格测试，给我手机网站并指导 Cloudflare Pages 上线。”
5. 如果导入失败，请检查 ZIP **唯一顶层文件夹** `quiz-site-builder/`，该文件夹根目录直接包含 `SKILL.md`。不要上传完整 GitHub 仓库 ZIP。

说明：WorkBuddy 桌面端与 CodeBuddy Code CLI 不是同一个产品。上传 ZIP 仅表示 Skill 可被导入，是否支持自动运行 Node/npm、GitHub 授权和 Cloudflare 交互要在使用过程中核实；没有权限时由 Agent 输出可执行指令，而不是声称已经上线。

## Claude Code

```bash
python3 scripts/install_skill.py --target claude --scope user
```

安装到 `~/.claude/skills/quiz-site-builder`；如需当前项目可用，改用 `--scope project --project-root .`。

## CodeBuddy Code CLI

```bash
python3 scripts/install_skill.py --target codebuddy-cli --scope user
```

安装到 `~/.codebuddy/skills/quiz-site-builder`。CodeBuddy Code 技能目录依据其 CLI 文档，**不等于 WorkBuddy 桌面端的技能上传入口**。

## OpenCode

```bash
python3 scripts/install_skill.py --target opencode --scope user
```

安装到 `~/.config/opencode/skills/quiz-site-builder`。项目级安装目标为 `.opencode/skills/quiz-site-builder`。

## 其他 Agent

如果 Agent 能加载遵循 Agent Skills 规范的目录，复制完整的 `skills/quiz-site-builder` 目录（不是单独复制 `SKILL.md`），并按照该 Agent 文档选择安装路径或导入入口。平台可能限制执行脚本权限。

## 安全提示

- 安装脚本默认不覆盖旧安装。要升级，先备份，再加 `--force`。
- 不在 Git 仓库和前端中保存 GitHub/Cloudflare Token。
- 运行 `npm install` 前可检查 `package.json`；不要无审查执行第三方 Skill 中的任意脚本。
- 部署或建立收费服务需要用户授权。Skill 不会自动支付、购买域名或推送到个人账号。

## 官方来源

- https://agentskills.io/specification
- https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market
- https://open.workbuddy.cn/docs/skill
- https://www.workbuddy.cn/docs/cli/skills

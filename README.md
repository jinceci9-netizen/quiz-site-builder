# Quiz Site Builder · 互动测试网站生成器

**只需提出一个测试创意，AI 就会陪你设计玩法与风格，再把确定的想法做成能在手机上玩的测试网站。**

不用懂代码，也不必先想好题目、算法或配色。默认免费、匿名，支持详细结果报告与 3:4 分享图；先本地预览，再按你的意愿上线。

## 适合谁

想把脑洞做成作品的零基础创作者、希望为朋友或社群设计趣味互动的人，以及已有主题、想打磨玩法与视觉的内容创作者。

## 💡 试试这样告诉 AI

安装并启用技能后，直接复制下面任意一段。它们只是灵感起点：你可以换主题、混合玩法，也可以完全推翻 AI 的建议。

### 01｜只有一个脑洞（首页主推）

适合：只有一句想法，希望 AI 帮你挖掘玩法。

```text
我想做一个「测测你的隐藏反派人格」的趣味测试网站。现在只有这个想法，你先帮我一起设计玩法吧！
```

### 02｜已经有明确主题

适合：主题明确，想先打磨剧情和挑战难度。

```text
我想做一个「测测你在《甄嬛传》里能活到第几集」的网站。希望能和真实剧情挂钩，但不想让玩家轻易选到大结局。你先帮我想想怎么设计测试机制。
```

### 03｜有独特审美要求

适合：已有审美偏好，希望玩法和视觉一起成形。

```text
我想做一个国风人格测试，通过古代情境题，把人的性格对应到一种中国传统器物。希望整个网站有博物馆图鉴的质感，结果文案有诗意但不空洞。你先帮我完善这个创意。
```

### 04｜没有想好选题

适合：还没确定主题，先拓展创意的可能性。

```text
我想做一个年轻人愿意分享给朋友的趣味测试网站，但还没有选题。帮我想5个有传播潜力、玩法特别的方向，我们挑一个继续设计。
```

### 05｜想快速生成

适合：愿意把题目、结果和审美都交给 AI。

```text
帮我做一个「测测你是哪种精神状态的打工人」趣味测试。题目、结果、视觉风格都由你决定，直接生成一个完整的、能在手机上玩的测试网站，并帮我本地预览。
```

真实影视剧情需要核实来源，不能凭空编造集数；截图、台词等素材也需要考虑授权。AI 会说明已核实内容和原创改编的边界，供你选择。

## 一句话万能提示词

```text
我想做一个「填写你的测试主题」的互动测试网站。

我希望它「填写你最在意的体验或效果」。

请先帮我一起完善创意，不要急着写代码。
```

随时可以改为：

```text
剩下的你来决定，直接帮我生成完整网站。
```

也可以说“跳过这一步”，只把当前阶段交给 AI；“配色你来决定”只委托配色。你无需学习固定指令，自然表达即可。

## 支持哪些测试模式

| 模式 | 玩起来是什么样 | AI 会设计什么 |
|---|---|---|
| 人格 / 角色匹配 | 从情境选择发现自己的角色或器物人格 | 多维评分、平局处理、差异化结果 |
| 剧情生存 | 每次选择改变处境，看看能走多远 | 状态变化、风险节点、可达的不同结局 |
| 优势 / 驱动力探索 | 从轻松、消耗与高峰体验中寻找线索 | 多种信号交叉、可解释的报告与行动建议 |

这些是可拓展的起点，不是选题限制。娱乐测试不宣称科学诊断有效性。

## 安装到你的 AI 助手

需要一个能加载 Agent Skills 的助手；实际开发还需要其具备文件、终端、Python 与 Node/npm 权限。遇到缺失工具或授权步骤，AI 应说明原因并引导你完成。

### Codex、Claude Code、CodeBuddy Code、OpenCode

下载并解压完整项目，用 AI 打开项目文件夹。可以直接说：“阅读 README.md 和 docs/INSTALL.md，检查并帮我安装这个 Skill，遇到授权提醒我。”

如果你会使用终端，在项目根目录选择对应命令：

```bash
# Codex
python3 scripts/install_skill.py --target codex --scope user
# Claude Code
python3 scripts/install_skill.py --target claude --scope user
# CodeBuddy Code CLI
python3 scripts/install_skill.py --target codebuddy-cli --scope user
# OpenCode
python3 scripts/install_skill.py --target opencode --scope user
```

安装后新开聊天，告诉 AI“请使用 quiz-site-builder”。Codex 也可以输入 `$quiz-site-builder`；其他助手使用自然语言或技能选择器即可，不要求支持 `$` 语法。

### WorkBuddy 桌面端

使用 `quiz-site-builder-workbuddy-v0.3.0.zip`：WorkBuddy → 专家·技能·连接器 → 技能 → 添加技能 → 上传技能；新任务中启用“互动测试网站生成器”。不要上传完整 GitHub 仓库 ZIP。如果没有技能包，可让 AI 运行 `python3 scripts/package.py --output dist` 生成。

WorkBuddy 与 CodeBuddy Code CLI 的安装方式不同。上传技能不代表客户端一定具备本地开发权限。完整路径、项目级安装、更新与故障排查见 [安装教程](docs/INSTALL.md)。

## 从一个脑洞到一个网站

1. **探索创意**：AI 推荐 2～3 个有差异的切口，解释哪个更值得做；你选择或自由补充。若你想先看 5 个方向，就按你的需求展开。
2. **设计测试**：用容易理解的话说明算法、结果类型，展示 2～3 道完整示例题，和你一起调整趣味与难度。
3. **确定风格**：提供 2～3 个视觉方向和一份结果文案样稿，一起确定手机体验与分享图。
4. **正式开发**：方向确认后，AI 自主完成完整题库、代码、调试、响应式适配、测试、构建和本地预览。
5. **引导上线**：你准备好后，AI 引导通过 GitHub 保存网站代码、Cloudflare Pages 发布网站。

每阶段只问 1～2 个关键问题，先给有见解的建议，不反复询问已确定的信息，并记录决定。你可以修改、跳过、委托；没有回复不视为确认。说“直接做”“一键生成”或“你来决定”，即可切换自动生成模式，技术执行由 AI 自主完成。只委托某项决定时，不会跳过其他阶段。

[查看完整工作流](docs/WORKFLOW.md)。所有兼容 Agent 使用同一套共创原则，不依赖某个客户端的专属表单。

## 上线教程：GitHub + Cloudflare Pages

**GitHub 保存网站源代码，Cloudflare Pages 让别人通过网址访问网站。** 技能本身和你生成的网站是两个独立项目，网站应使用自己的仓库。暂时只想预览，就告诉 AI“只在本地，不上传、不部署”。自动生成模式不等于自动授权发布。

准备上线时，告诉 AI“请引导我把这个网站通过 GitHub + Cloudflare Pages 上线”。有权限的操作由 AI 执行，登录与必要授权由你完成：

1. 将已测试的网站代码上传到独立 GitHub 仓库。
2. 在 Cloudflare Dashboard → Workers & Pages → Pages → Connect to Git 连接该仓库。
3. 设置生产分支 `main`、构建命令 `npm run build`、输出目录 `dist`；网站代码在仓库根目录时，Root directory 留空。
4. 完成部署，检查 HTTPS 与资源加载；需要推广时可绑定自有域名，购买域名由你决定。
5. 从实际中国大陆网络测试打开、答题、报告、分享图与链接。

模板里的 GitHub Action 仅做检查，发布由 Cloudflare Git 集成完成。`pages.dev` 或自有域名都**不保证所有中国大陆网络稳定访问**；项目避免运行期外部字体/CDN，但实际访问仍需测试。严格的大陆可用性需求应评估合规境内托管与备案。

[详细部署教程](skills/quiz-site-builder/assets/starter/CLOUDFLARE_DEPLOY.md) · [发布流程](skills/quiz-site-builder/references/publishing.md) · [大陆访问准备](skills/quiz-site-builder/references/mainland-readiness.md)

## 可选进阶与注意事项

默认不增加支付、登录或卡密。需要收费或卡密时，AI 会先解释服务端验证、费用和权限，再由你决定；前端隐藏结果或纯 JavaScript 卡密不能安全保护内容。见 [可选卡密指南](skills/quiz-site-builder/references/access-codes-optional.md)。不自动购买域名，不把 Token 写入网页。

所有题目、评分引擎、模板与分享功能都在本地文件中。开发新网站时复制模板，保留技能原件。现有示例是原创演示，不代表可以直接使用其他作品的素材。

<details>
<summary>开发者：校验、演示与目录</summary>

在项目根目录检查技能：

```bash
python3 scripts/check_skill.py
```

运行模板演示：

```bash
cd skills/quiz-site-builder/assets/starter
npm install
npm test
npm run build
npm run dev
```

题库校验与静态资源审查：

```bash
python3 skills/quiz-site-builder/scripts/validate_quizzes.py skills/quiz-site-builder/assets/starter/src/data
python3 skills/quiz-site-builder/scripts/audit_mainland_assets.py skills/quiz-site-builder/assets/starter
```

核心目录：`skills/quiz-site-builder/`，其中 `SKILL.md` 为通用工作流，`references/` 为设计与发布参考，`assets/starter/` 为网站模板，`scripts/` 为题库与资源检查。仓库根目录的 `scripts/` 用于安装、打包与完整性检查，`docs/` 为使用指南。安装兼容性基于各平台公开说明，并非所有客户端均已实测。

</details>

**AI 负责拓展创意的可能性，用户负责决定作品的独特性，AI 负责把决定变成现实。**

License: MIT，见 [LICENSE](LICENSE)。

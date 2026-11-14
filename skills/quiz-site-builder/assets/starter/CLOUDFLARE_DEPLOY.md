# Cloudflare Pages 上线教程（Vite + React）

**默认方案：GitHub 存储代码，Cloudflare Pages 通过 Git integration 自动部署。**
本模板是静态站点；免费测试和结果分享不需要 Cloudflare API、Cloudflare Workers、服务器或数据库。

## A. 在本地确认可用

```bash
npm install
npm test
npm run build
npm run dev
```

`npm run build` 应生成 `dist/`；不应把 `dist/`、`node_modules/` 提交 GitHub。建议将首次安装生成的 `package-lock.json` 提交以稳定依赖版本。

## B. 为这个**生成的网站**单独创建 GitHub 仓库

不要把网站模板文件夹直接当作整个 Skill 仓库的根目录；在独立目录里维护各个测试网站更容易部署。

```bash
git init -b main
git add .
git commit -m "Create quiz website"
gh auth login
gh repo create my-quiz-website --public --source=. --push
```

公开仓库会让所有题库、前端代码对外可见；不想公开题库时可选择私有仓库（注意前端发布后用户仍可读取已打包的题库）。

## C. 在 Cloudflare Pages 连接 GitHub

1. 登录 https://dash.cloudflare.com/ ，进入 **Workers & Pages**。
2. 新建 **Pages** 项目，选择 **Connect to Git**（不同界面版本按钮文本略有差异），授权 GitHub，选择**网站仓库**。
3. 配置：
   - Framework preset: **React (Vite)** 或 **Vite**；不需要时选 **None** 也可以，只要设置下面两项。
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: **留空**（仓库根目录就是网站项目时）
   - Node: 默认 v3 build image 的 Node 22；如需锁定，仓库根目录的 `.node-version` 已设为 `22`
4. 点 **Save and Deploy**，等状态成功，得到 `https://<项目名>.pages.dev` 临时预览网址。
5. 以后向网站仓库的 `main` 分支提交更新，Cloudflare Pages 会自动重新部署。新分支可以生成预览部署。

如果你把网站放在一个多项目仓库的子目录，则在 Cloudflare 的 Root directory 中填写网站所在的相对路径，并保证 `package.json`、`.node-version` 和源码位于该目录。

注意：使用 Git integration 创建的 Pages 项目不能直接在后台切换为 Direct Upload 项目；不建议为新手混用两套初始化流程。

## D. 绑定自己的域名（面向中国大陆用户时推荐**先测试**）

1. 先购买并控制一个自有域名。Cloudflare Pages > 你的项目 > **Custom domains** > **Set up a domain**。
2. 如果使用根域名（如 `example.com`），需按提示将域名添加到 Cloudflare 并配置域名服务器；如果是子域名（如 `quiz.example.com`），遵循 Pages 给出的 CNAME 指引。
3. 等 Cloudflare 的域名和 HTTPS 证书生效，再分享自定义域名。
4. 分享前在中国大陆实际测试：不同省份 / 中国移动、中国联通、中国电信、家庭 Wi-Fi 和移动数据环境，检测首页、图片、完整答题、结果图、回退/刷新。独立浏览器打开，而不是只看自己的海外网络是否可用。

**重要：绑定域名≠自动获得大陆稳定访问。** Cloudflare 的普通全球网络不保证大陆链路的可用性和速度。不要向用户承诺“国内一定打开”。`pages.dev` 是临时预览地址，不能作为国内稳定可访问的保证。

## E. 面向大陆的低依赖约束

- 所有前端 JavaScript / CSS / 题库 / 图像尽量本地打包进 `dist/`，不要靠国外 CDN 实时下载。
- 不引入 Google Fonts、国外图片热链、必须依赖国外接口的结果生成服务。
- 字体优先本机/系统字体栈；分享图片采用可回退的本地字体。
- 免费测试不要求登录、不调用广告/验证码/支付 SDK；用户回答默认只在当前浏览器 localStorage 保存。
- Vite 的 `base` 为 `/`，避免 GitHub Pages 的 `/<repo>/` 路径残留，导致 Cloudflare 部署后白屏。
- 有条件时调用 Skill 提供的静态资源审计脚本，检测远程资源依赖。

## F. 实际不通怎么办？

排查顺序：Cloudflare 部署状态和构建日志 → HTTPS 与自定义域名 → DNS/证书 → 静态文件加载（浏览器开发者工具 Network）→ 大陆不同网络测试。不要仅凭海外能打开就判定国内可用。

如果大陆访问稳定性是硬约束，且经过多运营商实测仍不达标，需向用户明确：Cloudflare Pages（标准方案）不能承诺解决此目标；建议评估具备大陆节点的合规托管/CDN，按业务性质确认 ICP 备案/许可等要求。Cloudflare China Network 是单独的企业级服务，不是开通 Pages 免费版即包含。

官方资料：
- Pages Git integration: https://developers.cloudflare.com/pages/get-started/git-integration/
- Build settings: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Custom domain: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare China latency/routing: https://developers.cloudflare.com/support/troubleshooting/general-troubleshooting/geographic-traffic-routing/
- ICP background: https://developers.cloudflare.com/china-network/concepts/icp/

## G. 可选：不用 GitHub，直接上传

已有 Cloudflare Pages **Direct Upload** 项目时，可在该模式下使用：

```bash
npm run build
npx wrangler login
npx wrangler pages deploy dist --project-name=你自己的项目名
```

该方式不是本 Skill 的新手默认流程，也不应在一个初始化方式不兼容的项目上盲目混用。

## H. 可选：未来要做卡密？

默认**不实现**卡密。只有用户主动提出才介绍 `references/access-codes-optional.md` 里的服务端方案，不强迫用户接数据库或支付服务。

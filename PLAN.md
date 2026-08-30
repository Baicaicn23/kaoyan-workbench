# 考研工作台 · 开发规划

> 基于 GitHub 调研（2026-08-30）制定的开发计划。
> 对标项目：[xm011-cloud/kaoyan_ai](https://github.com/xm011-cloud/kaoyan_ai)（功能蓝本，Apache-2.0）、[Shinku-Eis/daymark](https://github.com/Shinku-Eis/daymark)（周日程交互）、[Treasoni/kaoyan](https://github.com/Treasoni/kaoyan)（SM-2 复习调度）。

## 一、产品定位

一个**个人用**的考研备考工作台（Web 应用）：每天打开看板 → 执行今日任务 → 番茄钟专注 → 打卡；错题统一进错题本，按间隔重复算法安排复习。第一版**纯工具、无 AI**，架构上预留 AI 接口。

## 二、技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | Next.js 16 (App Router, TS strict, Turbopack) | 与 kaoyan_ai 同栈，生态最成熟 |
| 样式 | Tailwind CSS 4 + shadcn/ui | 组件开箱即用，观感统一 |
| 数据库 | SQLite（Prisma） | 单用户零配置；Prisma 抽象保住后续切换 |
| 部署 | 本地运行 / Vercel + Turso（同为 SQLite 生态） | 迁移成本近乎为零 |
| 状态 | Server Actions（数据写）+ zustand（客户端 UI 态） | 简化数据流，少一层 API |
| 间隔复习 | [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)（Anki 官方 FSRS 算法 TS 实现） | 不手写 SM-2，算法质量有保障 |
| 图表 | 热力图手绘 SVG + recharts | 轻量够用 |
| 日期 | date-fns | 周/月计算 |

前置要求：Node.js ≥ 20。

## 三、数据模型（Prisma）

- **Subject 科目**：`id, name, color, sortOrder`（数学/英语/政治/专业课）
- **Task 任务**：`id, title, date(YYYY-MM-DD), startTime?, endTime?, subjectId?, repeatRule?, note, status(todo/done), createdAt`
  - `repeatRule`：JSON，支持每天/每周/艾宾浩斯周期（MVP 先做一次性 + 每天/每周）
- **FocusSession 专注记录**：`id, taskId?, subjectId?, startAt, endAt, durationMin, type(pomodoro/custom), completed`
- **CheckIn 打卡**：`id, date(unique), durationMin(自动汇总+手动补记), mood?, note`
- **WrongQuestion 错题**：`id, subjectId, source, question(markdown), answer, analysis, wrongReason, tags, reviewState(learning/reviewing/mastered), nextReviewAt, reviewCount, fsrsState(JSON)`
- **ReviewLog 复习日志**：`id, wrongQuestionId, reviewedAt, grade(0-5)`

> 单用户，MVP 不做登录认证；表结构预留 `userId` 字段方便将来扩展。

## 四、页面与功能

### 路由结构
```
/          今日看板（默认页）
/plan      周计划 / 月计划
/pomodoro  番茄钟
/review    错题本 + 复习队列
/stats     统计（热力图、趋势）
```

### 功能细节（对标来源）
1. **今日看板**：考试倒计时（大数字，目标日期可配置）、今日任务勾选、打卡（时长自动来自专注记录+手动补记）、今日待复习错题入口、一年热力图（GitHub 风格，SVG 手绘）。
2. **番茄钟**：默认 25+5 可配置；**用 `endTime` 快照计时而非倒计时递减**（刷新/后台恢复不丢进度，kaoyan_ai 的反漂移思路）；任务卡可直接启动关联专注（daymark 思路）；完成写 FocusSession 并累加当日打卡。
3. **周计划/月计划**：周视图七列按日期排任务（daymark 的课程表式）；月视图日历格子显示每天任务数/时长；重复规则 MVP 先做一次性+每天/每周。
4. **错题本**：录入（科目/来源/题干/答案/解析/错因/标签）、按科目与标签筛选、复习队列（`nextReviewAt ≤ 今日`）、复习打分 0-5 喂 FSRS、掌握状态迁移。
5. **统计**：打卡热力图、每日/每周专注时长趋势、各科分布。MVP 后期做。

## 五、里程碑（每个模块完成后按规范提交并推送）

| 阶段 | 内容 | 提交信息 |
|---|---|---|
| M0 | 脚手架：Next.js + Tailwind + shadcn + Prisma(SQLite) + 布局/导航 | `chore: 项目脚手架` |
| M1 | 今日看板 + 打卡 + 倒计时 + 热力图 | `feat: 今日看板与打卡` |
| M2 | 番茄钟 + 专注记录（反漂移计时） | `feat: 番茄钟与专注记录` |
| M3 | 周计划/月计划（周视图、重复规则） | `feat: 周计划与月计划` |
| M4 | 错题本 + FSRS 间隔复习队列 | `feat: 错题本与间隔复习` |
| M5 | 统计页 + 打磨 + PWA 化（可选） | `feat: 统计与打磨` |

二期（预留）：AI 周计划生成、错题诊断、资料向量化问答（接用户自带 Key，接口层已预留）。

## 六、工程规范（沿用用户级规则）

- PowerShell 一律用 `pwsh`；复杂逻辑写 .ps1 再执行。
- 提交前缀：`feat:` / `fix:` / `chore:` / `docs:`，每模块一次，不逐文件碎提交。
- 推送走代理：`git -c http.proxy=http://127.0.0.1:<端口> -c https.proxy=http://127.0.0.1:<端口> push`，端口用 `Get-NetTCPConnection -State Listen` 实查。
- 新仓库建议：`Baicaicn23/kaoyan-workbench`（待确认公开/私有）。

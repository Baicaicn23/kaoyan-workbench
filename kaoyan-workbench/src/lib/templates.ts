// 任务模板库：按模块组织，供「一键加入今日任务」使用
// 模板内容依据大三上备考节奏设计（六级 12 月考试 + 高数打基础 + 秋招底层准备）

export type TaskTemplate = {
  title: string;
  /** 预计耗时提示（分钟），仅展示用 */
  durationMin?: number;
};

export const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  高数: [
    { title: "跟基础班课程 1-2 讲", durationMin: 120 },
    { title: "同济教材课后习题（对应章节）", durationMin: 90 },
    { title: "660 题 25 题", durationMin: 90 },
    { title: "整理本周错题并重做", durationMin: 60 },
    { title: "公式卡回顾（极限/导数/积分）", durationMin: 30 },
    { title: "章节自测 1 次", durationMin: 120 },
  ],
  英语六级: [
    { title: "背单词 60 新词 + 复习 120", durationMin: 45 },
    { title: "精听听力真题 1 篇", durationMin: 40 },
    { title: "真题阅读 2 篇（限时）", durationMin: 40 },
    { title: "作文 1 篇并对照范文", durationMin: 50 },
    { title: "翻译真题段落 1 段", durationMin: 30 },
    { title: "整套真题模拟 + 复盘", durationMin: 150 },
  ],
  秋招准备: [
    { title: "LeetCode 刷题 3 道（按专题）", durationMin: 90 },
    { title: "八股主题学习 1 个并做笔记", durationMin: 60 },
    { title: "打磨简历（项目描述 STAR 化）", durationMin: 60 },
    { title: "梳理 1 个项目亮点", durationMin: 45 },
    { title: "关注秋招/实习信息", durationMin: 20 },
  ],
};

export function getTemplates(subjectName: string): TaskTemplate[] {
  return TASK_TEMPLATES[subjectName] ?? [];
}

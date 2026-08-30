import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: path.join(process.cwd(), "prisma", "dev.db"),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // 三个模块：高数 / 英语六级 / 秋招准备（清空重建，本地单用户无存量数据）
  const subjects = [
    { name: "高数", color: "#4f46e5", sortOrder: 0 }, // indigo
    { name: "英语六级", color: "#059669", sortOrder: 1 }, // emerald
    { name: "秋招准备", color: "#d97706", sortOrder: 2 }, // amber
  ];

  const existing = await prisma.subject.count();
  if (existing === 0) {
    for (const s of subjects) {
      await prisma.subject.create({ data: s });
    }
    console.log("seed 完成：3 个模块（高数 / 英语六级 / 秋招准备）");
  } else {
    console.log("已存在科目数据，跳过（如要重置请先清空 Subject/Task 表）");
  }

  // 默认考试日期（可在今日总结页修改）
  const examDate = await prisma.setting.findUnique({ where: { key: "exam_date" } });
  if (!examDate) {
    await prisma.setting.create({ data: { key: "exam_date", value: "2026-12-26" } });
  }
}

main()
  .then(() => console.log("seed 完成"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

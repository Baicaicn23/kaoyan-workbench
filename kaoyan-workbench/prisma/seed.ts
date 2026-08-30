import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: path.join(process.cwd(), "prisma", "dev.db"),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const subjects = [
    { name: "数学", color: "#6366f1", sortOrder: 0 },
    { name: "英语", color: "#10b981", sortOrder: 1 },
    { name: "政治", color: "#f59e0b", sortOrder: 2 },
    { name: "专业课", color: "#ef4444", sortOrder: 3 },
  ];
  for (const s of subjects) {
    const exists = await prisma.subject.findFirst({ where: { name: s.name } });
    if (!exists) {
      await prisma.subject.create({ data: s });
    }
  }
}

main()
  .then(() => console.log("seed 完成：4 个默认科目"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

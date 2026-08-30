import { prisma } from "@/lib/prisma";
import { SubjectWorkbench } from "@/components/subject-workbench";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const subject = await prisma.subject.findFirstOrThrow({ where: { name: "秋招准备" } });

  const [tasks, totalCount, doneCount] = await Promise.all([
    prisma.task.findMany({
      where: { subjectId: subject.id, status: "todo" },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: { subject: { select: { name: true, color: true } } },
    }),
    prisma.task.count({ where: { subjectId: subject.id } }),
    prisma.task.count({ where: { subjectId: subject.id, status: "done" } }),
  ]);

  return (
    <SubjectWorkbench
      subject={subject}
      code="MODULE 03"
      description="秋招冲刺 · 简历、笔试刷题、面试复盘、投递进度"
      tasks={tasks}
      totalCount={totalCount}
      doneCount={doneCount}
    />
  );
}

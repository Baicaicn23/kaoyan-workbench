import { prisma } from "@/lib/prisma";
import { getTemplates } from "@/lib/templates";
import { SubjectWorkbench } from "@/components/subject-workbench";
import { TemplateList } from "@/components/template-list";

export const dynamic = "force-dynamic";

export default async function MathPage() {
  const subject = await prisma.subject.findFirstOrThrow({ where: { name: "高数" } });

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
    <div className="p-8">
      <SubjectWorkbench
        subject={subject}
        code="MODULE 01"
        description="高等数学 · 极限与连续、导数与微分、积分、级数、微分方程"
        tasks={tasks}
        totalCount={totalCount}
        doneCount={doneCount}
      />
      <div className="mt-4">
        <TemplateList
          subjectId={subject.id}
          subjectName={subject.name}
          accentColor={subject.color}
          templates={getTemplates(subject.name)}
        />
      </div>
    </div>
  );
}

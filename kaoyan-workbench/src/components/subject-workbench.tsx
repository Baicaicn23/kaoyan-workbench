import { PageHeader } from "@/components/page-header";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { Card, CardContent } from "@/components/ui/card";

export type ModuleTask = {
  id: number;
  title: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  date: string;
  subject: { name: string; color: string } | null;
};

export function SubjectWorkbench({
  subject,
  code,
  description,
  tasks,
  totalCount,
  doneCount,
}: {
  subject: { id: number; name: string; color: string };
  code: string;
  description: string;
  tasks: ModuleTask[];
  totalCount: number;
  doneCount: number;
}) {
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="p-8">
      <PageHeader title={subject.name} code={code} description={description} />

      {/* 模块战况 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">TOTAL</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">{totalCount}</p>
            <p className="text-xs text-muted-foreground">任务总数</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">DONE</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">{doneCount}</p>
            <p className="text-xs text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">PROGRESS</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">{pct}%</p>
            <div className="mt-2 h-1 w-full bg-muted">
              <div
                className="h-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: subject.color }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 模块任务 */}
      <div className="mt-4">
        <TodayTasks
          tasks={tasks}
          subjects={[{ id: subject.id, name: subject.name, color: subject.color }]}
          title={subject.name}
          code={code}
          lockSubjectId={subject.id}
          accentColor={subject.color}
        />
      </div>
    </div>
  );
}

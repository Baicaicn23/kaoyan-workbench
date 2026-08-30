import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummarySubject = {
  id: number;
  name: string;
  color: string;
};

type SummaryTask = {
  id: number;
  status: string;
  subject: { id: number } | null;
};

const MODULE_LINKS: Record<string, string> = {
  高数: "/math",
  英语六级: "/cet6",
  秋招准备: "/career",
};

export function SubjectSummary({
  subjects,
  tasks,
  totalMinutes,
}: {
  subjects: SummarySubject[];
  tasks: SummaryTask[];
  totalMinutes: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((s, i) => {
        const moduleTasks = tasks.filter((t) => t.subject?.id === s.id);
        const done = moduleTasks.filter((t) => t.status === "done").length;
        const pct = moduleTasks.length
          ? Math.round((done / moduleTasks.length) * 100)
          : 0;
        const href = MODULE_LINKS[s.name];
        const code = `MODULE 0${i + 1}`;

        return (
          <Card
            key={s.id}
            className={cn(
              "ak-corner overflow-hidden border-border bg-card transition-colors hover:border-primary/50",
              href && "cursor-pointer",
            )}
          >
            {href ? (
              <Link href={href} className="block">
                <Inner />
              </Link>
            ) : (
              <Inner />
            )}
          </Card>
        );
        function Inner() {
          return (
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="ak-title text-base">{s.name}</span>
                </span>
                <span className="ak-label !text-[0.5625rem] opacity-60">
                  {code}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <span className="ak-number text-3xl">{done}</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    / {moduleTasks.length} 完成
                  </span>
                </div>
                {href && (
                  <ArrowRight className="size-4 text-primary opacity-70" />
                )}
              </div>
              {/* 完成进度条 */}
              <div className="mt-2.5 h-1 w-full bg-muted">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: s.color,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                今日专注共 {Math.round(totalMinutes / 60)} 小时
              </p>
            </CardContent>
          );
        }
      })}
    </div>
  );
}

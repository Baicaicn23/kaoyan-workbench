"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarPlus, ClipboardList } from "lucide-react";
import { addTemplateTask } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TaskTemplate } from "@/lib/templates";

function formatDuration(min: number) {
  if (min < 60) return `${min}min`;
  const h = min / 60;
  return `${h % 1 === 0 ? h : h.toFixed(1)}h`;
}

export function TemplateList({
  subjectId,
  subjectName,
  accentColor,
  templates,
}: {
  subjectId: number;
  subjectName: string;
  accentColor: string;
  templates: TaskTemplate[];
}) {
  const router = useRouter();

  async function add(t: TaskTemplate) {
    await addTemplateTask(t.title, subjectId);
    toast.success("已加入今日任务", {
      description: t.title,
    });
    router.refresh();
  }

  return (
    <Card className="ak-corner border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList
            className="size-4"
            style={{ color: accentColor ?? "var(--primary)" }}
          />
          <span className="ak-title">任务模板</span>
          <span className="ak-label !text-[0.5625rem] opacity-60">
            TEMPLATES
          </span>
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          一键加入今日 · {subjectName}
        </span>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-1">
          {templates.map((t, i) => (
            <li
              key={i}
              className="group flex items-center gap-3 border-l-2 border-transparent px-2 py-2 hover:border-accent/70 hover:bg-muted/60"
            >
              <span className="ak-number !text-xs opacity-50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm">{t.title}</span>
              {t.durationMin && (
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  ≈{formatDuration(t.durationMin)}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                onClick={() => add(t)}
              >
                <CalendarPlus className="size-3.5" />
                加入今日
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

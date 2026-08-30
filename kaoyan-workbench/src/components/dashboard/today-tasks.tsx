"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, ListTodo, Plus, Trash2 } from "lucide-react";
import { createTask, deleteTask, toggleTask } from "@/app/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type TodayTask = {
  id: number;
  title: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  subject: { name: string; color: string } | null;
};

export type SubjectOption = { id: number; name: string; color: string };

export function TodayTasks({
  tasks,
  subjects,
  title = "任务",
  code,
  lockSubjectId,
  accentColor,
}: {
  tasks: TodayTask[];
  subjects: SubjectOption[];
  title?: string;
  code?: string;
  /** 锁定模块：添加任务固定该模块，隐藏模块选择器（模块页用） */
  lockSubjectId?: number;
  accentColor?: string;
}) {
  const router = useRouter();
  const [titleInput, setTitleInput] = useState("");
  const [subjectId, setSubjectId] = useState<string>(
    lockSubjectId ? String(lockSubjectId) : "",
  );

  async function submit(formData: FormData) {
    await createTask(formData);
    setTitleInput("");
    router.refresh();
  }

  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListTodo className="size-4" style={{ color: accentColor ?? "var(--primary)" }} />
          <span className="font-semibold">{title}</span>
          {code && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{code}</span>
          )}
        </CardTitle>
        <span className="text-xs tabular-nums text-muted-foreground">
          {doneCount}/{tasks.length} 完成
        </span>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <ul className="space-y-1">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="group flex items-center gap-2.5 border-l-2 border-transparent px-2 py-1.5 hover:border-primary/60 hover:bg-muted/60"
            >
              <button
                type="button"
                onClick={async () => {
                  await toggleTask(t.id, t.status !== "done");
                  router.refresh();
                }}
                className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                aria-label={t.status === "done" ? "标记未完成" : "标记完成"}
              >
                {t.status === "done" ? (
                  <CheckCircle2 className="size-4.5 text-primary" />
                ) : (
                  <Circle className="size-4.5" />
                )}
              </button>
              {t.subject && (
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: t.subject.color }}
                  title={t.subject.name}
                />
              )}
              <span
                className={cn(
                  "flex-1 truncate text-sm",
                  t.status === "done" && "text-muted-foreground line-through",
                )}
              >
                {t.title}
              </span>
              {t.startTime && (
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {t.startTime}
                  {t.endTime ? `-${t.endTime}` : ""}
                </span>
              )}
              <button
                type="button"
                onClick={async () => {
                  await deleteTask(t.id);
                  router.refresh();
                }}
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label="删除任务"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="px-2 py-5 text-center text-sm text-muted-foreground">
              暂无任务，添加一项开始行动
            </li>
          )}
        </ul>

        <form action={submit} className="flex gap-2 border-t border-border pt-3">
          <Input
            name="title"
            placeholder="添加任务…"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="flex-1"
          />
          {!lockSubjectId && (
            <Select value={subjectId} onValueChange={(v) => setSubjectId(v ?? "")}>
              <SelectTrigger className="w-28" aria-label="模块">
                <SelectValue placeholder="模块" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <input type="hidden" name="subjectId" value={subjectId} />
          <Button
            type="submit"
            size="icon"
            disabled={!titleInput.trim()}
            aria-label="添加"
          >
            <Plus className="size-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

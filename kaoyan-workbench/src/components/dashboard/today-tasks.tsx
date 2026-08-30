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
}: {
  tasks: TodayTask[];
  subjects: SubjectOption[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState<string>("");

  async function submit(formData: FormData) {
    await createTask(formData);
    setTitle("");
    setSubjectId("");
    router.refresh();
  }

  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListTodo className="size-4 text-primary" />
          今日任务
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {doneCount}/{tasks.length} 完成
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1.5">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/60"
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
            <li className="px-2 py-4 text-center text-sm text-muted-foreground">
              今天还没有任务，添加一个吧
            </li>
          )}
        </ul>

        <form action={submit} className="flex gap-2 border-t pt-3">
          <Input
            name="title"
            placeholder="添加任务…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Select value={subjectId} onValueChange={(v) => setSubjectId(v ?? "")}>
            <SelectTrigger className="w-28" aria-label="科目">
              <SelectValue placeholder="科目" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="subjectId" value={subjectId} />
          <Button
            type="submit"
            size="icon"
            disabled={!title.trim()}
            aria-label="添加"
          >
            <Plus className="size-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

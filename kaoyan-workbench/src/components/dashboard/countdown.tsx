"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { saveExamDate } from "@/app/actions";
import { daysUntil } from "@/lib/dates";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function CountdownCard({ examDate }: { examDate: string }) {
  const [now, setNow] = useState(() => Date.now());
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(examDate);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const days = daysUntil(examDate);
  const examLabel = format(parseISO(examDate), "yyyy年M月d日");

  async function submit(formData: FormData) {
    const d = String(formData.get("date") ?? "");
    if (!d) return;
    await saveExamDate(d);
    setDraft(d);
    setEditOpen(false);
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="size-4 text-primary" />
          考试倒计时
        </CardTitle>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger
            render={
              <Button variant="ghost" size="icon" className="size-7" />
            }
          >
            <Pencil className="size-3.5" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>设置考试日期</DialogTitle>
            </DialogHeader>
            <form action={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam-date">考试日期</Label>
                <Input
                  id="exam-date"
                  name="date"
                  type="date"
                  defaultValue={draft}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span
            className={`text-5xl font-bold tabular-nums tracking-tight ${
              days >= 0 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {days >= 0 ? days : 0}
          </span>
          <span className="pb-1.5 text-sm text-muted-foreground">
            {days > 0 ? "天" : days === 0 ? "就是今天！" : "已开考"}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{examLabel}</p>
      </CardContent>
    </Card>
  );
}

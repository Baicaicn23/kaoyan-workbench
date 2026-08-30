"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Save } from "lucide-react";
import { saveCheckIn } from "@/app/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const MOODS = ["🔥", "😊", "😌", "😴", "😫"];

function formatMinutes(min: number) {
  if (min < 60) return `${min} 分钟`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} 小时` : `${h} 小时 ${m} 分`;
}

export function CheckInCard({
  totalMinutes,
  manualMinutes,
  mood,
  note,
  date,
}: {
  totalMinutes: number;
  manualMinutes: number;
  mood: string | null;
  note: string | null;
  date: string;
}) {
  const router = useRouter();
  const [moodState, setMoodState] = useState(mood ?? "");
  const [noteState, setNoteState] = useState(note ?? "");
  const [manual, setManual] = useState(
    manualMinutes > 0 ? String(manualMinutes) : "",
  );

  const shownMinutes = useMemo(
    () => totalMinutes + (Number(manual) || 0),
    [totalMinutes, manual],
  );

  async function submit(formData: FormData) {
    await saveCheckIn(formData);
    router.refresh();
  }

  return (
    <Card className="ak-corner border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="size-4 text-primary" />
          今日打卡
        </CardTitle>
        <span className="text-xs text-muted-foreground">专注 + 手动补记</span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold tabular-nums tracking-tight">
            {formatMinutes(shownMinutes)}
          </span>
        </div>

        <form action={submit} className="space-y-3">
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="mood" value={moodState} />
          <input type="hidden" name="note" value={noteState} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">心情</span>
            <div className="flex gap-1">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMoodState(m)}
                  className={cn(
                    "rounded-md px-2 py-1 text-lg transition-colors",
                    moodState === m
                      ? "bg-primary/15 ring-1 ring-primary"
                      : "hover:bg-muted",
                  )}
                  aria-label={`心情 ${m}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">补记（分钟）</span>
            <Input
              type="number"
              min={0}
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              className="w-24"
              name="durationMin"
            />
          </div>
          <Textarea
            placeholder="今日备注（可选）"
            value={noteState}
            onChange={(e) => setNoteState(e.target.value)}
            className="min-h-16 resize-none"
            name="note"
          />
          <Button type="submit" size="sm" className="w-full">
            <Save className="size-4" />
            保存打卡
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { format, parseISO, subDays, addDays } from "date-fns";
import { Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type HeatmapDay = { date: string; minutes: number };

const CELL = 10;
const GAP = 3;
const WEEKS = 20;

function level(minutes: number): string {
  if (minutes <= 0) return "fill-muted-foreground/10";
  if (minutes < 30) return "fill-primary/25";
  if (minutes < 60) return "fill-primary/45";
  if (minutes < 120) return "fill-primary/70";
  return "fill-primary";
}

const LEVELS = [
  "bg-muted-foreground/10",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

export function Heatmap({
  data,
  totalMinutes,
}: {
  data: HeatmapDay[];
  totalMinutes: number;
}) {
  const today = new Date();
  const byDate = new Map(data.map((d) => [d.date, d.minutes]));
  // 网格从最近 WEEKS 周的首个周一开始，行与星期一对齐
  const gridStart = subDays(today, WEEKS * 7 - 1);
  const startMonday = subDays(gridStart, (gridStart.getDay() + 6) % 7);
  const dayCount =
    Math.floor((today.getTime() - startMonday.getTime()) / 86_400_000) + 1;

  const days: { date: string; minutes: number; row: number; col: number }[] = [];
  for (let i = 0; i < dayCount; i++) {
    const d = addDays(startMonday, i);
    const dateStr = format(d, "yyyy-MM-dd");
    days.push({
      date: dateStr,
      minutes: byDate.get(dateStr) ?? 0,
      row: i % 7,
      col: Math.floor(i / 7),
    });
  }
  const cols = Math.ceil(dayCount / 7);

  return (
    <Card className="ak-corner border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="size-4 text-primary" />
          打卡热力图
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          近 {WEEKS} 周 · 共 {Math.round(totalMinutes / 60)} 小时
        </span>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <svg
          width={cols * (CELL + GAP) - GAP}
          height={7 * (CELL + GAP) - GAP}
          role="img"
          aria-label="近 20 周打卡热力图"
        >
          {days.map((day) => (
            <rect
              key={day.date}
              x={day.col * (CELL + GAP)}
              y={day.row * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2}
              className={level(day.minutes)}
            >
              <title>{`${format(parseISO(day.date), "M月d日")}：${day.minutes} 分钟`}</title>
            </rect>
          ))}
        </svg>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>少</span>
          {LEVELS.map((c, i) => (
            <span key={i} className={`size-2.5 rounded-[2px] ${c}`} />
          ))}
          <span>多</span>
        </div>
      </CardContent>
    </Card>
  );
}

import { format, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { todayStr } from "@/lib/dates";
import { PageHeader } from "@/components/page-header";
import { CountdownCard } from "@/components/dashboard/countdown";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { CheckInCard } from "@/components/dashboard/check-in";
import { Heatmap } from "@/components/dashboard/heatmap";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = todayStr();

  const [tasks, subjects, checkin, sessions, examSetting, heatData] =
    await Promise.all([
      prisma.task.findMany({
        where: { date: today },
        orderBy: [{ startTime: "asc" }, { id: "asc" }],
        include: { subject: { select: { name: true, color: true } } },
      }),
      prisma.subject.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.checkIn.findUnique({ where: { date: today } }),
      prisma.focusSession.findMany({
        where: {
          startAt: { gte: new Date(`${today}T00:00:00`) },
          endAt: { lt: new Date(`${today}T23:59:59`) },
        },
      }),
      prisma.setting.findUnique({ where: { key: "exam_date" } }),
      (async () => {
        const since = format(subDays(new Date(), 139), "yyyy-MM-dd");
        const [checkins, focus] = await Promise.all([
          prisma.checkIn.findMany({
            where: { date: { gte: since } },
            select: { date: true, durationMin: true },
          }),
          prisma.focusSession.findMany({
            where: { startAt: { gte: new Date(`${since}T00:00:00`) } },
            select: { startAt: true, durationMin: true },
          }),
        ]);
        const total = new Map<string, number>();
        for (const c of checkins) {
          total.set(c.date, (total.get(c.date) ?? 0) + c.durationMin);
        }
        for (const f of focus) {
          const d = format(f.startAt, "yyyy-MM-dd");
          total.set(d, (total.get(d) ?? 0) + f.durationMin);
        }
        return {
          data: [...total.entries()].map(([date, minutes]) => ({ date, minutes })),
          totalMinutes: [...total.values()].reduce((a, b) => a + b, 0),
        };
      })(),
    ]);

  const sessionMinutes = sessions.reduce((a, s) => a + s.durationMin, 0);
  const examDate = examSetting?.value ?? "2026-12-26";

  return (
    <div className="p-8">
      <PageHeader
        title="今日看板"
        description={`${format(new Date(), "M月d日 EEEE")} · 稳住节奏，一战成硕`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <CountdownCard examDate={examDate} />
        <CheckInCard
          totalMinutes={sessionMinutes}
          manualMinutes={checkin?.durationMin ?? 0}
          mood={checkin?.mood ?? null}
          note={checkin?.note ?? null}
          date={today}
        />
        <div className="lg:col-span-3">
          <Heatmap data={heatData.data} totalMinutes={heatData.totalMinutes} />
        </div>
      </div>

      <div className="mt-4">
        <TodayTasks tasks={tasks} subjects={subjects} />
      </div>
    </div>
  );
}

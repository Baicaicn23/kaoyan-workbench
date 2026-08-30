import { format, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { todayStr } from "@/lib/dates";
import { PageHeader } from "@/components/page-header";
import { CountdownCard } from "@/components/dashboard/countdown";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { CheckInCard } from "@/components/dashboard/check-in";
import { Heatmap } from "@/components/dashboard/heatmap";
import { SubjectSummary } from "@/components/dashboard/subject-summary";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = todayStr();

  const [tasks, subjects, checkin, sessions, examSetting, heatData] =
    await Promise.all([
      prisma.task.findMany({
        where: { date: today },
        orderBy: [{ startTime: "asc" }, { id: "asc" }],
        include: { subject: { select: { id: true, name: true, color: true } } },
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
  const totalMinutes = sessionMinutes + (checkin?.durationMin ?? 0);

  return (
    <div className="p-8">
      <PageHeader
        title="今日总结"
        code="DAILY REPORT"
        description={`${format(new Date(), "yyyy年M月d日 EEEE")} · 看看今天学了什么`}
      />

      {/* 战况总览：倒计时 + 打卡 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CountdownCard examDate={examDate} />
        <CheckInCard
          totalMinutes={sessionMinutes}
          manualMinutes={checkin?.durationMin ?? 0}
          mood={checkin?.mood ?? null}
          note={checkin?.note ?? null}
          date={today}
        />
      </div>

      {/* 各模块今日完成情况 */}
      <div className="mt-4">
        <SubjectSummary subjects={subjects} tasks={tasks} totalMinutes={totalMinutes} />
      </div>

      {/* 今日任务明细 */}
      <div className="mt-4">
        <TodayTasks
          tasks={tasks}
          subjects={subjects}
          title="今日任务"
          code="TASKS"
        />
      </div>

      {/* 热力图 */}
      <div className="mt-4">
        <Heatmap data={heatData.data} totalMinutes={heatData.totalMinutes} />
      </div>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { todayStr } from "@/lib/dates";

// ---------- 任务 ----------

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? todayStr());
  const subjectId = Number(formData.get("subjectId")) || null;
  if (!title) return;
  await prisma.task.create({ data: { title, date, subjectId } });
  revalidatePath("/");
  revalidatePath("/plan");
}

export async function toggleTask(id: number, done: boolean) {
  await prisma.task.update({ where: { id }, data: { status: done ? "done" : "todo" } });
  revalidatePath("/");
  revalidatePath("/plan");
}

export async function deleteTask(id: number) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/plan");
}

// ---------- 打卡 ----------

export async function saveCheckIn(formData: FormData) {
  const date = String(formData.get("date") ?? todayStr());
  const durationMin = Math.max(0, Math.round(Number(formData.get("durationMin")) || 0));
  const mood = String(formData.get("mood") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;

  const existing = await prisma.checkIn.findUnique({ where: { date } });
  if (existing) {
    await prisma.checkIn.update({
      where: { id: existing.id },
      data: { durationMin, mood, note },
    });
  } else {
    await prisma.checkIn.create({ data: { date, durationMin, mood, note } });
  }
  revalidatePath("/");
  revalidatePath("/stats");
}

// ---------- 设置 ----------

export async function saveExamDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  await prisma.setting.upsert({
    where: { key: "exam_date" },
    create: { key: "exam_date", value: date },
    update: { value: date },
  });
  revalidatePath("/");
}

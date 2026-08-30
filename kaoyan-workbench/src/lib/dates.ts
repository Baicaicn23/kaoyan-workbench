import { format, parseISO } from "date-fns";

export function todayStr(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** 计算 examDate（当天 23:59:59）距现在的剩余天数，已过返回负数 */
export function daysUntil(dateStr: string): number {
  const exam = parseISO(`${dateStr}T23:59:59`);
  return Math.ceil((exam.getTime() - Date.now()) / 86_400_000);
}

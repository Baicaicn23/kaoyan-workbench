"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Calculator,
  GraduationCap,
  Languages,
  NotebookPen,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const modules = [
  { href: "/math", label: "高数", code: "MODULE 01", icon: Calculator },
  { href: "/cet6", label: "英语六级", code: "MODULE 02", icon: Languages },
  { href: "/career", label: "秋招准备", code: "MODULE 03", icon: Briefcase },
];

const navItems = [
  { href: "/", label: "今日总结", code: "DAILY", icon: NotebookPen },
  ...modules,
  { href: "/pomodoro", label: "专注计时", code: "FOCUS", icon: Timer },
  { href: "/stats", label: "数据统计", code: "STATS", icon: BarChart3 },
];

function NavLink({
  href,
  label,
  code,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  code: string;
  icon: typeof Timer;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      {/* 选中态金色左条 */}
      <span
        className={cn(
          "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 bg-accent transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon className="size-4 shrink-0" />
      <span className="flex-1 font-medium">{label}</span>
      <span
        className={cn(
          "ak-label !text-[0.5625rem] opacity-60",
          active && "!text-accent opacity-100",
        )}
      >
        {code}
      </span>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-52 flex-col border-r border-sidebar-border bg-sidebar">
      {/* 顶部标识 */}
      <Link href="/" className="ak-corner block border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="size-5 text-accent" />
          <span className="ak-title text-lg text-foreground">考研工作台</span>
        </div>
        <p className="ak-label mt-1.5 !text-[0.5625rem] opacity-70">
          KAOYAN WORKBENCH
        </p>
      </Link>

      {/* 导航 */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-3">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return <NavLink key={item.href} {...item} active={active} />;
        })}
      </nav>

      {/* 底部状态条 */}
      <div className="border-t border-sidebar-border px-5 py-3.5">
        <p className="ak-label !text-[0.5625rem] opacity-60">
          {format(new Date(), "yyyy.MM.dd")}
        </p>
        <p className="mt-0.5 text-xs text-sidebar-foreground/50">
          稳住节奏 · 一战成硕
        </p>
      </div>
    </aside>
  );
}

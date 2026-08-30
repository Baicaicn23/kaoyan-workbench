"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  NotebookPen,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "今日看板", icon: LayoutDashboard },
  { href: "/plan", label: "周计划", icon: CalendarDays },
  { href: "/pomodoro", label: "番茄钟", icon: Timer },
  { href: "/review", label: "错题本", icon: NotebookPen },
  { href: "/stats", label: "统计", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-52 flex-col border-r bg-sidebar text-sidebar-foreground">
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-5 font-semibold"
      >
        <GraduationCap className="size-5 text-primary" />
        <span>考研工作台</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-xs text-muted-foreground">
        一战成硕 🎓
      </div>
    </aside>
  );
}

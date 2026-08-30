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

const navItems = [
  { href: "/", label: "今日总结", icon: NotebookPen },
  { href: "/math", label: "高数", icon: Calculator },
  { href: "/cet6", label: "英语六级", icon: Languages },
  { href: "/career", label: "秋招准备", icon: Briefcase },
  { href: "/pomodoro", label: "专注计时", icon: Timer },
  { href: "/stats", label: "数据统计", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-sidebar-border bg-sidebar">
      {/* 品牌区 */}
      <Link href="/" className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <GraduationCap className="size-5 text-primary" />
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">考研工作台</p>
          <p className="text-xs text-muted-foreground">Study Workbench</p>
        </div>
      </Link>

      {/* 导航 */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* 底部 */}
      <div className="border-t border-sidebar-border px-5 py-4">
        <p className="text-xs text-muted-foreground">稳住节奏，一战成硕</p>
      </div>
    </aside>
  );
}

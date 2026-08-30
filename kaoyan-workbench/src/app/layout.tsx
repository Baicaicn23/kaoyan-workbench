import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Heartbeat } from "@/components/heartbeat";
import "./globals.css";

export const metadata: Metadata = {
  title: "考研工作台",
  description: "个人考研备考工作台：今日总结、高数、英语六级、秋招准备",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Heartbeat />
        <AppSidebar />
        <main className="pl-52 flex-1">{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

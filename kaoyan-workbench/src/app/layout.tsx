import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Heartbeat } from "@/components/heartbeat";
import "./globals.css";

// 苹果风格字体：Inter（SF Pro 开源替代）+ 普惠体（类苹方中文）
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const puHuiTi = localFont({
  variable: "--font-puhuiti",
  src: [
    { path: "./fonts/Alibaba-PuHuiTi-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Alibaba-PuHuiTi-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "考研工作台",
  description: "个人考研备考工作台：今日总结、高数、英语六级、秋招准备",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${puHuiTi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Heartbeat />
        <AppSidebar />
        <main className="pl-56 flex-1">{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

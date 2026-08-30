"use client";

import { useEffect } from "react";

// 心跳间隔 20s，小于看门狗 60s 超时，保证单次网络抖动不误杀
const HEARTBEAT_INTERVAL = 20_000;

export function Heartbeat() {
  useEffect(() => {
    const ping = () => {
      fetch("/api/heartbeat", { cache: "no-store" }).catch(() => {});
    };
    ping();
    const timer = setInterval(ping, HEARTBEAT_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return null;
}

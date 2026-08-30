// 心跳看门狗：页面全部关闭（心跳停止）后自动停止 dev server
// 用法: node watchdog.mjs <port> <heartbeatFile> <timeoutSec> <intervalSec>
import { existsSync, statSync } from "node:fs";
import { execSync } from "node:child_process";

const [port, heartbeatFile, timeoutSec = 60, intervalSec = 10] = process.argv.slice(2);
const timeoutMs = Number(timeoutSec) * 1000;

function portPids() {
  try {
    const out = execSync("netstat -ano", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      if (parts[1]?.endsWith(`:${port}`) && parts[3] === "LISTENING" && parts[4]) {
        pids.add(parts[4]);
      }
    }
    return [...pids];
  } catch {
    return [];
  }
}

function stopDevServer() {
  const pids = portPids();
  if (pids.length === 0) return;
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F /T`, { stdio: "ignore" });
    } catch {}
  }
  console.log(`[watchdog] 已停止 dev server (PID: ${pids.join(", ")})，端口 ${port} 已释放`);
  process.exit(0);
}

console.log(`[watchdog] 启动：端口 ${port}，心跳超时 ${timeoutSec}s，检查间隔 ${intervalSec}s`);
setInterval(() => {
  if (portPids().length === 0) {
    console.log("[watchdog] dev server 已不在运行，看门狗退出");
    process.exit(0);
  }
  const last = existsSync(heartbeatFile) ? statSync(heartbeatFile).mtimeMs : 0;
  if (Date.now() - last > timeoutMs) {
    console.log("[watchdog] 心跳超时（页面已全部关闭），自动停止 dev server");
    stopDevServer();
  }
}, Number(intervalSec) * 1000);

import { writeFile } from "node:fs/promises";
import path from "node:path";

// 页面心跳：浏览器标签页打开期间定期调用，看门狗据此判断页面是否全部关闭
export async function GET() {
  await writeFile(
    path.join(process.cwd(), ".heartbeat"),
    String(Date.now()),
    "utf8",
  );
  return new Response("ok");
}

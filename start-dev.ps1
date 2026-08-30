# 考研工作台 · 一键启动
# 用法：右键“使用 PowerShell 运行”，或通过桌面快捷方式双击
$ErrorActionPreference = "Stop"

$port = 3000
$url = "http://localhost:$port"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Join-Path $scriptDir "kaoyan-workbench"

if (-not (Test-Path (Join-Path $projectDir "package.json"))) {
    Write-Host "未找到项目目录：$projectDir" -ForegroundColor Red
    exit 1
}

# 端口已被监听：认为 dev server 已在运行，直接打开浏览器
if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
    Start-Process $url
    Write-Host "dev server 已在运行，已打开浏览器。" -ForegroundColor Green
    exit 0
}

# 新窗口启动 dev server（窗口标题：考研工作台 dev server，日志写入 kaoyan-workbench/logs/dev.log）
Start-Process pwsh -ArgumentList @(
    "-NoProfile", "-ExecutionPolicy", "Bypass",
    "-File", (Join-Path $scriptDir "dev-server.ps1")
)

# 轮询等待端口就绪（最多 90 秒）
Write-Host "正在启动 dev server…" -ForegroundColor Yellow
for ($i = 0; $i -lt 90; $i++) {
    Start-Sleep -Seconds 1
    if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
        Start-Sleep -Seconds 2
        Start-Process $url
        Write-Host "启动完成，已打开 $url" -ForegroundColor Green
        exit 0
    }
}

Write-Host "启动超时：请查看 kaoyan-workbench/logs/dev.log" -ForegroundColor Red
exit 1

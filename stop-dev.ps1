# 考研工作台 · 停止 dev server
# 用法：右键“使用 PowerShell 运行”，或通过桌面快捷方式双击
$ErrorActionPreference = "Stop"

$port = 3000
$conn = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue

if (-not $conn) {
    Write-Host "dev server 未在运行。" -ForegroundColor Yellow
    exit 0
}

$ownerPid = $conn[0].OwningProcess
Stop-Process -Id $ownerPid -Force
Start-Sleep -Seconds 1

if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
    Write-Host "停止失败，请手动结束进程。日志：kaoyan-workbench/logs/dev.log" -ForegroundColor Red
    exit 1
}

Write-Host "已停止 dev server（原 PID $ownerPid）。" -ForegroundColor Green

# 内部脚本：在独立窗口启动 dev server（由 start-dev.ps1 调用）
$ErrorActionPreference = "Stop"

$Host.UI.RawUI.WindowTitle = "考研工作台 dev server"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Join-Path $scriptDir "kaoyan-workbench"
$logDir = Join-Path $projectDir "logs"
$logFile = Join-Path $logDir "dev.log"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null
Set-Location $projectDir
npm run dev *> $logFile

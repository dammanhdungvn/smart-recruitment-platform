#requires -Version 5.1
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Starting Smart Recruitment Platform"
Write-Host "=================================="
Write-Host ""

$ScriptDir   = Split-Path -Parent $PSCommandPath
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path

$BackendDir  = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"

if (-not (Test-Path $BackendDir))  { throw "Backend folder not found: $BackendDir" }
if (-not (Test-Path $FrontendDir)) { throw "Frontend folder not found: $FrontendDir" }

$NpmCmd = (Get-Command npm.cmd -ErrorAction SilentlyContinue)
if (-not $NpmCmd) { throw "npm.cmd not found. Install Node.js and reopen VS Code." }

function Ensure-NodeModules {
    param([Parameter(Mandatory=$true)][string]$Dir)
    if (-not (Test-Path (Join-Path $Dir "node_modules"))) {
        Write-Host "Installing dependencies in $Dir ..."
        Push-Location $Dir
        try { & $NpmCmd.Source install }
        finally { Pop-Location }
    }
}

Ensure-NodeModules $BackendDir
Ensure-NodeModules $FrontendDir

Write-Host ""
Write-Host "Starting Backend..."
Push-Location $BackendDir
$BackendProc = Start-Process -FilePath $NpmCmd.Source -ArgumentList @("start") -PassThru -NoNewWindow
Pop-Location

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend..."
Push-Location $FrontendDir
$FrontendProc = Start-Process -FilePath $NpmCmd.Source -ArgumentList @("run","dev") -PassThru -NoNewWindow
Pop-Location

Write-Host ""
Write-Host "Both servers are starting..."
Write-Host "Backend:  http://localhost:5000"
Write-Host "Frontend: http://localhost:5173"
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers"
Write-Host ""

function Stop-All {
    Write-Host ""
    Write-Host "Stopping servers..."
    foreach ($p in @($BackendProc, $FrontendProc)) {
        try {
            if ($p -and -not $p.HasExited) {
                Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
            }
        } catch {}
    }
}

try {
    # Wait until one process exits; Ctrl+C will interrupt this and jump to finally
    while ($true) {
        if ($BackendProc.HasExited -or $FrontendProc.HasExited) { break }
        Start-Sleep -Seconds 1
    }
}
finally {
    Stop-All
}

## Save this as: run_tests.ps1
## PowerShell alternative to run_tests.bat (supports progress bars)

param(
    [int]$Users = 25,
    [int]$Loops = 3,
    [string]$JMeterHome = "C:\apache-jmeter-5.6.3",
    [switch]$OpenReport
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$JmxFile = Join-Path $ProjectRoot "jmeter\viyom_load_test.jmx"
$ResultsDir = Join-Path $ProjectRoot "results"
$ReportsDir = Join-Path $ProjectRoot "reports\html-dashboard"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ResultFile = Join-Path $ResultsDir "viyom_run_${Users}users_${Timestamp}.jtl"
$LogFile = Join-Path $ResultsDir "jmeter_${Timestamp}.log"
$JMeterBin = Join-Path $JMeterHome "bin\jmeter.bat"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  VIYOM DONATION PLATFORM - JMETER TEST RUNNER (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Users      : $Users concurrent users" -ForegroundColor Yellow
Write-Host "  Iterations : $Loops per user" -ForegroundColor Yellow
Write-Host "  JMeter     : $JMeterHome" -ForegroundColor Yellow
Write-Host "  Test Plan  : $JmxFile" -ForegroundColor Yellow
Write-Host ""

# Check JMeter installation
if (-not (Test-Path $JMeterBin)) {
    Write-Host "[ERROR] JMeter not found at: $JMeterBin" -ForegroundColor Red
    Write-Host "Please install JMeter and set -JMeterHome parameter." -ForegroundColor Red
    Write-Host "Download: https://jmeter.apache.org/download_jmeter.cgi" -ForegroundColor Yellow
    exit 1
}

# Check backend health
Write-Host "[INFO] Checking backend health..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/viyom/api/sectors" -TimeoutSec 5
    Write-Host "[OK] Backend is running and responding." -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Backend check failed. Ensure it is running before testing." -ForegroundColor Yellow
}

# Create results directory
if (-not (Test-Path $ResultsDir)) { New-Item -ItemType Directory -Path $ResultsDir | Out-Null }

# Remove old HTML dashboard
if (Test-Path $ReportsDir) {
    Write-Host "[INFO] Removing old HTML dashboard..." -ForegroundColor Gray
    Remove-Item -Path $ReportsDir -Recurse -Force
}

Write-Host ""
Write-Host "[INFO] Starting JMeter load test..." -ForegroundColor Green
Write-Host "[INFO] Results → $ResultFile" -ForegroundColor Gray
Write-Host "[INFO] Log     → $LogFile" -ForegroundColor Gray
Write-Host ""

# Calculate ramp-up based on user count
$RampUp = [Math]::Max(10, [Math]::Floor($Users / 2))

# Build JMeter arguments
$JMeterArgs = @(
    "-n",
    "-t", "`"$JmxFile`"",
    "-l", "`"$ResultFile`"",
    "-e", "-o", "`"$ReportsDir`"",
    "-j", "`"$LogFile`"",
    "-JTHREAD_COUNT_10=10",
    "-JTHREAD_COUNT_25=$([Math]::Min($Users, 25))",
    "-JTHREAD_COUNT_50=$Users",
    "-JRAMP_UP_10=10",
    "-JRAMP_UP_25=$([Math]::Min($RampUp, 20))",
    "-JRAMP_UP_50=$RampUp",
    "-JLOOP_COUNT=$Loops"
)

# Execute JMeter
$process = Start-Process -FilePath $JMeterBin -ArgumentList $JMeterArgs -NoNewWindow -PassThru -Wait

if ($process.ExitCode -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  TEST RUN COMPLETE!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Results JTL  : $ResultFile" -ForegroundColor White
    Write-Host "  HTML Report  : $ReportsDir\index.html" -ForegroundColor White
    Write-Host "  Log File     : $LogFile" -ForegroundColor White
    Write-Host ""

    if ($OpenReport -and (Test-Path "$ReportsDir\index.html")) {
        Write-Host "[INFO] Opening HTML dashboard in browser..." -ForegroundColor Green
        Start-Process "$ReportsDir\index.html"
    } else {
        Write-Host "  To open report: Start-Process '$ReportsDir\index.html'" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "[ERROR] JMeter exited with code: $($process.ExitCode)" -ForegroundColor Red
    Write-Host "Check log file: $LogFile" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================
# USAGE EXAMPLES:
# ============================================================
# # 10 users
# .\run_tests.ps1 -Users 10 -Loops 3 -OpenReport
#
# # 25 users
# .\run_tests.ps1 -Users 25 -Loops 3 -OpenReport
#
# # 50 users stress test
# .\run_tests.ps1 -Users 50 -Loops 3 -OpenReport
#
# # Custom JMeter home
# .\run_tests.ps1 -Users 25 -JMeterHome "D:\tools\jmeter-5.6.3" -OpenReport

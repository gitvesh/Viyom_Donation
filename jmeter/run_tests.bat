@echo off
REM ===========================================================================
REM  Viyom Platform - JMeter Load Test Runner
REM  Windows Batch Script for Apache JMeter 5.6.3
REM ===========================================================================

setlocal enabledelayedexpansion

REM -----------------------------------------------------------------------
REM  CONFIGURE THIS: Set your JMeter installation path
REM -----------------------------------------------------------------------
set JMETER_HOME=C:\apache-jmeter-5.6.3
REM -----------------------------------------------------------------------

set JMETER_BIN=%JMETER_HOME%\bin\jmeter.bat
set PROJECT_ROOT=%~dp0
set JMX_FILE=%PROJECT_ROOT%jmeter\viyom_load_test.jmx
set RESULTS_DIR=%PROJECT_ROOT%results
set REPORTS_DIR=%PROJECT_ROOT%reports\html-dashboard

echo.
echo ============================================================
echo   VIYOM DONATION PLATFORM - JMETER LOAD TEST RUNNER
echo ============================================================
echo.
echo  JMeter Home   : %JMETER_HOME%
echo  Test Plan     : %JMX_FILE%
echo  Results Dir   : %RESULTS_DIR%
echo  Reports Dir   : %REPORTS_DIR%
echo.

REM Validate JMeter installation
if not exist "%JMETER_BIN%" (
    echo [ERROR] JMeter not found at: %JMETER_BIN%
    echo.
    echo Please set the JMETER_HOME variable at the top of this script.
    echo Download JMeter from: https://jmeter.apache.org/download_jmeter.cgi
    echo.
    pause
    exit /b 1
)

REM Validate backend is running
echo [INFO] Checking if backend is running at localhost:8080...
curl -s -o nul -w "%%{http_code}" http://localhost:8080/viyom/api/sectors | findstr "200" > nul
if errorlevel 1 (
    echo [WARNING] Backend does not appear to be running at localhost:8080.
    echo           Start the backend before running load tests!
    echo.
    echo           Run: cd backend ^&^& .\mvnw.cmd spring-boot:run
    echo.
    set /p CONTINUE="Continue anyway? (y/N): "
    if /i "!CONTINUE!" NEQ "y" (
        echo Aborting test run.
        pause
        exit /b 1
    )
) else (
    echo [OK] Backend is running.
)

echo.
echo Select test run mode:
echo.
echo   [1] Full Test Run (All Scenarios: 10, 25, 50 users) - RECOMMENDED
echo   [2] Quick Test Run (10 users only - Auth + Public APIs)
echo   [3] Medium Load Test (25 users - Donor Journey)
echo   [4] Stress Test (50 users only)
echo   [5] Open JMeter GUI (for manual test configuration)
echo   [6] Generate HTML Report from existing results
echo.
set /p CHOICE="Enter your choice (1-6): "

REM Timestamp for unique result files
for /f "tokens=1-6 delims=/:. " %%a in ("%date% %time%") do (
    set TIMESTAMP=%%a%%b%%c_%%d%%e%%f
)
set TIMESTAMP=%TIMESTAMP: =0%

if "%CHOICE%"=="1" goto FULL_RUN
if "%CHOICE%"=="2" goto QUICK_RUN
if "%CHOICE%"=="3" goto MEDIUM_RUN
if "%CHOICE%"=="4" goto STRESS_RUN
if "%CHOICE%"=="5" goto GUI_MODE
if "%CHOICE%"=="6" goto GENERATE_REPORT
echo Invalid choice. Exiting.
pause
exit /b 1

:FULL_RUN
echo.
echo [INFO] Starting FULL test run (All 5 scenarios)...
echo [INFO] Estimated duration: 8-12 minutes
echo.

REM Create results directory if not exists
if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"

REM Clear old HTML dashboard if exists
if exist "%REPORTS_DIR%" (
    echo [INFO] Removing old HTML dashboard...
    rmdir /s /q "%REPORTS_DIR%"
)

set RESULT_FILE=%RESULTS_DIR%\viyom_full_run_%TIMESTAMP%.jtl
set LOG_FILE=%RESULTS_DIR%\jmeter_run_%TIMESTAMP%.log

echo [INFO] Results will be saved to: %RESULT_FILE%
echo [INFO] Log will be saved to: %LOG_FILE%
echo.

"%JMETER_BIN%" -n ^
    -t "%JMX_FILE%" ^
    -l "%RESULT_FILE%" ^
    -e -o "%REPORTS_DIR%" ^
    -j "%LOG_FILE%" ^
    -JTHREAD_COUNT_10=10 ^
    -JTHREAD_COUNT_25=25 ^
    -JTHREAD_COUNT_50=50 ^
    -JRAMP_UP_10=10 ^
    -JRAMP_UP_25=20 ^
    -JRAMP_UP_50=30 ^
    -JLOOP_COUNT=3

echo.
echo ============================================================
echo   TEST RUN COMPLETE!
echo ============================================================
echo.
echo   Results JTL  : %RESULT_FILE%
echo   HTML Report  : %REPORTS_DIR%\index.html
echo   Log File     : %LOG_FILE%
echo.
echo   Opening HTML Dashboard in browser...
start "" "%REPORTS_DIR%\index.html"
echo.
goto END

:QUICK_RUN
echo.
echo [INFO] Starting QUICK test run (10 users - Auth + Public APIs only)...
echo [INFO] Estimated duration: 2-3 minutes
echo.

if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"
set RESULT_FILE=%RESULTS_DIR%\viyom_quick_10users_%TIMESTAMP%.jtl

"%JMETER_BIN%" -n ^
    -t "%JMX_FILE%" ^
    -l "%RESULT_FILE%" ^
    -j "%RESULTS_DIR%\jmeter_quick_%TIMESTAMP%.log" ^
    -JTHREAD_COUNT_10=10 ^
    -JTHREAD_COUNT_25=10 ^
    -JTHREAD_COUNT_50=10 ^
    -JRAMP_UP_10=5 ^
    -JRAMP_UP_25=5 ^
    -JRAMP_UP_50=5 ^
    -JLOOP_COUNT=2

echo.
echo [DONE] Quick test complete. Results: %RESULT_FILE%
goto END

:MEDIUM_RUN
echo.
echo [INFO] Starting MEDIUM load test (25 users - Donor Journey)...
echo [INFO] Estimated duration: 4-6 minutes
echo.

if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"
set RESULT_FILE=%RESULTS_DIR%\viyom_medium_25users_%TIMESTAMP%.jtl
if exist "%REPORTS_DIR%_medium" rmdir /s /q "%REPORTS_DIR%_medium"

"%JMETER_BIN%" -n ^
    -t "%JMX_FILE%" ^
    -l "%RESULT_FILE%" ^
    -e -o "%REPORTS_DIR%_medium" ^
    -j "%RESULTS_DIR%\jmeter_medium_%TIMESTAMP%.log" ^
    -JTHREAD_COUNT_10=10 ^
    -JTHREAD_COUNT_25=25 ^
    -JTHREAD_COUNT_50=10 ^
    -JRAMP_UP_10=10 ^
    -JRAMP_UP_25=20 ^
    -JRAMP_UP_50=10 ^
    -JLOOP_COUNT=3

echo.
echo [DONE] Medium load test complete.
echo   HTML Report: %REPORTS_DIR%_medium\index.html
start "" "%REPORTS_DIR%_medium\index.html"
goto END

:STRESS_RUN
echo.
echo [INFO] Starting STRESS test (50 users)...
echo [INFO] Estimated duration: 5-8 minutes
echo [WARNING] High concurrent load - monitor backend memory and CPU!
echo.

if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"
set RESULT_FILE=%RESULTS_DIR%\viyom_stress_50users_%TIMESTAMP%.jtl
if exist "%REPORTS_DIR%_stress" rmdir /s /q "%REPORTS_DIR%_stress"

"%JMETER_BIN%" -n ^
    -t "%JMX_FILE%" ^
    -l "%RESULT_FILE%" ^
    -e -o "%REPORTS_DIR%_stress" ^
    -j "%RESULTS_DIR%\jmeter_stress_%TIMESTAMP%.log" ^
    -JTHREAD_COUNT_10=10 ^
    -JTHREAD_COUNT_25=10 ^
    -JTHREAD_COUNT_50=50 ^
    -JRAMP_UP_10=5 ^
    -JRAMP_UP_25=5 ^
    -JRAMP_UP_50=30 ^
    -JLOOP_COUNT=3

echo.
echo [DONE] Stress test complete.
echo   HTML Report: %REPORTS_DIR%_stress\index.html
start "" "%REPORTS_DIR%_stress\index.html"
goto END

:GUI_MODE
echo.
echo [INFO] Opening JMeter GUI with test plan loaded...
echo [INFO] Use Ctrl+R or the green Run button to start tests in GUI.
echo.
start "" "%JMETER_BIN%" -t "%JMX_FILE%"
goto END

:GENERATE_REPORT
echo.
echo Generating HTML report from existing JTL results file...
echo.
echo Available result files:
dir /b "%RESULTS_DIR%\*.jtl" 2>nul
echo.
set /p JTL_NAME="Enter JTL filename (without path, e.g., viyom_full_run_xyz.jtl): "
set JTL_PATH=%RESULTS_DIR%\%JTL_NAME%

if not exist "%JTL_PATH%" (
    echo [ERROR] File not found: %JTL_PATH%
    pause
    exit /b 1
)

if exist "%REPORTS_DIR%_custom" rmdir /s /q "%REPORTS_DIR%_custom"

"%JMETER_BIN%" -g "%JTL_PATH%" -o "%REPORTS_DIR%_custom"

echo.
echo [DONE] HTML report generated at: %REPORTS_DIR%_custom\index.html
start "" "%REPORTS_DIR%_custom\index.html"
goto END

:END
echo.
echo ============================================================
echo  Remember to review results in:
echo    %RESULTS_DIR%\
echo    %REPORTS_DIR%\index.html (if generated)
echo ============================================================
echo.
pause
endlocal

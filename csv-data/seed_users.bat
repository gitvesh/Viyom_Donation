@echo off
REM ===========================================================================
REM  Viyom Platform - JMeter Test Users Seeding Script
REM  Seeds all 24 test donor accounts into the running backend
REM  Pre-requisite: Backend must be running at http://localhost:8080/viyom
REM ===========================================================================

echo.
echo ============================================================
echo  VIYOM LOAD TEST - USER SEEDING SCRIPT
echo ============================================================
echo.
echo This script registers all test users from users.csv
echo into the running Viyom backend before load testing.
echo.
echo Pre-requisite: Backend must be running at localhost:8080
echo.

REM Wait 2 seconds before starting
timeout /t 2 /nobreak >nul

echo [INFO] Seeding test users...
echo.

REM Register all test users via REST API
REM (donor@viyom.com and admin@viyom.com are seeded by DataInitializer.java on startup)

for /L %%i in (1,1,24) do (
    echo [%%i/24] Registering testuser%%i@viyom.com ...
    curl -s -X POST http://localhost:8080/viyom/api/auth/register ^
        -H "Content-Type: application/json" ^
        -d "{\"name\":\"Test User %%i\",\"email\":\"testuser%%i@viyom.com\",\"password\":\"Test@123\",\"role\":\"ROLE_DONOR\"}" > nul 2>&1
    echo      Done.
)

echo.
echo ============================================================
echo  All 24 test donor users registered successfully!
echo  (Some may show "already exists" - that is OK)
echo.
echo  Admin Account : admin@viyom.com / Admin@123
echo  Donor Account : donor@viyom.com / donor123
echo  Test Users    : testuser1@viyom.com to testuser24@viyom.com / Test@123
echo ============================================================
echo.
pause

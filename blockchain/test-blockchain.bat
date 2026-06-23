@echo off
setlocal enabledelayedexpansion

REM Blockchain Module Testing Script for Windows
REM Tests configuration, connection, and basic functionality

echo 🚀 Starting Blockchain Module Testing...
echo ==================================

REM Test results
set TESTS_PASSED=0
set TESTS_FAILED=0

REM Function to log test results
:log_test
set test_name=%~1
set result=%~2
set message=%~3

if "%result%"=="PASS" (
    echo ✅ PASS %test_name%
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL %test_name%
    if not "%message%"=="" (
        echo    Message: %message%
    )
    set /a TESTS_FAILED+=1
)
goto :eof

REM Function to check if backend is running
:check_backend
echo 🔍 Checking if backend is running...

curl -s http://localhost:8080/viyom/actuator/health >nul 2>&1
if %errorlevel%==0 (
    call :log_test "Backend Health Check" "PASS"
    goto :eof
) else (
    call :log_test "Backend Health Check" "FAIL" "Backend is not running on localhost:8080"
    goto :eof
)

REM Function to test blockchain configuration
:test_blockchain_config
echo 🔧 Testing Blockchain Configuration...

REM Test 1: Check blockchain status endpoint
echo Testing blockchain status endpoint...
curl -s http://localhost:8080/viyom/api/blockchain/status >temp_status.txt 2>nul
if %errorlevel%==0 (
    set /p STATUS_RESPONSE=<temp_status.txt
    echo Status Response: !STATUS_RESPONSE!
    
    REM Simple check for "connected" in response
    echo !STATUS_RESPONSE! | findstr /C:"connected" >nul
    if %errorlevel%==0 (
        call :log_test "Blockchain Status Endpoint" "PASS"
    ) else (
        call :log_test "Blockchain Status Endpoint" "FAIL" "Invalid response format"
    )
) else (
    call :log_test "Blockchain Status Endpoint" "FAIL" "Endpoint not accessible"
)

REM Test 2: Check configuration validation
echo Testing configuration validation...
if exist "backend\logs\application.log" (
    findstr /C:"Blockchain configuration validation passed" backend\logs\application.log >nul
    if %errorlevel%==0 (
        call :log_test "Configuration Validation" "PASS"
    ) else (
        findstr /C:"Blockchain configuration validation failed" backend\logs\application.log >nul
        if %errorlevel%==0 (
            call :log_test "Configuration Validation" "FAIL" "Configuration validation failed"
        ) else (
            call :log_test "Configuration Validation" "FAIL" "No validation logs found"
        )
    )
) else (
    call :log_test "Configuration Validation" "FAIL" "Log file not found"
)

REM Cleanup
if exist temp_status.txt del temp_status.txt
goto :eof

REM Function to test blockchain connection
:test_blockchain_connection
echo 🔗 Testing Blockchain Connection...

REM Test RPC connection manually
echo Testing RPC connection to Polygon Amoy...
set RPC_URL=https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN

curl -s -X POST "%RPC_URL%" -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}" >temp_rpc.txt 2>nul

findstr /C:"result" temp_rpc.txt >nul
if %errorlevel%==0 (
    for /f "tokens=2 delims=:\"" %%a in ('findstr /C:"result" temp_rpc.txt') do set BLOCK_NUMBER=%%a
    echo Current block: !BLOCK_NUMBER!
    call :log_test "RPC Connection" "PASS"
) else (
    call :log_test "RPC Connection" "FAIL" "Cannot connect to Polygon Amoy RPC"
)

REM Cleanup
if exist temp_rpc.txt del temp_rpc.txt
goto :eof

REM Function to test smart contract
:test_smart_contract
echo 📄 Testing Smart Contract...

REM Test contract loading
echo Testing contract loading...
curl -s http://localhost:8080/viyom/api/blockchain/contract >temp_contract.txt 2>nul

findstr /C:"loaded" temp_contract.txt >nul
if %errorlevel%==0 (
    call :log_test "Contract Loading" "PASS"
) else (
    call :log_test "Contract Loading" "FAIL" "Contract not loaded or accessible"
)

REM Cleanup
if exist temp_contract.txt del temp_contract.txt
goto :eof

REM Function to test donation flow
:test_donation_flow
echo 💝 Testing Donation Flow...

REM Test donation history endpoint
echo Testing donation history endpoint...
set TEST_TOKEN=test_token

curl -s -X GET http://localhost:8080/viyom/api/donations/history -H "Authorization: Bearer %TEST_TOKEN%" >temp_history.txt 2>nul

REM We expect this to fail with 401, but the endpoint should exist
findstr /C:"401\|Unauthorized" temp_history.txt >nul
if %errorlevel%==0 (
    call :log_test "Donation History Endpoint" "PASS" "Endpoint exists (authentication required)"
) else (
    call :log_test "Donation History Endpoint" "FAIL" "Endpoint not accessible"
)

REM Cleanup
if exist temp_history.txt del temp_history.txt
goto :eof

REM Function to run all tests
:run_all_tests
echo 🧪 Running All Blockchain Tests...
echo.

REM Check if backend is running
call :check_backend
if %errorlevel%==1 (
    echo ❌ Backend is not running. Please start the application first:
    echo    cd backend && mvn spring-boot:run
    goto :end
)

echo.
call :test_blockchain_config
echo.
call :test_blockchain_connection
echo.
call :test_smart_contract
echo.
call :test_donation_flow

echo.
echo ==================================
echo 📊 Test Results:
echo ✅ Passed: %TESTS_PASSED%
echo ❌ Failed: %TESTS_FAILED%

if %TESTS_FAILED%==0 (
    echo 🎉 All tests passed! Blockchain module is working correctly.
) else (
    echo ⚠️  Some tests failed. Please check the configuration.
)
goto :end

REM Function to show configuration status
:show_config_status
echo 📋 Current Configuration Status:
echo.

echo Environment Variables:
if defined BLOCKCHAIN_RPC_URL (
    echo   BLOCKCHAIN_RPC_URL: %BLOCKCHAIN_RPC_URL%
) else (
    echo   BLOCKCHAIN_RPC_URL: Not set
)

if defined BLOCKCHAIN_PRIVATE_KEY (
    echo   BLOCKCHAIN_PRIVATE_KEY: [Hidden for security]
) else (
    echo   BLOCKCHAIN_PRIVATE_KEY: Not set
)

if defined BLOCKCHAIN_CONTRACT_ADDRESS (
    echo   BLOCKCHAIN_CONTRACT_ADDRESS: %BLOCKCHAIN_CONTRACT_ADDRESS%
) else (
    echo   BLOCKCHAIN_CONTRACT_ADDRESS: Not set
)

echo.
echo Application Properties:
if exist "backend\src\main\resources\application.properties" (
    for /f "tokens=2 delims==" %%a in ('findstr /C:"blockchain.rpc.url=" backend\src\main\resources\application.properties') do echo   blockchain.rpc.url: %%a
    for /f "tokens=2 delims==" %%a in ('findstr /C:"blockchain.private.key=" backend\src\main\resources\application.properties') do echo   blockchain.private.key: [Hidden for security]
    for /f "tokens=2 delims==" %%a in ('findstr /C:"blockchain.contract.address=" backend\src\main\resources\application.properties') do echo   blockchain.contract.address: %%a
) else (
    echo   application.properties not found
)
echo.
goto :eof

REM Function to provide setup instructions
:show_setup_instructions
echo 🔧 Setup Instructions:
echo.
echo 1. Deploy your smart contract to Polygon Amoy testnet
echo 2. Update backend\src\main\resources\application.properties:
echo    blockchain.rpc.url=https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN
echo    blockchain.private.key=601485FdABC06C7aE51C7B4dea982512771D0a26
echo    blockchain.contract.address=YOUR_DEPLOYED_CONTRACT_ADDRESS
echo.
echo 3. Start the backend application:
echo    cd backend && mvn spring-boot:run
echo.
echo 4. Run this test script again:
echo    test-blockchain.bat
echo.
goto :end

REM Main execution
if "%1"=="config" (
    call :show_config_status
) else if "%1"=="setup" (
    call :show_setup_instructions
) else if "%1"=="test" (
    call :run_all_tests
) else if "%1"=="help" (
    echo Usage: %0 [command]
    echo.
    echo Commands:
    echo   config  - Show current configuration status
    echo   setup   - Show setup instructions
    echo   test    - Run all blockchain tests (default)
    echo   help    - Show this help message
) else (
    call :run_all_tests
)

:end
pause

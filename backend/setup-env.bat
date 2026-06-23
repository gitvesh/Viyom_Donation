@echo off
echo 🚀 Setting up Viyom Backend Environment Variables...
echo.

REM Blockchain Configuration
echo 📡 Blockchain Configuration:
set /p BLOCKCHAIN_RPC_URL="Enter Polygon Amoy RPC URL (default: https://rpc-amoy.polygon.technology): "
if "%BLOCKCHAIN_RPC_URL%"=="" set BLOCKCHAIN_RPC_URL=https://rpc-amoy.polygon.technology

set /p BLOCKCHAIN_PRIVATE_KEY="Enter your private key (without 0x prefix): "
set /p BLOCKCHAIN_CONTRACT_ADDRESS="Enter deployed contract address (with 0x prefix): "

REM Database Configuration
echo.
echo 🗄️ Database Configuration:
set /p DATABASE_URL="Enter database URL (default: jdbc:mysql://localhost:3306/viyom): "
if "%DATABASE_URL%"=="" set DATABASE_URL=jdbc:mysql://localhost:3306/viyom

set /p DATABASE_USERNAME="Enter database username (default: root): "
if "%DATABASE_USERNAME%"=="" set DATABASE_USERNAME=root

set /p DATABASE_PASSWORD="Enter database password: "

REM JWT Configuration
echo.
echo 🔐 JWT Configuration:
set /p JWT_SECRET="Enter JWT secret key: "

REM Razorpay Configuration
echo.
echo 💳 Razorpay Configuration:
set /p RAZORPAY_KEY_ID="Enter Razorpay Key ID: "
set /p RAZORPAY_KEY_SECRET="Enter Razorpay Key Secret: "

REM CORS Configuration
echo.
echo 🌐 CORS Configuration:
set /p CORS_ALLOWED_ORIGINS="Enter allowed origins (comma-separated, default: http://localhost:3000): "
if "%CORS_ALLOWED_ORIGINS%"=="" set CORS_ALLOWED_ORIGINS=http://localhost:3000

REM Create .env file
echo.
echo 📝 Creating .env file...

(
echo # Blockchain Configuration
echo BLOCKCHAIN_RPC_URL=%BLOCKCHAIN_RPC_URL%
echo BLOCKCHAIN_PRIVATE_KEY=%BLOCKCHAIN_PRIVATE_KEY%
echo BLOCKCHAIN_CONTRACT_ADDRESS=%BLOCKCHAIN_CONTRACT_ADDRESS%
echo.
echo # Database Configuration
echo DATABASE_URL=%DATABASE_URL%
echo DATABASE_USERNAME=%DATABASE_USERNAME%
echo DATABASE_PASSWORD=%DATABASE_PASSWORD%
echo.
echo # JWT Configuration
echo JWT_SECRET=%JWT_SECRET%
echo.
echo # Razorpay Configuration
echo RAZORPAY_KEY_ID=%RAZORPAY_KEY_ID%
echo RAZORPAY_KEY_SECRET=%RAZORPAY_KEY_SECRET%
echo.
echo # CORS Configuration
echo CORS_ALLOWED_ORIGINS=%CORS_ALLOWED_ORIGINS%
) > .env

echo ✅ .env file created successfully!

echo.
echo 🔍 Validating configuration...

REM Validate private key format
echo %BLOCKCHAIN_PRIVATE_KEY% | findstr /R "^[0-9a-fA-F][0-9a-fA-F]*$" >nul
if %errorlevel%==0 (
    echo ✅ Private key format is valid
) else (
    echo ❌ Private key format is invalid ^(should be 64 hex characters without 0x prefix^)
)

REM Validate contract address
echo %BLOCKCHAIN_CONTRACT_ADDRESS% | findstr /R "^0x[0-9a-fA-F][0-9a-fA-F]*$" >nul
if %errorlevel%==0 (
    echo ✅ Contract address format is valid
) else (
    echo ❌ Contract address format is invalid ^(should start with 0x and be 42 hex characters^)
)

REM Validate RPC URL
echo %BLOCKCHAIN_RPC_URL% | findstr /R "^https*://" >nul
if %errorlevel%==0 (
    echo ✅ RPC URL format is valid
) else (
    echo ❌ RPC URL format is invalid ^(should start with http:// or https://^)
)

echo.
echo 🎉 Environment setup complete!
echo.
echo Next steps:
echo 1. Review the .env file
echo 2. Set environment variables permanently:
echo    setx BLOCKCHAIN_RPC_URL "%BLOCKCHAIN_RPC_URL%"
echo    setx BLOCKCHAIN_PRIVATE_KEY "%BLOCKCHAIN_PRIVATE_KEY%"
echo    setx BLOCKCHAIN_CONTRACT_ADDRESS "%BLOCKCHAIN_CONTRACT_ADDRESS%"
echo    ^(Repeat for other variables^)
echo.
echo 3. Run the application:
echo    mvn spring-boot:run
echo.
echo Or use the .env file with your IDE's environment variable support

pause

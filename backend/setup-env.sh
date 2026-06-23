#!/bin/bash

# Viyom Backend Environment Setup Script
# Sets up environment variables for blockchain and other sensitive configurations

echo "🚀 Setting up Viyom Backend Environment Variables..."

# Blockchain Configuration
echo "📡 Blockchain Configuration:"
read -p "Enter Polygon Amoy RPC URL (default: https://rpc-amoy.polygon.technology): " BLOCKCHAIN_RPC_URL
BLOCKCHAIN_RPC_URL=${BLOCKCHAIN_RPC_URL:-https://rpc-amoy.polygon.technology}

read -p "Enter your private key (without 0x prefix): " BLOCKCHAIN_PRIVATE_KEY
read -p "Enter deployed contract address (with 0x prefix): " BLOCKCHAIN_CONTRACT_ADDRESS

# Database Configuration
echo ""
echo "🗄️ Database Configuration:"
read -p "Enter database URL (default: jdbc:mysql://localhost:3306/viyom): " DATABASE_URL
DATABASE_URL=${DATABASE_URL:-jdbc:mysql://localhost:3306/viyom}

read -p "Enter database username (default: root): " DATABASE_USERNAME
DATABASE_USERNAME=${DATABASE_USERNAME:-root}

read -s -p "Enter database password: " DATABASE_PASSWORD
echo ""

# JWT Configuration
echo ""
echo "🔐 JWT Configuration:"
read -s -p "Enter JWT secret key: " JWT_SECRET
echo ""

# Razorpay Configuration
echo ""
echo "💳 Razorpay Configuration:"
read -p "Enter Razorpay Key ID: " RAZORPAY_KEY_ID
read -s -p "Enter Razorpay Key Secret: " RAZORPAY_KEY_SECRET
echo ""

# CORS Configuration
echo ""
echo "🌐 CORS Configuration:"
read -p "Enter allowed origins (comma-separated, default: http://localhost:3000): " CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS:-http://localhost:3000}

# Create .env file
echo ""
echo "📝 Creating .env file..."

cat > .env << EOF
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=$BLOCKCHAIN_RPC_URL
BLOCKCHAIN_PRIVATE_KEY=$BLOCKCHAIN_PRIVATE_KEY
BLOCKCHAIN_CONTRACT_ADDRESS=$BLOCKCHAIN_CONTRACT_ADDRESS

# Database Configuration
DATABASE_URL=$DATABASE_URL
DATABASE_USERNAME=$DATABASE_USERNAME
DATABASE_PASSWORD=$DATABASE_PASSWORD

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# Razorpay Configuration
RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET

# CORS Configuration
CORS_ALLOWED_ORIGINS=$CORS_ALLOWED_ORIGINS
EOF

echo "✅ .env file created successfully!"

# Create Windows batch file
echo ""
echo "📝 Creating Windows batch file..."

cat > setup-env.bat << EOF
@echo off
echo Setting up Viyom Backend Environment Variables...

REM Blockchain Configuration
set BLOCKCHAIN_RPC_URL=$BLOCKCHAIN_RPC_URL
set BLOCKCHAIN_PRIVATE_KEY=$BLOCKCHAIN_PRIVATE_KEY
set BLOCKCHAIN_CONTRACT_ADDRESS=$BLOCKCHAIN_CONTRACT_ADDRESS

REM Database Configuration
set DATABASE_URL=$DATABASE_URL
set DATABASE_USERNAME=$DATABASE_USERNAME
set DATABASE_PASSWORD=$DATABASE_PASSWORD

REM JWT Configuration
set JWT_SECRET=$JWT_SECRET

REM Razorpay Configuration
set RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
set RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET

REM CORS Configuration
set CORS_ALLOWED_ORIGINS=$CORS_ALLOWED_ORIGINS

echo Environment variables set successfully!
echo.
echo To run the application:
echo   mvn spring-boot:run
echo.
echo Or to set permanently:
echo   setx BLOCKCHAIN_RPC_URL "%BLOCKCHAIN_RPC_URL%"
echo   (Repeat for other variables)
EOF

echo "✅ setup-env.bat created successfully!"

# Validation
echo ""
echo "🔍 Validating configuration..."

# Validate private key format
if [[ $BLOCKCHAIN_PRIVATE_KEY =~ ^[0-9a-fA-F]{64}$ ]]; then
    echo "✅ Private key format is valid"
else
    echo "❌ Private key format is invalid (should be 64 hex characters without 0x prefix)"
fi

# Validate contract address
if [[ $BLOCKCHAIN_CONTRACT_ADDRESS =~ ^0x[0-9a-fA-F]{40}$ ]]; then
    echo "✅ Contract address format is valid"
else
    echo "❌ Contract address format is invalid (should start with 0x and be 42 hex characters)"
fi

# Validate RPC URL
if [[ $BLOCKCHAIN_RPC_URL =~ ^https?:// ]]; then
    echo "✅ RPC URL format is valid"
else
    echo "❌ RPC URL format is invalid (should start with http:// or https://)"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review the .env file"
echo "2. Source the environment variables:"
echo "   source .env"
echo "3. Run the application:"
echo "   mvn spring-boot:run"
echo ""
echo "For Windows users:"
echo "1. Run setup-env.bat"
echo "2. Run the application with: mvn spring-boot:run"

#!/bin/bash

# Blockchain Module Testing Script
# Tests configuration, connection, and basic functionality

echo "🚀 Starting Blockchain Module Testing..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to log test results
log_test() {
    local test_name="$1"
    local result="$2"
    local message="$3"
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC} $test_name"
        if [ -n "$message" ]; then
            echo -e "   ${YELLOW}Message: $message${NC}"
        fi
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to check if backend is running
check_backend() {
    echo -e "${BLUE}🔍 Checking if backend is running...${NC}"
    
    if curl -s http://localhost:8080/viyom/actuator/health > /dev/null 2>&1; then
        log_test "Backend Health Check" "PASS"
        return 0
    else
        log_test "Backend Health Check" "FAIL" "Backend is not running on localhost:8080"
        return 1
    fi
}

# Function to test blockchain configuration
test_blockchain_config() {
    echo -e "${BLUE}🔧 Testing Blockchain Configuration...${NC}"
    
    # Test 1: Check blockchain status endpoint
    echo "Testing blockchain status endpoint..."
    if curl -s http://localhost:8080/viyom/api/blockchain/status > /dev/null 2>&1; then
        STATUS_RESPONSE=$(curl -s http://localhost:8080/viyom/api/blockchain/status)
        echo "Status Response: $STATUS_RESPONSE"
        
        # Parse response (simple check)
        if echo "$STATUS_RESPONSE" | grep -q "connected"; then
            log_test "Blockchain Status Endpoint" "PASS"
        else
            log_test "Blockchain Status Endpoint" "FAIL" "Invalid response format"
        fi
    else
        log_test "Blockchain Status Endpoint" "FAIL" "Endpoint not accessible"
    fi
    
    # Test 2: Check configuration validation
    echo "Testing configuration validation..."
    LOG_FILE="backend/logs/application.log"
    if [ -f "$LOG_FILE" ]; then
        if grep -q "Blockchain configuration validation passed" "$LOG_FILE"; then
            log_test "Configuration Validation" "PASS"
        elif grep -q "Blockchain configuration validation failed" "$LOG_FILE"; then
            log_test "Configuration Validation" "FAIL" "Configuration validation failed"
        else
            log_test "Configuration Validation" "FAIL" "No validation logs found"
        fi
    else
        log_test "Configuration Validation" "FAIL" "Log file not found"
    fi
}

# Function to test blockchain connection
test_blockchain_connection() {
    echo -e "${BLUE}🔗 Testing Blockchain Connection...${NC}"
    
    # Test RPC connection manually
    echo "Testing RPC connection to Polygon Amoy..."
    RPC_URL="https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN"
    
    RPC_RESPONSE=$(curl -s -X POST "$RPC_URL" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' 2>/dev/null)
    
    if echo "$RPC_RESPONSE" | grep -q '"result"'; then
        BLOCK_NUMBER=$(echo "$RPC_RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
        echo "Current block: $BLOCK_NUMBER"
        log_test "RPC Connection" "PASS"
    else
        log_test "RPC Connection" "FAIL" "Cannot connect to Polygon Amoy RPC"
    fi
}

# Function to test smart contract
test_smart_contract() {
    echo -e "${BLUE}📄 Testing Smart Contract...${NC}"
    
    # Test contract loading
    echo "Testing contract loading..."
    CONTRACT_RESPONSE=$(curl -s http://localhost:8080/viyom/api/blockchain/contract 2>/dev/null)
    
    if echo "$CONTRACT_RESPONSE" | grep -q "loaded"; then
        log_test "Contract Loading" "PASS"
    else
        log_test "Contract Loading" "FAIL" "Contract not loaded or accessible"
    fi
}

# Function to test donation flow
test_donation_flow() {
    echo -e "${BLUE}💝 Testing Donation Flow...${NC}"
    
    # This would require a full user setup, so we'll test the endpoint availability
    echo "Testing donation history endpoint..."
    
    # Create a test token (this would need actual authentication)
    TEST_TOKEN="test_token"
    
    HISTORY_RESPONSE=$(curl -s -X GET http://localhost:8080/viyom/api/donations/history \
        -H "Authorization: Bearer $TEST_TOKEN" 2>/dev/null)
    
    # We expect this to fail with 401, but the endpoint should exist
    if echo "$HISTORY_RESPONSE" | grep -q "401\|Unauthorized"; then
        log_test "Donation History Endpoint" "PASS" "Endpoint exists (authentication required)"
    else
        log_test "Donation History Endpoint" "FAIL" "Endpoint not accessible"
    fi
}

# Function to run all tests
run_all_tests() {
    echo -e "${BLUE}🧪 Running All Blockchain Tests...${NC}"
    echo ""
    
    # Check if backend is running
    if ! check_backend; then
        echo -e "${RED}❌ Backend is not running. Please start the application first:${NC}"
        echo "   cd backend && mvn spring-boot:run"
        exit 1
    fi
    
    echo ""
    test_blockchain_config
    echo ""
    test_blockchain_connection
    echo ""
    test_smart_contract
    echo ""
    test_donation_flow
    
    echo ""
    echo "=================================="
    echo -e "${BLUE}📊 Test Results:${NC}"
    echo -e "${GREEN}✅ Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}❌ Failed: $TESTS_FAILED${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! Blockchain module is working correctly.${NC}"
    else
        echo -e "${YELLOW}⚠️  Some tests failed. Please check the configuration.${NC}"
    fi
}

# Function to show configuration status
show_config_status() {
    echo -e "${BLUE}📋 Current Configuration Status:${NC}"
    echo ""
    
    echo "Environment Variables:"
    echo "  BLOCKCHAIN_RPC_URL: ${BLOCKCHAIN_RPC_URL:-'Not set'}"
    echo "  BLOCKCHAIN_PRIVATE_KEY: ${BLOCKCHAIN_PRIVATE_KEY:-'Not set'}"
    echo "  BLOCKCHAIN_CONTRACT_ADDRESS: ${BLOCKCHAIN_CONTRACT_ADDRESS:-'Not set'}"
    echo ""
    
    echo "Application Properties:"
    if [ -f "backend/src/main/resources/application.properties" ]; then
        echo "  blockchain.rpc.url: $(grep 'blockchain.rpc.url=' backend/src/main/resources/application.properties | cut -d'=' -f2)"
        echo "  blockchain.private.key: $(grep 'blockchain.private.key=' backend/src/main/resources/application.properties | cut -d'=' -f2)"
        echo "  blockchain.contract.address: $(grep 'blockchain.contract.address=' backend/src/main/resources/application.properties | cut -d'=' -f2)"
    else
        echo "  application.properties not found"
    fi
    echo ""
}

# Function to provide setup instructions
show_setup_instructions() {
    echo -e "${BLUE}🔧 Setup Instructions:${NC}"
    echo ""
    echo "1. Deploy your smart contract to Polygon Amoy testnet"
    echo "2. Update backend/src/main/resources/application.properties:"
    echo "   blockchain.rpc.url=https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN"
    echo "   blockchain.private.key=601485FdABC06C7aE51C7B4dea982512771D0a26"
    echo "   blockchain.contract.address=YOUR_DEPLOYED_CONTRACT_ADDRESS"
    echo ""
    echo "3. Start the backend application:"
    echo "   cd backend && mvn spring-boot:run"
    echo ""
    echo "4. Run this test script again:"
    echo "   ./test-blockchain.sh"
    echo ""
}

# Main execution
case "${1:-test}" in
    "config")
        show_config_status
        ;;
    "setup")
        show_setup_instructions
        ;;
    "test")
        run_all_tests
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  config  - Show current configuration status"
        echo "  setup   - Show setup instructions"
        echo "  test    - Run all blockchain tests (default)"
        echo "  help    - Show this help message"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac

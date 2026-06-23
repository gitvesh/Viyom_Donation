# ⚙️ Blockchain Configuration Guide

## ✅ **Configuration Properties Added**

### **application.properties**
```properties
# Blockchain Configuration
blockchain.rpc.url=
blockchain.private.key=
blockchain.contract.address=
```

---

## 🔧 **Spring @Value Integration**

### **BlockchainConfig.java**
```java
@Configuration
@Slf4j
public class BlockchainConfig {

    @Value("${blockchain.rpc.url:https://rpc-amoy.polygon.technology}")
    private String rpcUrl;

    @Value("${blockchain.contract.address:}")
    private String contractAddress;

    @Value("${blockchain.private.key:}")
    private String privateKey;

    @Bean
    public Web3j web3j() {
        HttpService httpService = new HttpService(rpcUrl);
        return Web3j.build(httpService);
    }

    @Bean
    public Credentials credentials() {
        if (privateKey == null || privateKey.isEmpty()) {
            log.warn("Private key not configured. Read-only mode enabled.");
            return null;
        }
        return Credentials.create(privateKey);
    }
}
```

---

## 📋 **Property Details**

| Property | Required | Default | Description |
|----------|----------|---------|-------------|
| `blockchain.rpc.url` | No | `https://rpc-amoy.polygon.technology` | Polygon Amoy RPC endpoint |
| `blockchain.private.key` | No | `null` | Wallet private key (without 0x prefix) |
| `blockchain.contract.address` | No | `null` | Deployed contract address |

---

## 🔒 **Security Best Practices**

### **❌ Never Hardcode Secrets**
```java
// WRONG - Never do this!
private static final String PRIVATE_KEY = "0x1234567890abcdef...";

// WRONG - Never commit secrets to code!
@Value("${blockchain.private.key}")
private String privateKey = "your_hardcoded_private_key";
```

### **✅ Use Environment Variables**
```properties
# application.properties
blockchain.private.key=${BLOCKCHAIN_PRIVATE_KEY:}
blockchain.contract.address=${BLOCKCHAIN_CONTRACT_ADDRESS:}
```

```bash
# Environment variables
export BLOCKCHAIN_PRIVATE_KEY="your_private_key_without_0x_prefix"
export BLOCKCHAIN_CONTRACT_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"
```

---

## 🌍 **Environment-Specific Configuration**

### **Development (application.properties)**
```properties
# Development - can use test values
blockchain.rpc.url=https://rpc-amoy.polygon.technology
blockchain.private.key=
blockchain.contract.address=
```

### **Production (application-prod.properties)**
```properties
# Production - use environment variables
blockchain.rpc.url=${BLOCKCHAIN_RPC_URL:https://rpc-amoy.polygon.technology}
blockchain.private.key=${BLOCKCHAIN_PRIVATE_KEY:}
blockchain.contract.address=${BLOCKCHAIN_CONTRACT_ADDRESS:}
```

---

## 🚀 **Deployment Setup**

### **1. Environment Variables**
```bash
# Set blockchain environment variables
export BLOCKCHAIN_RPC_URL="https://rpc-amoy.polygon.technology"
export BLOCKCHAIN_PRIVATE_KEY="your_private_key_without_0x_prefix"
export BLOCKCHAIN_CONTRACT_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"

# Set other required environment variables
export DATABASE_URL="jdbc:mysql://your-db-host:3306/viyom"
export DATABASE_PASSWORD="your_db_password"
export JWT_SECRET="your_jwt_secret_key"
export RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

### **2. Docker Environment Variables**
```yaml
# docker-compose.yml
version: '3.8'
services:
  viyom-backend:
    image: viyom-backend:latest
    environment:
      - BLOCKCHAIN_RPC_URL=https://rpc-amoy.polygon.technology
      - BLOCKCHAIN_PRIVATE_KEY=${BLOCKCHAIN_PRIVATE_KEY}
      - BLOCKCHAIN_CONTRACT_ADDRESS=${BLOCKCHAIN_CONTRACT_ADDRESS}
      - DATABASE_URL=${DATABASE_URL}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    ports:
      - "8080:8080"
```

### **3. Kubernetes ConfigMap**
```yaml
# k8s-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viyom-config
data:
  BLOCKCHAIN_RPC_URL: "https://rpc-amoy.polygon.technology"
  BLOCKCHAIN_CONTRACT_ADDRESS: "0x1234567890abcdef1234567890abcdef12345678"
---
apiVersion: v1
kind: Secret
metadata:
  name: viyom-secrets
type: Opaque
data:
  BLOCKCHAIN_PRIVATE_KEY: <base64-encoded-private-key>
  DATABASE_PASSWORD: <base64-encoded-db-password>
  JWT_SECRET: <base64-encoded-jwt-secret>
  RAZORPAY_KEY_SECRET: <base64-encoded-razorpay-secret>
```

---

## 🔍 **Configuration Validation**

### **Startup Validation**
```java
@PostConstruct
public void validateConfiguration() {
    log.info("🔍 Validating blockchain configuration...");
    
    if (rpcUrl == null || rpcUrl.isEmpty()) {
        log.error("❌ Blockchain RPC URL not configured");
        throw new IllegalStateException("Blockchain RPC URL is required");
    }
    
    if (contractAddress == null || contractAddress.isEmpty()) {
        log.warn("⚠️ Contract address not configured - blockchain transactions disabled");
    }
    
    if (privateKey == null || privateKey.isEmpty()) {
        log.warn("⚠️ Private key not configured - read-only mode enabled");
    } else {
        log.info("✅ Blockchain configuration validated");
        log.info("📡 RPC URL: {}", rpcUrl);
        log.info("📄 Contract: {}", contractAddress != null ? contractAddress : "Not configured");
        log.info("🔐 Wallet: {}", privateKey != null ? "Configured" : "Not configured");
    }
}
```

---

## 🧪 **Testing Configuration**

### **Test Properties**
```properties
# application-test.properties
blockchain.rpc.url=https://rpc-amoy.polygon.technology
blockchain.private.key=test_private_key_for_testing_only
blockchain.contract.address=0x1234567890abcdef1234567890abcdef12345678
```

### **Configuration Test**
```java
@Test
void testBlockchainConfiguration() {
    assertEquals("https://rpc-amoy.polygon.technology", blockchainConfig.getRpcUrl());
    assertNotNull(blockchainConfig.getPrivateKey());
    assertNotNull(blockchainConfig.getContractAddress());
}
```

---

## 📊 **Configuration Examples**

### **Local Development**
```properties
# application.properties
blockchain.rpc.url=https://rpc-amoy.polygon.technology
blockchain.private.key=
blockchain.contract.address=
```

### **Staging Environment**
```properties
# application-staging.properties
blockchain.rpc.url=${BLOCKCHAIN_RPC_URL:https://rpc-amoy.polygon.technology}
blockchain.private.key=${BLOCKCHAIN_PRIVATE_KEY:}
blockchain.contract.address=${BLOCKCHAIN_CONTRACT_ADDRESS:0x123...}
```

### **Production Environment**
```properties
# application-prod.properties
blockchain.rpc.url=${BLOCKCHAIN_RPC_URL}
blockchain.private.key=${BLOCKCHAIN_PRIVATE_KEY}
blockchain.contract.address=${BLOCKCHAIN_CONTRACT_ADDRESS}
```

---

## 🔧 **Configuration Loading Order**

Spring Boot loads properties in this order:

1. **Default values** in `@Value` annotations
2. **application.properties**
3. **Profile-specific properties** (e.g., `application-prod.properties`)
4. **Environment variables**
5. **Command line arguments**

### **Example Loading**
```java
@Value("${blockchain.rpc.url:https://rpc-amoy.polygon.technology}")
private String rpcUrl;
```

Loading priority:
1. `https://rpc-amoy.polygon.technology` (default)
2. Value from `application.properties`
3. Value from `application-{profile}.properties`
4. `BLOCKCHAIN_RPC_URL` environment variable
5. `--blockchain.rpc.url` command line argument

---

## 🚨 **Common Configuration Issues**

### **1. Private Key Format**
```bash
# ❌ Wrong (with 0x prefix)
export BLOCKCHAIN_PRIVATE_KEY="0x1234567890abcdef..."

# ✅ Correct (without 0x prefix)
export BLOCKCHAIN_PRIVATE_KEY="1234567890abcdef..."
```

### **2. Contract Address Format**
```bash
# ✅ Correct (with 0x prefix)
export BLOCKCHAIN_CONTRACT_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"

# ❌ Wrong (without 0x prefix)
export BLOCKCHAIN_CONTRACT_ADDRESS="1234567890abcdef1234567890abcdef12345678"
```

### **3. RPC URL Validation**
```bash
# Test RPC URL connectivity
curl -X POST https://rpc-amoy.polygon.technology \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## 📚 **Additional Resources**

### **Spring Boot Configuration**
- [Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Environment Variables](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.environment-variables)

### **Polygon Amoy Testnet**
- [RPC Endpoints](https://polygon.technology/docs/develop/ethereum-polygon/develop/get-started)
- [Faucet](https://faucet.polygon.technology/)
- [Network Details](https://polygon.technology/docs/develop/ethereum-polygon/develop/network-details)

### **Security Best Practices**
- [Secret Management](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_secret_management)
- [Environment Variables](https://12factor.net/config)

---

**🎉 Blockchain configuration complete with secure @Value loading and environment variable support!**

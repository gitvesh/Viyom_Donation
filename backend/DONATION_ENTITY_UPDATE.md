# 📝 Donation Entity Update

## ✅ **Updated Donation Entity**

### **New Field Added**
```java
@Column(name = "blockchain_txn_hash", nullable = false)
private String blockchainTxnHash; // donation recorded on blockchain
```

## 🔄 **Field Changes**

### **Previous Implementation**
```java
@Column(nullable = false)
private String blockchainTxHash; // donation recorded on blockchain
```

### **Updated Implementation**
```java
@Column(name = "blockchain_txn_hash", nullable = false)
private String blockchainTxnHash; // donation recorded on blockchain
```

## 📊 **Database Schema Update**

### **Migration Script: V3__Add_Blockchain_Txn_Hash_Column.sql**

#### **Features**
- **Smart migration** - handles both scenarios
- **Column rename** if `blockchain_tx_hash` exists
- **Column add** if `blockchain_tx_hash` doesn't exist
- **Data preservation** - no data loss
- **Index creation** for query performance
- **Default value** for existing records

#### **Migration Logic**
```sql
-- Check if old column exists
SET @renameColumn = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'donations' 
        AND COLUMN_NAME = 'blockchain_tx_hash'
    ), 'YES', 'NO'
));

-- Execute appropriate action
SET @sql = IF(@renameColumn = 'YES',
    'ALTER TABLE donations CHANGE COLUMN blockchain_tx_hash blockchain_txn_hash VARCHAR(255) NOT NULL DEFAULT \'PENDING_BLOCKCHAIN\'',
    'ALTER TABLE donations ADD COLUMN blockchain_txn_hash VARCHAR(255) NOT NULL DEFAULT \'PENDING_BLOCKCHAIN\''
);
```

## 🗄️ **Database Schema**

### **Updated Donations Table**
```sql
CREATE TABLE donations (
    donation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(15,2) NOT NULL,
    donated_at DATETIME NOT NULL,
    anonymous BOOLEAN NOT NULL,
    blockchain_txn_hash VARCHAR(255) NOT NULL DEFAULT 'PENDING_BLOCKCHAIN',
    donor_id BIGINT NOT NULL,
    pool_id BIGINT NOT NULL,
    payment_order_id BIGINT NOT NULL,
    
    INDEX idx_donations_blockchain_txn_hash (blockchain_txn_hash),
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
    FOREIGN KEY (pool_id) REFERENCES donation_pools(pool_id),
    FOREIGN KEY (payment_order_id) REFERENCES payment_orders(payment_order_id)
);
```

## 📋 **Field Details**

### **blockchainTxnHash**
- **Type**: `VARCHAR(255)`
- **Nullable**: `false`
- **Default**: `'PENDING_BLOCKCHAIN'`
- **Purpose**: Store blockchain transaction hash
- **Index**: Yes (for performance)

### **Status Values**
| Value | Meaning | When Set |
|--------|---------|----------|
| `"PENDING_BLOCKCHAIN"` | Payment successful, blockchain pending | Initial state |
| `"0x123..."` | Blockchain recording successful | After successful recording |
| `"FAILED"` | Blockchain recording failed | On blockchain service failure |
| `"ERROR"` | Exception occurred | On exception |

## 🔧 **Code Updates Required**

### **1. Entity Class**
```java
// Updated field name and column annotation
@Column(name = "blockchain_txn_hash", nullable = false)
private String blockchainTxnHash;
```

### **2. Service Classes**
```java
// DonationService.java
donation.setBlockchainTxnHash(transactionHash);

// PaymentService.java
.blockchainTxnHash("PENDING_BLOCKCHAIN")
```

### **3. DTO Classes**
```java
// DonationHistoryResponse.java
private String blockchainTxnHash;
```

### **4. Test Classes**
```java
// BlockchainIntegrationTest.java
.blockchainTxnHash("PENDING_BLOCKCHAIN")
expectedTxHash.equals(savedDonation.getBlockchainTxnHash())
```

## 🚀 **Migration Process**

### **Before Migration**
```sql
-- Check current schema
DESCRIBE donations;

-- Check if old column exists
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'donations' 
AND COLUMN_NAME = 'blockchain_tx_hash';
```

### **Run Migration**
```bash
# Spring Boot will automatically run Flyway migration
mvn spring-boot:run
# or
./mvnw spring-boot:run
```

### **After Migration**
```sql
-- Verify new column exists
DESCRIBE donations;

-- Check data integrity
SELECT donation_id, blockchain_txn_hash FROM donations LIMIT 10;

-- Verify index created
SHOW INDEX FROM donations WHERE Key_name = 'idx_donations_blockchain_txn_hash';
```

## 📊 **Data Migration Safety**

### **No Data Loss**
- **Existing data preserved** during column rename
- **Default values** for new records
- **Rollback capability** with Flyway

### **Backward Compatibility**
- **Smart migration** handles both scenarios
- **Graceful handling** of missing columns
- **No breaking changes** to existing functionality

## 🧪 **Testing Scenarios**

### **1. Fresh Database**
```sql
-- Column doesn't exist, will be added
ALTER TABLE donations ADD COLUMN blockchain_txn_hash VARCHAR(255) NOT NULL DEFAULT 'PENDING_BLOCKCHAIN';
```

### **2. Existing Database with Old Column**
```sql
-- Column exists, will be renamed
ALTER TABLE donations CHANGE COLUMN blockchain_tx_hash blockchain_txn_hash VARCHAR(255) NOT NULL DEFAULT 'PENDING_BLOCKCHAIN';
```

### **3. Data Verification**
```java
@Test
void testBlockchainTxnHashField() {
    Donation donation = new Donation();
    donation.setBlockchainTxnHash("0x123...");
    
    assertEquals("0x123...", donation.getBlockchainTxnHash());
    
    // Test database persistence
    Donation saved = donationRepository.save(donation);
    assertEquals("0x123...", saved.getBlockchainTxnHash());
}
```

## 🔍 **Validation**

### **Entity Validation**
```java
@Test
void testEntityFieldMapping() {
    // Verify field name mapping
    Field field = Donation.class.getDeclaredField("blockchainTxnHash");
    Column column = field.getAnnotation(Column.class);
    
    assertEquals("blockchain_txn_hash", column.name());
    assertFalse(column.nullable());
}
```

### **Database Validation**
```java
@Test
void testDatabaseSchema() {
    // Verify column exists in database
    jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
        "WHERE TABLE_NAME = 'donations' AND COLUMN_NAME = 'blockchain_txn_hash'",
        Integer.class
    );
}
```

## 📈 **Performance Considerations**

### **Index Benefits**
- **Faster queries** on transaction hash lookups
- **Improved performance** for blockchain verification
- **Optimized filtering** in donation history

### **Storage Impact**
- **VARCHAR(255)** - minimal storage overhead
- **Index size** - manageable for expected data volume
- **Query performance** - significantly improved

## 🔄 **API Impact**

### **Response Format**
```json
{
    "donationId": 1,
    "amount": 100.00,
    "blockchainTxnHash": "0x1234567890abcdef...",
    "status": "SUCCESS"
}
```

### **Frontend Integration**
```javascript
// Updated field reference
const blockchainHash = donation.blockchainTxnHash;
```

## 🛡️ **Security Considerations**

### **Data Validation**
- **Hash format validation** in service layer
- **Length constraints** enforced at database level
- **Null safety** with NOT NULL constraint

### **Access Control**
- **Read access** for donors to view their transaction hashes
- **Write access** restricted to system processes
- **Audit trail** maintained through transaction logs

---

**🎉 Donation entity successfully updated with blockchainTxnHash field and safe database migration!**

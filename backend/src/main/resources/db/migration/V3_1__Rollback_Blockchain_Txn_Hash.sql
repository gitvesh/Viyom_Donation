-- Rollback migration for blockchain_txn_hash column
-- This migration safely removes or renames the blockchain_txn_hash column

-- Check if the blockchain_txn_hash column exists
SET @columnExists = (SELECT IF(
    EXISTS(
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE 
            TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'donations' 
            AND COLUMN_NAME = 'blockchain_txn_hash'
    ),
    'YES',
    'NO'
));

-- Only proceed if column exists
SET @sql = IF(@columnExists = 'YES',
    'DROP INDEX idx_donations_blockchain_txn_hash ON donations; ALTER TABLE donations DROP COLUMN blockchain_txn_hash',
    'SELECT ''Column blockchain_txn_hash does not exist, skipping rollback'' as message'
);

-- Execute the rollback
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Log the rollback completion
SELECT 'V3_1__Rollback_Blockchain_Txn_Hash rollback completed' as rollback_status;

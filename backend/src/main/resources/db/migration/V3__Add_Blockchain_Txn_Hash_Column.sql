-- Add blockchain_txn_hash column to donations table
-- This migration handles both scenarios:
-- 1. If blockchain_tx_hash doesn't exist, add it
-- 2. If blockchain_tx_hash exists, rename it to blockchain_txn_hash

-- Check if the old column exists and rename it if needed
-- This handles the case where blockchain_tx_hash already exists
SET @renameColumn = (SELECT IF(
    EXISTS(
        SELECT 1 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE 
            TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'donations' 
            AND COLUMN_NAME = 'blockchain_tx_hash'
    ),
    'YES',
    'NO'
));

-- If old column exists, rename it to new column name
SET @sql = IF(@renameColumn = 'YES',
    'ALTER TABLE donations CHANGE COLUMN blockchain_tx_hash blockchain_txn_hash VARCHAR(255) NULL DEFAULT NULL',
    'ALTER TABLE donations ADD COLUMN blockchain_txn_hash VARCHAR(255) NULL DEFAULT NULL'
);

-- Execute the appropriate SQL
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for better query performance on blockchain transaction hash
CREATE INDEX idx_donations_blockchain_txn_hash ON donations(blockchain_txn_hash);

-- Add comment to document the column
ALTER TABLE donations COMMENT = 'Donations table with blockchain transaction tracking';

-- Log the migration completion
SELECT 'V3__Add_Blockchain_Txn_Hash_Column migration completed successfully' as migration_status;

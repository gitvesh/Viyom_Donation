-- Fix fund_allocations table column issues
-- The old 'blockchain_tx_hash' column is NOT NULL causing INSERT failures.
-- The new columns 'allocation_txn_hash' and 'blockchain_status' are already added by JPA ddl-auto=update.
-- This migration makes the old column nullable (safe default) so inserts don't fail.

-- 1. Make blockchain_tx_hash nullable if it exists (fixes the NOT NULL constraint error)
SET @col1Exists = (SELECT IF(
    EXISTS(
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'fund_allocations'
            AND COLUMN_NAME = 'blockchain_tx_hash'
    ),
    'YES',
    'NO'
));

SET @sql1 = IF(@col1Exists = 'YES',
    'ALTER TABLE fund_allocations MODIFY COLUMN blockchain_tx_hash VARCHAR(255) NULL DEFAULT NULL',
    'SELECT "blockchain_tx_hash column does not exist, skipping" as info'
);

PREPARE stmt1 FROM @sql1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

-- 2. Ensure allocation_txn_hash column exists (nullable)
SET @col2Exists = (SELECT IF(
    EXISTS(
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'fund_allocations'
            AND COLUMN_NAME = 'allocation_txn_hash'
    ),
    'YES',
    'NO'
));

SET @sql2 = IF(@col2Exists = 'NO',
    'ALTER TABLE fund_allocations ADD COLUMN allocation_txn_hash VARCHAR(255) NULL DEFAULT NULL',
    'SELECT "allocation_txn_hash column already exists, skipping" as info'
);

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- 3. Ensure blockchain_status column exists (nullable)
SET @col3Exists = (SELECT IF(
    EXISTS(
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'fund_allocations'
            AND COLUMN_NAME = 'blockchain_status'
    ),
    'YES',
    'NO'
));

SET @sql3 = IF(@col3Exists = 'NO',
    'ALTER TABLE fund_allocations ADD COLUMN blockchain_status VARCHAR(50) NULL DEFAULT NULL',
    'SELECT "blockchain_status column already exists, skipping" as info'
);

PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

SELECT 'V4__Fix_Fund_Allocations_Columns migration completed successfully' as migration_status;

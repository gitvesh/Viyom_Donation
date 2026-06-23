// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DonationTransparency
 * @dev Smart contract for storing donation records with transparency verification
 * @notice Optimized for low gas usage on Polygon Amoy testnet
 */
contract DonationTransparency {
    
    // ==================== STRUCTS ====================
    
    /**
     * @dev Donation record structure
     * @param donorHash Hash of donor identifier for privacy
     * @param amount Donation amount in wei
     * @param category Donation category/sector
     * @param orderId Razorpay order ID
     * @param timestamp Donation timestamp
     */
    struct Donation {
        bytes32 donorHash;
        uint256 amount;
        string category;
        string orderId;
        uint256 timestamp;
    }
    
    // ==================== STORAGE ====================
    
    /**
     * @dev Mapping from order ID to donation record
     * Using order ID as key for efficient lookup
     */
    mapping(string => Donation) public donations;
    
    /**
     * @dev Array of all order IDs for pagination/iteration
     * Only stores order IDs to save gas (strings are expensive in arrays)
     */
    string[] private orderIds;
    
    /**
     * @dev Mapping to check if order ID exists
     * Prevents duplicate donations and saves gas on existence checks
     */
    mapping(string => bool) private orderIdExists;
    
    // ==================== EVENTS ====================
    
    /**
     * @dev Emitted when a donation is recorded
     * @param donorHash Hash of donor identifier
     * @param amount Donation amount in wei
     * @param category Donation category/sector
     * @param orderId Razorpay order ID
     * @param timestamp Donation timestamp
     */
    event DonationRecorded(
        bytes32 indexed donorHash,
        uint256 indexed amount,
        string category,
        string indexed orderId,
        uint256 timestamp
    );
    
    // ==================== FUNCTIONS ====================
    
    /**
     * @dev Records a new donation on the blockchain
     * @param donorHash Hash of donor identifier for privacy
     * @param amount Donation amount in wei
     * @param category Donation category/sector
     * @param orderId Razorpay order ID
     * @param timestamp Donation timestamp
     */
    function recordDonation(
        bytes32 donorHash,
        uint256 amount,
        string memory category,
        string memory orderId,
        uint256 timestamp
    ) external {
        // Check for duplicate order ID
        require(!orderIdExists[orderId], "DonationTransparency: Order ID already exists");
        require(amount > 0, "DonationTransparency: Amount must be greater than 0");
        require(bytes(category).length > 0, "DonationTransparency: Category cannot be empty");
        require(bytes(orderId).length > 0, "DonationTransparency: Order ID cannot be empty");
        require(timestamp > 0, "DonationTransparency: Timestamp must be valid");
        
        // Create new donation record
        Donation memory newDonation = Donation({
            donorHash: donorHash,
            amount: amount,
            category: category,
            orderId: orderId,
            timestamp: timestamp
        });
        
        // Store donation
        donations[orderId] = newDonation;
        
        // Mark order ID as exists
        orderIdExists[orderId] = true;
        
        // Add to order IDs array (only if not already added)
        orderIds.push(orderId);
        
        // Emit event
        emit DonationRecorded(donorHash, amount, category, orderId, timestamp);
    }
    
    /**
     * @dev Retrieves donation record by order ID
     * @param orderId Razorpay order ID
     * @return donorHash Hash of donor identifier
     * @return amount Donation amount in wei
     * @return category Donation category/sector
     * @return timestamp Donation timestamp
     */
    function getDonation(string memory orderId) 
        external 
        view 
        returns (
            bytes32 donorHash,
            uint256 amount,
            string memory category,
            uint256 timestamp
        ) 
    {
        require(orderIdExists[orderId], "DonationTransparency: Donation not found");
        
        Donation storage donation = donations[orderId];
        return (
            donation.donorHash,
            donation.amount,
            donation.category,
            donation.timestamp
        );
    }
    
    /**
     * @dev Checks if a donation exists for given order ID
     * @param orderId Razorpay order ID
     * @return exists True if donation exists, false otherwise
     */
    function donationExists(string memory orderId) external view returns (bool) {
        return orderIdExists[orderId];
    }
    
    /**
     * @dev Gets total number of recorded donations
     * @return count Total number of donations
     */
    function getTotalDonations() external view returns (uint256) {
        return orderIds.length;
    }
    
    /**
     * @dev Gets order ID by index (for pagination)
     * @param index Index in order IDs array
     * @return orderId Order ID at given index
     */
    function getOrderIdByIndex(uint256 index) external view returns (string memory) {
        require(index < orderIds.length, "DonationTransparency: Index out of bounds");
        return orderIds[index];
    }
    
    /**
     * @dev Gets multiple donations for batch queries (gas efficient)
     * @param orderIds Array of order IDs to retrieve
     * @return donations Array of donation records
     */
    function getBatchDonations(string[] memory orderIdsArray) 
        external 
        view 
        returns (Donation[] memory) 
    {
        Donation[] memory batchDonations = new Donation[](orderIdsArray.length);
        
        for (uint256 i = 0; i < orderIdsArray.length; i++) {
            if (orderIdExists[orderIdsArray[i]]) {
                batchDonations[i] = donations[orderIdsArray[i]];
            }
        }
        
        return batchDonations;
    }
    
    /**
     * @dev Gets donations by category (gas efficient filtering)
     * @param category Category to filter by
     * @param offset Starting index for pagination
     * @param limit Maximum number of results
     * @return orderIds Array of order IDs matching category
     */
    function getDonationsByCategory(
        string memory category, 
        uint256 offset, 
        uint256 limit
    ) external view returns (string[] memory) {
        uint256 count = 0;
        uint256 maxIterations = offset + limit;
        
        // First pass: count matching donations
        for (uint256 i = offset; i < orderIds.length && i < maxIterations; i++) {
            if (keccak256(bytes(donations[orderIds[i]].category)) == keccak256(bytes(category))) {
                count++;
            }
        }
        
        // Second pass: collect order IDs
        string[] memory matchingOrderIds = new string[](count);
        uint256 index = 0;
        
        for (uint256 i = offset; i < orderIds.length && i < maxIterations; i++) {
            if (keccak256(bytes(donations[orderIds[i]].category)) == keccak256(bytes(category))) {
                matchingOrderIds[index] = orderIds[i];
                index++;
            }
        }
        
        return matchingOrderIds;
    }
    
    /**
     * @dev Gets donations within a timestamp range
     * @param startTime Start timestamp (inclusive)
     * @param endTime End timestamp (inclusive)
     * @return orderIds Array of order IDs within range
     */
    function getDonationsByTimeRange(
        uint256 startTime, 
        uint256 endTime
    ) external view returns (string[] memory) {
        uint256 count = 0;
        
        // First pass: count matching donations
        for (uint256 i = 0; i < orderIds.length; i++) {
            if (donations[orderIds[i]].timestamp >= startTime && 
                donations[orderIds[i]].timestamp <= endTime) {
                count++;
            }
        }
        
        // Second pass: collect order IDs
        string[] memory matchingOrderIds = new string[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < orderIds.length; i++) {
            if (donations[orderIds[i]].timestamp >= startTime && 
                donations[orderIds[i]].timestamp <= endTime) {
                matchingOrderIds[index] = orderIds[i];
                index++;
            }
        }
        
        return matchingOrderIds;
    }
    
    /**
     * @dev Contract metadata for EIP-165 support
     */
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x01ffc9a7 || // ERC165
               interfaceId == 0x80ac58cd;   // ERC721 (placeholder for future expansion)
    }
}

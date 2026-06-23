# 📊 Donation History API Endpoint

## ✅ **New Endpoint Created**

### **GET /api/donations/history**
Returns clean donation history with blockchain verification URLs for frontend UI.

---

## 🔧 **Endpoint Details**

### **URL**
```
GET /api/donations/history
```

### **Authentication**
- **Required**: Yes
- **Roles**: `ROLE_USER`, `ROLE_ADMIN`
- **Method**: JWT Bearer Token

### **Headers**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 📋 **Response Format**

### **Success Response (200 OK)**
```json
[
  {
    "donationId": 1,
    "amount": 100.00,
    "category": "Education",
    "timestamp": "2024-03-06T10:30:00",
    "blockchainTxnHash": "0x1234567890abcdef1234567890abcdef12345678",
    "blockchainVerification": {
      "verified": true,
      "status": "verified",
      "explorerUrl": "https://amoy.polygonscan.com/tx/0x1234567890abcdef1234567890abcdef12345678",
      "verificationApi": "/api/blockchain/verify/0x1234567890abcdef1234567890abcdef12345678"
    }
  },
  {
    "donationId": 2,
    "amount": 50.00,
    "category": "Healthcare",
    "timestamp": "2024-03-05T15:45:00",
    "blockchainTxnHash": null,
    "blockchainVerification": {
      "verified": false,
      "status": "pending",
      "explorerUrl": null,
      "verificationApi": null
    }
  }
]
```

### **Error Responses**
```json
// 401 Unauthorized
{
  "timestamp": "2024-03-06T10:30:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}

// 403 Forbidden
{
  "timestamp": "2024-03-06T10:30:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access is denied"
}
```

---

## 📊 **Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `donationId` | Long | Unique donation identifier |
| `amount` | BigDecimal | Donation amount |
| `category` | String | Donation category/sector |
| `timestamp` | LocalDateTime | When donation was made |
| `blockchainTxnHash` | String | Blockchain transaction hash (null if not recorded) |
| `blockchainVerification` | Object | Blockchain verification information |

### **BlockchainVerification Object**
| Field | Type | Description |
|-------|------|-------------|
| `verified` | Boolean | True if transaction is recorded on blockchain |
| `status` | String | Status: "verified" or "pending" |
| `explorerUrl` | String | PolygonScan URL for transaction (null if not verified) |
| `verificationApi` | String | Internal API URL for verification (null if not verified) |

---

## 🔗 **Blockchain Verification URLs**

### **PolygonScan Explorer URL**
```
https://amoy.polygonscan.com/tx/{transactionHash}
```

### **Internal Verification API**
```
/api/blockchain/verify/{transactionHash}
```

### **URL Examples**
```json
{
  "explorerUrl": "https://amoy.polygonscan.com/tx/0x1234567890abcdef1234567890abcdef12345678",
  "verificationApi": "/api/blockchain/verify/0x1234567890abcdef1234567890abcdef12345678"
}
```

---

## 🧪 **Usage Examples**

### **cURL Request**
```bash
curl -X GET http://localhost:8080/viyom/api/donations/history \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### **JavaScript/Fetch**
```javascript
const response = await fetch('/viyom/api/donations/history', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const donations = await response.json();
console.log(donations);
```

### **Axios Example**
```javascript
import axios from 'axios';

const getDonationHistory = async () => {
  try {
    const response = await axios.get('/viyom/api/donations/history', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching donation history:', error);
    throw error;
  }
};
```

---

## 🎨 **Frontend Integration**

### **React Component Example**
```jsx
import React, { useState, useEffect } from 'react';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/viyom/api/donations/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const renderBlockchainStatus = (verification) => {
    if (verification.verified) {
      return (
        <div className="blockchain-verified">
          <span className="status verified">✅ {verification.statusText}</span>
          <a 
            href={verification.explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="explorer-link"
          >
            {verification.explorerText}
          </a>
        </div>
      );
    } else {
      return (
        <div className="blockchain-pending">
          <span className="status pending">⏳ {verification.statusText}</span>
        </div>
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="donation-history">
      <h2>Donation History</h2>
      {donations.map(donation => (
        <div key={donation.donationId} className="donation-item">
          <div className="donation-info">
            <h3>{donation.category}</h3>
            <p>Amount: ${donation.amount}</p>
            <p>Date: {new Date(donation.timestamp).toLocaleDateString()}</p>
          </div>
          <div className="blockchain-info">
            {renderBlockchainStatus(donation.blockchainVerification)}
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## 🔍 **API Testing**

### **Test Cases**

#### **1. Successful Response**
```bash
# Request
curl -X GET http://localhost:8080/viyom/api/donations/history \
  -H "Authorization: Bearer <valid_token>"

# Expected Response
[
  {
    "donationId": 1,
    "amount": 100.00,
    "category": "Education",
    "timestamp": "2024-03-06T10:30:00",
    "blockchainTxnHash": "0x1234567890abcdef1234567890abcdef12345678",
    "blockchainVerification": {
      "verified": true,
      "status": "verified",
      "explorerUrl": "https://amoy.polygonscan.com/tx/0x1234567890abcdef1234567890abcdef12345678",
      "verificationApi": "/api/blockchain/verify/0x1234567890abcdef1234567890abcdef12345678"
    }
  }
]
```

#### **2. Unauthorized Request**
```bash
# Request (no token)
curl -X GET http://localhost:8080/viyom/api/donations/history

# Expected Response
{
  "timestamp": "2024-03-06T10:30:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

#### **3. Empty Donation History**
```bash
# Request
curl -X GET http://localhost:8080/viyom/api/donations/history \
  -H "Authorization: Bearer <valid_token>"

# Expected Response
[]
```

---

## 📈 **Performance Considerations**

### **Database Queries**
- Uses `donationRepository.findByDonor(donor)` - optimized with indexes
- Returns raw entities for flexible DTO conversion
- Lazy loading for related entities (DonationPool, Sector)

### **Response Size**
- Typical response size: ~500 bytes per donation
- Blockchain URLs add minimal overhead
- Suitable for pagination if needed

### **Caching Strategy**
```java
@Cacheable(value = "donationHistory", key = "#donor.donorId")
public List<Donation> getDonationEntitiesForDonor(Donor donor) {
    return donationRepository.findByDonor(donor);
}
```

---

## 🔒 **Security Considerations**

### **Authentication**
- JWT token required
- User can only see their own donations
- Role-based access control

### **Data Privacy**
- No sensitive information exposed
- Blockchain hashes are public anyway
- Donor identity protected via hashes

### **Input Validation**
- No user input required (GET endpoint)
- JWT token validation handled by Spring Security
- Response data sanitized by entity mapping

---

## 🔄 **Related Endpoints**

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `/api/donations/history` | Clean history with blockchain URLs | GET |
| `/api/donations/my-donations` | Legacy donation history | GET |
| `/api/donations/admin/donations` | Admin view of all donations | GET |
| `/api/blockchain/verify/{hash}` | Verify blockchain transaction | GET |

---

## 🚀 **Future Enhancements**

### **Potential Improvements**
1. **Pagination**: For large donation histories
2. **Filtering**: By date range, category, amount
3. **Sorting**: By date, amount, blockchain status
4. **Caching**: Improve performance for frequent requests
5. **Real-time Updates**: WebSocket for live blockchain status

### **Example Pagination**
```java
@GetMapping("/history")
public ResponseEntity<Page<DonationHistoryApiResponse>> getDonationHistory(
        @AuthenticationPrincipal AuthUser authUser,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "timestamp") String sortBy) {
    // Implementation with pagination
}
```

---

**🎉 Clean donation history API endpoint created with blockchain verification URLs!**

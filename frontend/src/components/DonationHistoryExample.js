import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

/**
 * Example React component for consuming the donation history API
 * Shows how to integrate with the new /api/donations/history endpoint
 */
const DonationHistoryExample = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const fetchDonationHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/viyom/api/donations/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDonations(data);
    } catch (err) {
      console.error('Error fetching donation history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBlockchainStatus = (verification) => {
    if (verification.verified) {
      return (
        <div className="blockchain-verified">
          <span className="status-badge success">
            ✅ {verification.statusText}
          </span>
          {verification.explorerUrl && (
            <a
              href={verification.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="explorer-link"
            >
              🔍 View on PolygonScan
            </a>
          )}
          {verification.verificationApi && (
            <button
              onClick={() => verifyTransaction(verification.verificationApi)}
              className="verify-btn"
            >
              🔄 Verify
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div className="blockchain-pending">
          <span className="status-badge pending">
            ⏳ {verification.statusText}
          </span>
          <span className="pending-info">
            Transaction will be recorded shortly
          </span>
        </div>
      );
    }
  };

  const verifyTransaction = async (verificationApi) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/viyom${verificationApi}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      alert(`Transaction verification: ${result ? 'Verified' : 'Not verified'}`);
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to verify transaction');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading donation history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading donation history</h3>
        <p>{error}</p>
        <button onClick={fetchDonationHistory} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="donation-history-container">
      <div className="header">
        <h2>📊 Your Donation History</h2>
        <div className="stats">
          <span className="total-donations">
            Total Donations: {donations.length}
          </span>
          <span className="verified-count">
            Verified: {donations.filter(d => d.blockchainVerification.verified).length}
          </span>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="empty-state">
          <h3>No donations yet</h3>
          <p>Start making donations to see your contribution history here.</p>
          <button className="donate-btn">
            💝 Make a Donation
          </button>
        </div>
      ) : (
        <div className="donations-list">
          {donations.map((donation) => (
            <div key={donation.donationId} className="donation-card">
              <div className="donation-header">
                <div className="category-badge">
                  🏷️ {donation.category}
                </div>
                <div className="amount">
                  💰 ${donation.amount.toFixed(2)}
                </div>
              </div>

              <div className="donation-details">
                <div className="timestamp">
                  📅 {format(new Date(donation.timestamp), 'PPPpp')}
                </div>
                <div className="donation-id">
                  ID: #{donation.donationId}
                </div>
              </div>

              <div className="blockchain-section">
                <h4>Blockchain Verification</h4>
                {renderBlockchainStatus(donation.blockchainVerification)}
                
                {donation.blockchainTxnHash && (
                  <div className="transaction-hash">
                    <small>Transaction Hash:</small>
                    <code className="hash">
                      {donation.blockchainTxnHash.substring(0, 10)}...
                      {donation.blockchainTxnHash.substring(donation.blockchainTxnHash.length - 8)}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .donation-history-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .header h2 {
          margin: 0;
          color: #333;
        }

        .stats {
          display: flex;
          gap: 20px;
        }

        .stats span {
          background: #f8f9fa;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
        }

        .donations-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .donation-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .donation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .donation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .category-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .amount {
          font-size: 24px;
          font-weight: bold;
          color: #2e7d32;
        }

        .donation-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          color: #666;
          font-size: 14px;
        }

        .blockchain-section {
          border-top: 1px solid #f0f0f0;
          padding-top: 15px;
        }

        .blockchain-section h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 16px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          margin-right: 10px;
        }

        .status-badge.success {
          background: #e8f5e8;
          color: #2e7d32;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .explorer-link {
          color: #1976d2;
          text-decoration: none;
          font-size: 12px;
          padding: 4px 8px;
          border: 1px solid #1976d2;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .explorer-link:hover {
          background-color: #1976d2;
          color: white;
        }

        .verify-btn {
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .verify-btn:hover {
          background: #e0e0e0;
        }

        .transaction-hash {
          margin-top: 10px;
          font-size: 12px;
          color: #666;
        }

        .hash {
          background: #f8f9fa;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .pending-info {
          font-size: 12px;
          color: #666;
          margin-left: 10px;
        }

        .loading-container, .error-container, .empty-state {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .retry-btn, .donate-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .retry-btn:hover, .donate-btn:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default DonationHistoryExample;

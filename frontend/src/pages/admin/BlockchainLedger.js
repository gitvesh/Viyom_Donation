import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { allocationAPI } from '../../services/api';

const BlockchainLedger = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalAllocations: 0,
    totalAmountAllocated: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    timeRange: ''
  });

  useEffect(() => {
    fetchLedgerData();
  }, []);

  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      const response = await allocationAPI.getLedger();
      // response should be { totalAllocations, totalAmountAllocated, allocations }
      setTransactions(response.allocations || []);
      setSummary({
        totalAllocations: response.totalAllocations || 0,
        totalAmountAllocated: response.totalAmountAllocated || 0
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching ledger:", err);
      setError("Failed to load blockchain ledger. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: '',
      timeRange: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-50 text-green-800';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-800';
      case 'FAILED':
        return 'bg-red-50 text-red-800 rounded-full';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Filter logic handled on client side for now as simple search
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = !filters.search || 
      (tx.allocationTxnHash && tx.allocationTxnHash.toLowerCase().includes(filters.search.toLowerCase())) ||
      (tx.allocationId && tx.allocationId.toString().includes(filters.search));
    
    const matchesStatus = !filters.status || tx.blockchainStatus === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blockchain Transactions Ledger</h1>
          <button 
            onClick={fetchLedgerData}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Transactions</p>
            <h3 className="text-3xl font-bold text-gray-900">{summary.totalAllocations}</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-600">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Allocated (Blockchain)</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{summary.totalAmountAllocated.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by hash or ID..."
              className="col-span-2 px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
            <select name="status" value={filters.status} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm">
              <option value="">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
            <button onClick={handleReset} className="bg-white text-gray-700 px-6 py-3 rounded-md font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap">Reset Filters</button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">All Blockchain Transactions</h2>
          
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Fetching real-time ledger from blockchain DB...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No transactions found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full border-collapse min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Allocation ID</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Amount</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Blockchain Tx Hash</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Timestamp</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.allocationId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 border-b border-gray-200 font-semibold text-gray-900 text-sm">#{transaction.allocationId}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-900 font-bold text-sm">₹{transaction.amount?.toLocaleString() || '0'}</td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      {transaction.allocationTxnHash ? (
                        <a 
                          href={`https://amoy.polygonscan.com/tx/${transaction.allocationTxnHash}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs break-all"
                        >
                          {transaction.allocationTxnHash}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Waiting for hash...</span>
                      )}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">
                      {formatDate(transaction.allocationDate)}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${getStatusColor(transaction.blockchainStatus)}`}>
                        {transaction.blockchainStatus || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlockchainLedger;

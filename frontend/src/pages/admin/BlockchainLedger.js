import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const BlockchainLedger = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    timeRange: ''
  });

  const transactions = [
    { id: 1, allocationId: 'ALLOC001', amount: 1500.00, txHash: 'Oxabc123def4567890abc123def4567890abc123def45678', timestamp: '2024-03-15 10:30:00', status: 'Confirmed' },
    { id: 2, allocationId: 'ALLOC002', amount: 500.00, txHash: 'Oxdef456ghi7890abc123def4567890abc123def4567890al', timestamp: '2024-03-15 11:00:00', status: 'Pending' },
    { id: 3, allocationId: 'ALLOC003', amount: 2300.50, txHash: 'Oxghi789jk00123def4567890abc123def4567890abc123def', timestamp: '2024-03-14 14:15:00', status: 'Confirmed' },
    { id: 4, allocationId: 'ALLOC004', amount: 120.75, txHash: 'Oxjkl012mno3456def4567890abc123def4567890abc123di', timestamp: '2024-03-14 09:00:00', status: 'Failed' },
    { id: 5, allocationId: 'ALLOC005', amount: 750.00, txHash: 'Oxmno345pqr6789def4567890abc123def4567890abc123', timestamp: '2024-03-13 16:45:00', status: 'Processing' },
    { id: 6, allocationId: 'ALLOC006', amount: 3000.00, txHash: 'Oxpqr678stu9012def4567890abc123ds', timestamp: '2024-03-13 10:00:00', status: 'Confirmed' },
    { id: 7, allocationId: 'ALLOC007', amount: 150.25, txHash: 'Oxstu901vwx2345def4567890abc123def4567890abc123d', timestamp: '2024-03-12 18:30:00', status: 'Pending' },
    { id: 8, allocationId: 'ALLOC008', amount: 980.00, txHash: '0xvwx234yz0123def4567890abc123def4567890abc123d', timestamp: '2024-03-11 11:40:00', status: 'Confirmed' }
  ];

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
      case 'Confirmed':
        return 'bg-green-50 text-green-800';
      case 'Pending':
      case 'Processing':
        return 'bg-gray-100 text-gray-700';
      case 'Failed':
        return 'bg-red-50 text-red-800 rounded-full';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Blockchain Transactions Ledger</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by transaction hash..."
              className="col-span-2 px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
            <select name="status" value={filters.status} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm">
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
            <select name="timeRange" value={filters.timeRange} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button onClick={handleReset} className="bg-white text-gray-700 px-6 py-3 rounded-md font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap">Reset Filters</button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">All Blockchain Transactions</h2>
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
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 border-b border-gray-200 font-semibold text-gray-900 text-sm">{transaction.allocationId}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">${transaction.amount.toFixed(2)}</td>
                  <td className="px-4 py-4 border-b border-gray-200">
                    <a href={`#${transaction.txHash}`} className="text-blue-600 hover:underline font-mono text-xs break-all">{transaction.txHash}</a>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{transaction.timestamp}</td>
                  <td className="px-4 py-4 border-b border-gray-200">
                    <span className={`px-3 py-1.5 text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlockchainLedger;

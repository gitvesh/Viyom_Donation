import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AllocationHistory = () => {
  const [filters, setFilters] = useState({
    pool: '',
    beneficiary: '',
    dateRange: ''
  });

  const allocations = [
    { id: 1, pool: 'Tech Education Fund', beneficiary: 'Innovate Minds NGO', amount: 15000, purpose: 'STEM Workshop for Youth', date: '2024-03-10', txHash: '0x1a2b3c4d...7e8f9a0b', status: 'Confirmed' },
    { id: 2, pool: 'Healthcare Support Fund', beneficiary: 'Wellness Alliance Clinic', amount: 25000, purpose: 'Medical Camp Supplies', date: '2024-03-05', txHash: '0x0a1b2c3d...6e7f8a9b', status: 'Confirmed' },
    { id: 3, pool: 'Community Development Fund', beneficiary: 'Urban Renewal Collective', amount: 10000, purpose: 'Community Garden Project', date: '2024-02-28', txHash: '0xabcdef12...abcdef12', status: 'Pending' },
    { id: 4, pool: 'Tech Education Fund', beneficiary: 'Innovate Minds NGO', amount: 7500, purpose: 'Coding Bootcamp Scholarships', date: '2024-02-20', txHash: '0x98765432...98765432', status: 'Confirmed' },
    { id: 5, pool: 'Healthcare Support Fund', beneficiary: 'Wellness Alliance Clinic', amount: 30000, purpose: 'Vaccination Drive', date: '2024-02-15', txHash: '0x654321fe...87654321', status: 'Confirmed' },
    { id: 6, pool: 'Tech Education Fund', beneficiary: 'Innovate Minds NGO', amount: 5000, purpose: 'Robotics Club Equipment', date: '2024-01-20', txHash: '0x1b2c3d4e...7f8a9b0c', status: 'Confirmed' },
    { id: 7, pool: 'Community Development Fund', beneficiary: 'Urban Renewal Collective', amount: 12000, purpose: 'Local Market Revitalization', date: '2024-01-18', txHash: '0x2a3b4c5d...8e9f0a1b', status: 'Confirmed' }
  ];

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
  };

  const handleClearFilters = () => {
    setFilters({
      pool: '',
      beneficiary: '',
      dateRange: ''
    });
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Allocation History</h1>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Filter Allocations</h2>
          <form onSubmit={handleApplyFilters} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Pool</label>
                <select name="pool" value={filters.pool} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm">
                  <option value="">Select Pool</option>
                  <option value="tech-education">Tech Education Fund</option>
                  <option value="healthcare">Healthcare Support Fund</option>
                  <option value="community">Community Development Fund</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Beneficiary</label>
                <select name="beneficiary" value={filters.beneficiary} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm">
                  <option value="">Select Beneficiary</option>
                  <option value="innovate-minds">Innovate Minds NGO</option>
                  <option value="wellness-alliance">Wellness Alliance Clinic</option>
                  <option value="urban-renewal">Urban Renewal Collective</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Date Range</label>
                <input
                  type="date"
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleChange}
                  className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">Apply Filters</button>
              <button type="button" onClick={handleClearFilters} className="bg-white text-gray-700 px-6 py-3 rounded-md font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors">Clear Filters</button>
            </div>
          </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Allocation Details</h2>
          <table className="w-full border-collapse min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Pool</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Beneficiary</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Amount</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Purpose</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Date</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Blockchain Tx Hash</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(allocation => (
                <tr key={allocation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{allocation.pool}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{allocation.beneficiary}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">${allocation.amount.toLocaleString()}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm max-w-[200px] truncate">{allocation.purpose}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{allocation.date}</td>
                  <td className="px-4 py-4 border-b border-gray-200">
                    <a href={`#${allocation.txHash}`} className="text-blue-600 hover:underline font-mono text-xs break-all">{allocation.txHash}</a>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      allocation.status === 'Confirmed' ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                    }`}>
                      {allocation.status}
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

export default AllocationHistory;

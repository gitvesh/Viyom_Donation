import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyDonations = () => {
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    sector: '',
    fromDate: '',
    toDate: ''
  });

  const donations = [
    { id: 1, amount: 150.00, sector: 'Education', date: '2023-10-26', status: 'Completed' },
    { id: 2, amount: 75.00, sector: 'Food', date: '2023-11-01', status: 'Allocated' },
    { id: 3, amount: 200.00, sector: 'Healthcare', date: '2023-11-15', status: 'Pending' },
    { id: 4, amount: 50.00, sector: 'Environment', date: '2023-12-03', status: 'Completed' },
    { id: 5, amount: 100.00, sector: 'Education', date: '2024-01-10', status: 'Allocated' },
    { id: 6, amount: 300.00, sector: 'Food', date: '2024-02-01', status: 'Pending' }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-800';
      case 'Allocated':
        return 'bg-blue-50 text-blue-800';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="flex-1 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">My Donations</h1>

        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Filter Donations</h2>
          <form onSubmit={handleApplyFilters} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="font-medium mb-2 text-gray-700 text-sm">Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  className="px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-2 text-gray-700 text-sm">Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className="px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-2 text-gray-700 text-sm">Sector</label>
                <select
                  name="sector"
                  value={filters.sector}
                  onChange={handleChange}
                  className="px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                >
                  <option value="">Select a sector</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Food">Food</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="font-medium mb-2 text-gray-700 text-sm">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleChange}
                  className="px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-2 text-gray-700 text-sm">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleChange}
                  className="px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6">Apply Filters</button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Donation History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Amount</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Sector</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Date</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Status</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600">${donation.amount.toFixed(2)}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600">{donation.sector}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600">{donation.date}</td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <Link to="/track-donation" className="text-blue-600 font-medium hover:underline">Track</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDonations;

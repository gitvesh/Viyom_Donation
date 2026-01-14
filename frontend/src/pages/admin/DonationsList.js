import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const DonationsList = () => {
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const donations = [
    { id: 1, donor: 'John Doe', amount: 1500.00, sector: 'Education', status: 'Completed', date: '2024-03-15' },
    { id: 2, donor: 'Jane Smith', amount: 500.00, sector: 'Healthcare', status: 'Pending', date: '2024-03-14' },
    { id: 3, donor: 'Community Fund', amount: 10000.00, sector: 'Poverty Alleviation', status: 'Completed', date: '2024-03-13' },
    { id: 4, donor: 'Tech Innovators', amount: 2500.00, sector: 'Environmental', status: 'Failed', date: '2024-03-12' },
    { id: 5, donor: 'Global Philanthropy', amount: 750.00, sector: 'Education', status: 'Pending', date: '2024-03-11' },
    { id: 6, donor: 'Local Business Inc.', amount: 300.00, sector: 'Healthcare', status: 'Refunded', date: '2024-03-10' },
    { id: 7, donor: 'Anonymous Donor', amount: 1200.00, sector: 'Education', status: 'Completed', date: '2024-03-09' }
  ];

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-800';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-800';
      case 'Failed':
      case 'Refunded':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Donations List</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">View and manage all donations received by the organization. Filter, search, and export data for analysis.</p>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search donations..."
              className="col-span-2 px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
            <select name="sector" value={filters.sector} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm">
              <option value="">Filter by Sector</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Environmental">Environmental</option>
            </select>
            <select name="status" value={filters.status} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm">
              <option value="">Filter by Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleChange}
              className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleChange}
              className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
            <button className="bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">📥 Export Data</button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">All Donations</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Donor Name</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Amount</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Sector</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Payment Status</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{donation.donor}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">${donation.amount.toFixed(2)}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{donation.sector}</td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{donation.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DonationsList;

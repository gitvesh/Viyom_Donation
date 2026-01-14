import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const recentDonations = [
    { donor: 'Global Philanthropy', amount: 50000, sector: 'Health', date: '2024-07-28', status: 'Confirmed' },
    { donor: 'Tech Innovations Fund', amount: 25000, sector: 'Education', date: '2024-07-27', status: 'Confirmed' },
    { donor: 'Green Earth Initiative', amount: 10000, sector: 'Environment', date: '2024-07-26', status: 'Confirmed' },
    { donor: 'Local Community Group', amount: 15000, sector: 'Community', date: '2024-07-25', status: 'Pending' },
    { donor: 'Charity Connect Foundation', amount: 30000, sector: 'Health', date: '2024-07-24', status: 'Confirmed' }
  ];

  const recentAllocations = [
    { pool: 'Health Crisis Fund', beneficiary: 'City Hospital', amount: 20000, date: '2024-07-28', status: 'Confirmed' },
    { pool: 'Education Access Fund', beneficiary: 'Bright Future School', amount: 12000, date: '2024-07-27', status: 'Confirmed' },
    { pool: 'Environmental Cleanup', beneficiary: 'River Guardians', amount: 5000, date: '2024-07-26', status: 'Pending' },
    { pool: 'Community Outreach', beneficiary: 'Family Support Center', amount: 8000, date: '2024-07-25', status: 'Confirmed' },
    { pool: 'Health Research Fund', beneficiary: 'Medical Research Inst.', amount: 15000, date: '2024-07-24', status: 'Confirmed' }
  ];

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Home Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Total Donations</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$2,845,980</div>
            <div className="text-sm text-green-600">Up 12% from last month</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Total Allocated</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$1,920,500</div>
            <div className="text-sm text-green-600">Up 8% from last month</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$925,480</div>
            <div className="text-sm text-gray-600">Stable</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Donations by Sector</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700">Education</div>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-orange-500 rounded" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700">Health</div>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-orange-500 rounded" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700">Environment</div>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-orange-500 rounded" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700">Community</div>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-orange-500 rounded" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Allocations by Sector</h3>
            <div className="flex items-center gap-8">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-red-500 via-green-500 via-yellow-500 to-teal-500 p-2 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-700">Education</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-700">Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-700">Environment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-teal-500 rounded"></div>
                  <span className="text-sm text-gray-700">Community</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Donations</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Donor</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Amount</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Sector</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Date</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDonations.map((donation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">{donation.donor}</td>
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">${donation.amount.toLocaleString()}</td>
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">{donation.sector}</td>
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">{donation.date}</td>
                      <td className="px-3 py-3 border-b border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'Confirmed' ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Allocations</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Pool</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Beneficiary</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Amount</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Date</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAllocations.map((allocation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">{allocation.pool}</td>
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">{allocation.beneficiary}</td>
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">${allocation.amount.toLocaleString()}</td>
                      <td className="px-3 py-3 border-b border-gray-200 text-gray-600 text-xs">{allocation.date}</td>
                      <td className="px-3 py-3 border-b border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

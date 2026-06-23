import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { donationAPI, allocationAPI, poolAPI, beneficiaryAPI, sectorAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAllocated: 0,
    availableBalance: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentAllocations, setRecentAllocations] = useState([]);
  const [donationsBySector, setDonationsBySector] = useState([]);
  const [allocationsBySector, setAllocationsBySector] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [donations, allocations, pools, beneficiaries, sectors] = await Promise.all([
        donationAPI.getAllDonations(),
        allocationAPI.getHistory(0, 100),
        poolAPI.getAll(0, 100),
        beneficiaryAPI.getAll(0, 100),
        sectorAPI.getAll(0, 100)
      ]);

      // Calculate stats
      const poolsList = pools.content || pools || [];
      const totalCollected = poolsList.reduce((sum, p) => sum + (p.totalCollectedAmount || 0), 0);
      const totalAllocated = poolsList.reduce((sum, p) => sum + (p.totalAllocatedAmount || 0), 0);
      const availableBalance = poolsList.reduce((sum, p) => sum + (p.availableBalance || 0), 0);

      setStats({
        totalDonations: totalCollected,
        totalAllocated: totalAllocated,
        availableBalance: availableBalance
      });

      // Recent donations (last 5)
      const donationsList = donations || [];
      setRecentDonations(donationsList.slice(0, 5));

      // Recent allocations (last 5)
      const allocationsList = allocations.content || allocations || [];
      setRecentAllocations(allocationsList.slice(0, 5));

      // Donations by sector
      const sectorsList = sectors.content || sectors || [];
      const sectorDonations = sectorsList.map(sector => {
        const sectorPools = poolsList.filter(p => p.sectorId === sector.sectorId);
        const total = sectorPools.reduce((sum, p) => sum + (p.totalCollectedAmount || 0), 0);
        return {
          name: sector.name,
          amount: total
        };
      }).filter(s => s.amount > 0);

      const maxDonation = Math.max(...sectorDonations.map(s => s.amount), 1);
      setDonationsBySector(sectorDonations.map(s => ({
        ...s,
        percentage: (s.amount / maxDonation) * 100
      })));

      // Allocations by sector
      const sectorAllocations = sectorsList.map(sector => {
        const sectorPools = poolsList.filter(p => p.sectorId === sector.sectorId);
        const total = sectorPools.reduce((sum, p) => sum + (p.totalAllocatedAmount || 0), 0);
        return {
          name: sector.name,
          amount: total
        };
      }).filter(s => s.amount > 0);

      const totalAlloc = sectorAllocations.reduce((sum, s) => sum + s.amount, 0);
      setAllocationsBySector(sectorAllocations.map(s => ({
        ...s,
        percentage: totalAlloc > 0 ? (s.amount / totalAlloc) * 100 : 0
      })));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getSectorColor = (index) => {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    return colors[index % colors.length];
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Good morning, Admin!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your donations today</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₹{stats.totalDonations.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Donations</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₹{stats.totalAllocated.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Allocated</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₹{stats.availableBalance.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Available Balance</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{recentDonations.length}</div>
                <div className="text-sm text-gray-500">Recent Donations</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Donations by Sector */}
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Donations by Sector</h3>
                    <p className="text-sm text-gray-500 mt-1">Total collected across all sectors</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{stats.totalDonations.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Total Amount</div>
                  </div>
                </div>
                {donationsBySector.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No donations yet</p>
                    <p className="text-gray-400 text-xs mt-1">Start receiving donations to see analytics</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {donationsBySector.map((sector, index) => (
                      <div key={index} className="animate-slide-up group" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900">{sector.name}</span>
                              <div className="text-xs text-gray-500">{sector.percentage.toFixed(0)}% of total</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">₹{sector.amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: `${sector.percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Allocations by Sector */}
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.6s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Allocations by Sector</h3>
                    <p className="text-sm text-gray-500 mt-1">Fund distribution overview</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{stats.totalAllocated.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Allocated</div>
                  </div>
                </div>
                {allocationsBySector.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No allocations yet</p>
                    <p className="text-gray-400 text-xs mt-1">Allocate funds to see distribution</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-8 animate-slide-up" style={{animationDelay: '0.7s'}}>
                    {/* Donut Chart */}
                    <div className="relative">
                      <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
                        {/* Background circle */}
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="60" 
                          fill="none" 
                          stroke="#f3f4f6" 
                          strokeWidth="24"
                        />
                        {/* Gradient circle */}
                        {allocationsBySector.map((sector, index) => {
                          const totalPercentage = allocationsBySector.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                          const circumference = 2 * Math.PI * 60;
                          const offset = (totalPercentage / 100) * circumference;
                          const dashArray = `${(sector.percentage / 100) * circumference} ${circumference}`;
                          
                          const colors = [
                            ['#ef4444', '#dc2626'],
                            ['#10b981', '#059669'],
                            ['#eab308', '#ca8a04'],
                            ['#14b8a6', '#0d9488'],
                            ['#3b82f6', '#2563eb'],
                            ['#a855f7', '#9333ea']
                          ];
                          const [startColor, endColor] = colors[index % colors.length];
                          
                          return (
                            <circle
                              key={index}
                              cx="80"
                              cy="80"
                              r="60"
                              fill="none"
                              stroke={`url(#gradient-${index})`}
                              strokeWidth="24"
                              strokeDasharray={dashArray}
                              strokeDashoffset={-offset}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            >
                              <defs>
                                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor={startColor} />
                                  <stop offset="100%" stopColor={endColor} />
                                </linearGradient>
                              </defs>
                            </circle>
                          );
                        })}
                      </svg>
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{allocationsBySector.length}</div>
                          <div className="text-xs text-gray-500 font-medium">Sectors</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-3 flex-1">
                      {allocationsBySector.map((sector, index) => {
                        const colors = [
                          'bg-red-500',
                          'bg-green-500',
                          'bg-yellow-500',
                          'bg-teal-500',
                          'bg-blue-500',
                          'bg-purple-500'
                        ];
                        return (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors animate-slide-up group" 
                            style={{animationDelay: `${0.8 + index * 0.1}s`}}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 ${colors[index % colors.length]} rounded-full shadow-sm group-hover:scale-110 transition-transform`}></div>
                              <div>
                                <span className="text-sm font-semibold text-gray-900 block">{sector.name}</span>
                                <span className="text-xs text-gray-500">{sector.percentage.toFixed(1)}%</span>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-900">₹{sector.amount.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.7s'}}>
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
                </div>
                {recentDonations.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No donations yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentDonations.map((donation, index) => (
                          <tr key={donation.donationId} className="hover:bg-gray-50 transition-colors animate-slide-up" style={{animationDelay: `${0.8 + index * 0.05}s`}}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {donation.anonymous ? 'A' : 'D'}
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-900">
                                  {donation.anonymous ? 'Anonymous' : 'Donor'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ₹{donation.amount?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {donation.sectorName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                donation.status === 'SUCCESS' || donation.status === 'COMPLETED' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {donation.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Allocations */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.8s'}}>
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Allocations</h3>
                </div>
                {recentAllocations.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No allocations yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentAllocations.map((allocation, index) => (
                          <tr key={allocation.fundAllocationId} className="hover:bg-gray-50 transition-colors animate-slide-up" style={{animationDelay: `${0.8 + index * 0.05}s`}}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {allocation.beneficiary?.charAt(0) || 'B'}
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-900">
                                  {allocation.beneficiary || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ₹{allocation.amount?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {allocation.poolCode || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {allocation.allocationTxnHash ? (
                                <a 
                                  href={`https://amoy.polygonscan.com/tx/${allocation.allocationTxnHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                >
                                  Verified
                                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

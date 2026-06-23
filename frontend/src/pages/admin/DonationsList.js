import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { donationAPI, sectorAPI } from '../../services/api';

const DonationsList = () => {
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const [donations, setDonations] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [donationsData, sectorsData] = await Promise.all([
        donationAPI.getAllDonations(),
        sectorAPI.getAll(0, 100)
      ]);
      
      setDonations(donationsData || []);
      setSectors(sectorsData.content || sectorsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load donations');
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

  const handleApplyFilters = () => {
    // Filter donations based on current filters
    // This is client-side filtering for now
    fetchData();
  };

  const handleExport = () => {
    // Export filtered donations to CSV
    const csv = [
      ['Donation ID', 'Donor', 'Amount', 'Sector', 'Status', 'Date', 'Blockchain Hash'],
      ...filteredDonations.map(d => [
        d.donationId,
        d.anonymous ? 'Anonymous' : 'Donor',
        d.amount,
        d.sectorName,
        d.status,
        formatDate(d.donatedAt),
        d.blockchainTxnHash
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-green-50 text-green-800';
      case 'PENDING':
      case 'CREATED':
        return 'bg-yellow-50 text-yellow-800';
      case 'FAILED':
      case 'REFUNDED':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  // Filter donations based on current filters
  const filteredDonations = donations.filter(donation => {
    const searchTerm = filters.search.toLowerCase();
    if (filters.search && !(
      donation.razorpayOrderId?.toLowerCase().includes(searchTerm) ||
      donation.donorName?.toLowerCase().includes(searchTerm) ||
      donation.donorEmail?.toLowerCase().includes(searchTerm) ||
      donation.blockchainTxnHash?.toLowerCase().includes(searchTerm)
    )) {
      return false;
    }
    if (filters.sector && donation.sectorId !== parseInt(filters.sector)) {
      return false;
    }
    if (filters.status && donation.status?.toUpperCase() !== filters.status.toUpperCase()) {
      return false;
    }
    if (filters.fromDate && new Date(donation.donatedAt) < new Date(filters.fromDate)) {
      return false;
    }
    if (filters.toDate && new Date(donation.donatedAt) > new Date(filters.toDate)) {
      return false;
    }
    return true;
  });

  const totalAmount = filteredDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <AdminLayout>
      <div className="bg-gray-50">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Donations List</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">View and manage all donations received by the organization. Filter, search, and export data for analysis.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">{filteredDonations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Successful</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredDonations.filter(d => d.status?.toUpperCase() === 'COMPLETED' || d.status?.toUpperCase() === 'SUCCESS').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by Order ID, Donor, Email, or Txn Hash..."
              className="col-span-2 px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
            <select name="sector" value={filters.sector} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm bg-white">
              <option value="">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector.sectorId} value={sector.sectorId}>{sector.name}</option>
              ))}
            </select>
            <select name="status" value={filters.status} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm bg-white">
              <option value="">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleChange}
              placeholder="From Date"
              className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleChange}
              placeholder="To Date"
              className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleApplyFilters}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button 
              onClick={handleExport}
              className="bg-green-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-green-700 transition-colors"
              disabled={filteredDonations.length === 0}
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Donations ({filteredDonations.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading donations...</p>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No donations found. {filters.search || filters.sector || filters.status ? 'Try adjusting your filters.' : 'Donations will appear here once received.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Donation ID</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Donor</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Amount</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Sector</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Pool</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Status</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Date</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Blockchain</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map(donation => (
                    <tr key={donation.donationId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm font-mono">
                        #{donation.donationId}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        {donation.anonymous ? (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                            Anonymous
                          </span>
                        ) : 'Donor'}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        ₹{donation.amount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        {donation.sectorName || 'N/A'}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        {donation.poolName || 'N/A'}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {donation.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        {formatDate(donation.donatedAt)}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        {donation.blockchainTxnHash ? (
                          <a 
                            href={`https://amoy.polygonscan.com/tx/${donation.blockchainTxnHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs"
                            title={donation.blockchainTxnHash}
                          >
                            {donation.blockchainTxnHash.substring(0, 10)}...
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Pending</span>
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
    </AdminLayout>
  );
};

export default DonationsList;

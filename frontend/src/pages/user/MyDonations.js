import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { donationAPI } from '../../services/api';

const MyDonations = () => {
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    sector: '',
    fromDate: '',
    toDate: ''
  });
  
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const cardsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch donations on component mount
  useEffect(() => {
    fetchDonations();
  }, []);

  // Extract unique sectors from donations
  useEffect(() => {
    if (donations.length > 0) {
      const uniqueSectors = [...new Set(donations.map(d => d.sectorName))].sort();
      setSectors(uniqueSectors);
    }
  }, [donations]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await donationAPI.getMyDonations();
      console.log('Fetched donations:', data);
      console.log('First donation:', data[0]);
      setDonations(data);
      setFilteredDonations(data);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to load donations. Please try again later.');
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

  const handleApplyFilters = (e) => {
    e.preventDefault();
    
    let filtered = [...donations];
    
    // Filter by amount range
    if (filters.minAmount) {
      filtered = filtered.filter(d => parseFloat(d.amount) >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(d => parseFloat(d.amount) <= parseFloat(filters.maxAmount));
    }
    
    // Filter by sector
    if (filters.sector) {
      filtered = filtered.filter(d => d.sectorName === filters.sector);
    }
    
    // Filter by date range
    if (filters.fromDate) {
      filtered = filtered.filter(d => new Date(d.donatedAt) >= new Date(filters.fromDate));
    }
    if (filters.toDate) {
      filtered = filtered.filter(d => new Date(d.donatedAt) <= new Date(filters.toDate));
    }
    
    setFilteredDonations(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'COMPLETED':
        return 'bg-green-50 text-green-800';
      case 'ALLOCATED':
        return 'bg-blue-50 text-blue-800';
      case 'PENDING':
      case 'CREATED':
        return 'bg-yellow-50 text-yellow-800';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'Completed';
      case 'CREATED':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-4 animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full border border-blue-200/50 backdrop-blur-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-blue-700 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your Giving Journey
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <span className="block text-gray-900 mb-2">My</span>
              <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                Donations
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Track your impact and manage all your contributions
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16 space-y-8">
        {/* Filters Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-3xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Filter Donations</h2>
          </div>
          
          <form onSubmit={handleApplyFilters} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleChange}
                  placeholder="₹ 50"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleChange}
                  placeholder="₹ 5,000"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Sector</label>
                <select
                  name="sector"
                  value={filters.sector}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="">All Sectors</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div className="flex items-end">
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-[1.02]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Donations List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-green-100 rounded-3xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Donation History</h2>
              </div>
              {filteredDonations.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 text-sm font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {filteredDonations.length} {filteredDonations.length === 1 ? 'donation' : 'donations'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-600 font-semibold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Loading your donations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24 px-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-bold text-lg mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
              <button 
                onClick={fetchDonations}
                className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:scale-105"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Try Again
              </button>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-24 px-4">
              <div className="w-24 h-24 bg-blue-50 rounded-[3rem] flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-900 font-bold text-xl mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>No donations found</p>
              <p className="text-gray-500 mb-8 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                {donations.length === 0 
                  ? "Start making a difference today with your first donation" 
                  : "Try adjusting your filters to see more results"}
              </p>
              {donations.length === 0 && (
                <Link 
                  to="/donate" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Make Your First Donation
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Sector</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Pool</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Blockchain Proof</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDonations.map((donation, index) => (
                      <tr key={donation.donationId} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-5 text-sm">
                          {donation.razorpayOrderId ? (
                            <span className="font-mono text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg group-hover:bg-white transition-colors" style={{ fontFamily: "'Courier New', monospace" }}>
                              {donation.razorpayOrderId.length > 20 
                                ? `${donation.razorpayOrderId.substring(0, 20)}...`
                                : donation.razorpayOrderId}
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                            ₹{parseFloat(donation.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-gray-700 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {donation.sectorName || <span className="text-gray-400">N/A</span>}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {donation.poolName || <span className="text-gray-400">N/A</span>}
                        </td>
                        <td className="px-6 py-5 text-gray-600 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{formatDate(donation.donatedAt)}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(donation.status)}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {getStatusLabel(donation.status)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {donation.blockchainTxnHash ? (
                            <div className="flex flex-col gap-1.5">
                              <a 
                                href={`https://amoy.polygonscan.com/tx/${donation.blockchainTxnHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors w-fit"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                Proof
                              </a>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${
                                donation.blockchainStatus === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                                donation.blockchainStatus === 'REVERTED' || donation.blockchainStatus === 'FAILED' ? 'bg-red-100 text-red-700' : 
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {donation.blockchainStatus || 'CONFIRMED'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Not recorded yet</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <Link 
                            to="/track-donation" 
                            state={{ donationId: donation.donationId, orderId: donation.razorpayOrderId }}
                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Track
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredDonations.map((donation, index) => (
                  <div 
                    key={donation.donationId} 
                    className="p-6 hover:bg-blue-50/50 transition-all animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          ₹{parseFloat(donation.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{formatDate(donation.donatedAt)}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(donation.status)}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {getStatusLabel(donation.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Sector</p>
                          <p className="text-gray-900 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>{donation.sectorName || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Pool</p>
                          <p className="text-gray-700 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{donation.poolName || 'N/A'}</p>
                        </div>
                      </div>
                      {donation.razorpayOrderId && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Order ID</p>
                            <p className="text-gray-600 font-mono text-xs bg-gray-100 px-2 py-1 rounded truncate" style={{ fontFamily: "'Courier New', monospace" }}>
                              {donation.razorpayOrderId}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {donation.blockchainTxnHash && (
                        <div className="flex items-start gap-3 mt-3">
                          <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Blockchain Proof</p>
                            <a 
                              href={`https://amoy.polygonscan.com/tx/${donation.blockchainTxnHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-semibold text-xs hover:underline truncate block" style={{ fontFamily: "'Courier New', monospace" }}>
                              {donation.blockchainTxnHash}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to="/track-donation" 
                      state={{ donationId: donation.donationId, orderId: donation.razorpayOrderId }}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Track Donation
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;

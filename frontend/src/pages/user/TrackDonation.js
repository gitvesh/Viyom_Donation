import { useState, useEffect } from 'react';
import { donationAPI, poolAPI } from '../../services/api';

const TrackDonation = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [poolInfo, setPoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalAllocated: 0,
    remainingBalance: 0,
    utilizationPercentage: 0
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    if (selectedDonation) {
      fetchPoolInfo(selectedDonation.poolId);
    }
  }, [selectedDonation]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await donationAPI.getMyDonations();
      const donationsList = data || [];
      setDonations(donationsList);
      
      // Select the first donation by default
      if (donationsList.length > 0) {
        setSelectedDonation(donationsList[0]);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoolInfo = async (poolId) => {
    try {
      const pool = await poolAPI.getById(poolId);
      setPoolInfo(pool);
      
      // Calculate stats
      const totalCollected = pool.totalCollectedAmount || 0;
      const totalAllocated = pool.totalAllocatedAmount || 0;
      const remaining = pool.availableBalance || 0;
      const utilization = totalCollected > 0 ? (totalAllocated / totalCollected) * 100 : 0;
      
      setStats({
        totalDonated: totalCollected,
        totalAllocated: totalAllocated,
        remainingBalance: remaining,
        utilizationPercentage: utilization
      });
    } catch (err) {
      console.error('Error fetching pool info:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden">
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center animate-slideUp">
              <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-600 font-semibold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Loading your donations...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="flex-1 overflow-hidden">
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center space-y-4 animate-slideUp mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full border border-blue-200/50 backdrop-blur-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm font-semibold text-blue-700 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Track Your Impact
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <span className="block text-gray-900 mb-2">Track Your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  Donation
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                Follow the journey of your contribution from origin to impact
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-16 text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-24 h-24 bg-blue-50 rounded-[3rem] flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-900 font-bold text-xl mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>No donations to track yet</p>
              <p className="text-gray-500 mb-8 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Make your first donation to start tracking its impact</p>
              <a 
                href="/donate"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Make a Donation
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-4 animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full border border-blue-200/50 backdrop-blur-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-sm font-semibold text-blue-700 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                Track Your Impact
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <span className="block text-gray-900 mb-2">Track Your</span>
              <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                Donation
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Follow the journey of your contribution from origin to impact
            </p>
          </div>
        </div>
      </section>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Donation Selector */}
        {donations.length > 1 && (
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Select a donation to track:</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all text-gray-900 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
              value={selectedDonation?.donationId || ''}
              onChange={(e) => {
                const donation = donations.find(d => d.donationId === parseInt(e.target.value));
                setSelectedDonation(donation);
              }}
            >
              {donations.map(donation => (
                <option key={donation.donationId} value={donation.donationId}>
                  ₹{donation.amount?.toLocaleString()} - {donation.sectorName} - {formatDate(donation.donationDate)}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedDonation && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                {/* Donation Summary */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-3xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Donation Summary</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Your Donation:</span>
                      <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>₹{selectedDonation.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Pool Total:</span>
                      <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>₹{stats.totalDonated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Allocated:</span>
                      <span className="text-lg font-bold text-orange-600" style={{ fontFamily: "'Inter', sans-serif" }}>₹{stats.totalAllocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Remaining:</span>
                      <span className="text-lg font-bold text-blue-600" style={{ fontFamily: "'Inter', sans-serif" }}>₹{stats.remainingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Pool Utilization */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-3xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Pool Utilization</h3>
                  </div>
                  <div className="text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {stats.utilizationPercentage.toFixed(1)}%
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(stats.utilizationPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {stats.remainingBalance > 0 
                      ? `₹${stats.remainingBalance.toLocaleString()} available for allocation`
                      : 'Fully allocated'}
                  </p>
                </div>

                {/* Blockchain Badge */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Blockchain Verified</h4>
                      <p className="text-sm text-blue-700" style={{ fontFamily: "'Inter', sans-serif" }}>Your donation is recorded on the blockchain for complete transparency and immutability.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-green-100 rounded-3xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Pool Information</h3>
                  </div>
                  
                  {poolInfo ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Pool Code</div>
                            <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>{poolInfo.poolCode}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Sector</div>
                            <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>{selectedDonation.sectorName}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Created Date</div>
                            <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>{formatDate(poolInfo.createdAt)}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Status</div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          About This Pool
                        </h4>
                        <p className="text-sm text-blue-800 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                          This pool collects donations for {selectedDonation.sectorName} sector initiatives. 
                          Funds are allocated to verified beneficiaries based on need and impact assessment. 
                          All transactions are recorded on the blockchain for complete transparency.
                        </p>
                      </div>

                      {selectedDonation.blockchainTxnHash && (
                        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Blockchain Transaction
                          </h4>
                          <div className="text-sm text-purple-800 break-all bg-white/50 p-3 rounded-lg" style={{ fontFamily: "'Courier New', monospace" }}>
                            <span className="font-medium">Tx Hash: </span>
                            <a 
                              href={`https://amoy.polygonscan.com/tx/${selectedDonation.blockchainTxnHash}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedDonation.blockchainTxnHash}
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Allocation details will be available once funds are distributed to beneficiaries
                        </p>
                        <a 
                          href="/my-donations"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          View All Donations
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Loading pool information...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackDonation;

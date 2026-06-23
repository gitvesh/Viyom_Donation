import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { poolAPI, sectorAPI } from '../../services/api';

const DonationPools = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
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
      
      const [poolsData, sectorsData] = await Promise.all([
        poolAPI.getAll(0, 100),
        sectorAPI.getAll(0, 100)
      ]);
      
      setPools(poolsData.content || poolsData || []);
      setSectors(sectorsData.content || sectorsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load donation pools');
    } finally {
      setLoading(false);
    }
  };

  const getSectorName = (sectorId) => {
    const sector = sectors.find(s => s.sectorId === sectorId);
    return sector ? sector.name : 'Unknown Sector';
  };

  const groupPoolsBySector = () => {
    const grouped = {};
    
    pools.forEach(pool => {
      // Use poolId and sectorId from backend (not id)
      const sectorName = getSectorName(pool.sectorId);
      if (!grouped[sectorName]) {
        grouped[sectorName] = [];
      }
      grouped[sectorName].push(pool);
    });
    
    return grouped;
  };

  const poolsBySector = groupPoolsBySector();

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Donation Pools</h1>
          <p className="text-gray-500 mt-1">Overview of all active donation pools with financial metrics</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 animate-slide-up">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {!loading && pools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Pools</p>
                  <p className="text-3xl font-bold text-gray-900">{pools.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Collected</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{pools.reduce((sum, p) => sum + (p.totalCollectedAmount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Allocated</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{pools.reduce((sum, p) => sum + (p.totalAllocatedAmount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{pools.reduce((sum, p) => sum + (p.availableBalance || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading donation pools...</p>
          </div>
        ) : pools.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-2">No donation pools found</p>
            <p className="text-sm text-gray-400">Pools will be created automatically when donations are received</p>
          </div>
        ) : (
          Object.entries(poolsBySector).map(([sector, sectorPools], sectorIndex) => (
            <div key={sector} className="mb-10 animate-slide-up" style={{animationDelay: `${0.5 + sectorIndex * 0.1}s`}}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{sector}</h2>
                  <p className="text-sm text-gray-500">{sectorPools.length} {sectorPools.length === 1 ? 'pool' : 'pools'} available</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectorPools.map((pool, poolIndex) => (
                  <div 
                    key={pool.poolId} 
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-slide-up group overflow-hidden"
                    style={{animationDelay: `${0.6 + sectorIndex * 0.1 + poolIndex * 0.05}s`}}
                  >
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                              #{pool.poolId}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {pool.poolCode}
                        </h3>
                        <div className="flex items-center gap-2 text-blue-100 text-xs">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {sector} Sector
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Financial Metrics */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 group-hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Collected</p>
                              <p className="text-xl font-bold text-green-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                ₹{pool.totalCollectedAmount?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 group-hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Allocated</p>
                              <p className="text-xl font-bold text-orange-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                ₹{pool.totalAllocatedAmount?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 group-hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Available</p>
                              <p className="text-xl font-bold text-blue-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                ₹{pool.availableBalance?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-3">
                          <span>Allocation Progress</span>
                          <span className="text-blue-600">
                            {pool.totalCollectedAmount > 0 
                              ? Math.round((pool.totalAllocatedAmount / pool.totalCollectedAmount) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ 
                              width: `${pool.totalCollectedAmount > 0 
                                ? Math.min((pool.totalAllocatedAmount / pool.totalCollectedAmount) * 100, 100)
                                : 0}%` 
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => navigate('/admin/allocations')}
                          className="flex-1 bg-gray-100 text-gray-700 px-4 py-3.5 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 text-sm flex items-center justify-center gap-2 active:scale-95"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button 
                          onClick={() => navigate('/admin/allocate', { state: { poolId: pool.poolId, poolCode: pool.poolCode } })}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3.5 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 text-sm disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 active:scale-95"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                          disabled={pool.availableBalance <= 0}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Allocate
                        </button>
                      </div>
                      
                      {pool.availableBalance <= 0 && pool.totalCollectedAmount > 0 && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs text-amber-700 font-semibold">All funds have been allocated</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default DonationPools;

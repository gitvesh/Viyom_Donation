import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sectorAPI, poolAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DonationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    anonymous: false,
    fullName: '',
    email: '',
    phone: '',
    pan: '',
    selectedPool: null
  });

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [donateAsGuest, setDonateAsGuest] = useState(false);

  const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];

  // Check if user is logged in and pre-fill form
  useEffect(() => {
    if (user && !donateAsGuest) {
      setIsLoggedIn(true);
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        pan: user.pan || ''
      }));
    } else if (donateAsGuest) {
      // Clear form when donating as guest
      setFormData(prev => ({
        ...prev,
        fullName: '',
        email: '',
        phone: '',
        pan: ''
      }));
    }
  }, [user, donateAsGuest]);

  const handleGuestToggle = () => {
    setDonateAsGuest(!donateAsGuest);
  };

  // Fetch sectors and pools from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sectors
        const sectorsResponse = await sectorAPI.getAll(0, 100);
        const sectorsList = sectorsResponse.content || sectorsResponse || [];
        const activeSectors = sectorsList.filter(s => s.active);
        setSectors(activeSectors);
        
        // Fetch all pools
        const poolsResponse = await poolAPI.getAll(0, 100);
        const poolsList = poolsResponse.content || poolsResponse || [];
        const activePools = poolsList.filter(p => p.active);
        setPools(activePools);
        
        console.log('Fetched sectors:', activeSectors.length, activeSectors);
        console.log('Fetched pools:', activePools.length, activePools);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Icon and color mapping for sectors
  const getSectorConfig = (sectorName) => {
    const configs = {
      'Education': { icon: '📚', color: 'from-blue-500 to-blue-600' },
      'Healthcare': { icon: '🏥', color: 'from-red-500 to-red-600' },
      'Food & Nutrition': { icon: '🍽️', color: 'from-orange-500 to-orange-600' },
      'Food & Shelter': { icon: '🏠', color: 'from-orange-500 to-orange-600' },
      'Environment': { icon: '🌱', color: 'from-green-500 to-green-600' },
      'Poverty Alleviation': { icon: '🤝', color: 'from-purple-500 to-purple-600' },
      'Animal Welfare': { icon: '🐾', color: 'from-amber-500 to-amber-600' },
      'Disaster Relief': { icon: '🆘', color: 'from-rose-500 to-rose-600' },
      'Women Empowerment': { icon: '👩', color: 'from-pink-500 to-pink-600' }
    };
    return configs[sectorName] || { icon: '💝', color: 'from-blue-500 to-blue-600' };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePoolSelect = (pool) => {
    setFormData(prev => ({ ...prev, selectedPool: pool }));
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setFormData(prev => ({ ...prev, amount: amount.toString(), customAmount: '' }));
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, customAmount: value, amount: value }));
    setSelectedAmount(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.selectedPool) {
      alert('Please select a donation pool');
      return;
    }
    
    const donationData = {
      amount: formData.amount || formData.customAmount,
      poolId: formData.selectedPool.poolId,
      poolName: formData.selectedPool.poolName,
      sectorId: formData.selectedPool.sectorId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      pan: formData.pan,
      anonymous: formData.anonymous
    };
    
    localStorage.setItem('donationData', JSON.stringify(donationData));
    navigate('/payment-processing', { state: donationData });
  };

  const finalAmount = formData.amount || formData.customAmount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading donation options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-slideUp">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-600/30 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Inter', sans-serif" }}>
            Make a Difference Today
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Your contribution helps us create lasting impact. Every donation is tracked transparently on the blockchain.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pool Selection Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 animate-slideUp">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Select Donation Pool</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pools.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500">No active donation pools available at the moment.</p>
                      <p className="text-sm text-gray-400 mt-2">Please check back later or contact support.</p>
                    </div>
                  ) : (
                    pools.map((pool) => {
                      // Find the sector for this pool
                      const sector = sectors.find(s => s.sectorId === pool.sectorId);
                      const sectorConfig = getSectorConfig(sector?.name || 'General');
                      
                      return (
                        <button
                          key={pool.poolId}
                          type="button"
                          onClick={() => handlePoolSelect({
                            poolId: pool.poolId,
                            poolName: pool.poolName,
                            sectorId: pool.sectorId,
                            sectorName: sector?.name,
                            description: sector?.description || pool.poolName
                          })}
                          className={`relative p-6 rounded-3xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                            formData.selectedPool?.poolId === pool.poolId
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg shadow-blue-500/20'
                              : 'border-gray-200/60 bg-white/60 backdrop-blur-sm hover:border-gray-300 hover:shadow-lg hover:bg-white/80'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sectorConfig.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                              {sectorConfig.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 mb-1.5 text-lg group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                {sector?.name || pool.poolName}
                              </h3>
                              <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {sector?.description || pool.poolName}
                              </p>
                            </div>
                            {formData.selectedPool?.poolId === pool.poolId && (
                              <div className="absolute top-4 right-4">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {!formData.selectedPool && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-amber-800 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Please select a donation pool to continue
                    </p>
                  </div>
                )}
              </div>

              {/* Amount Selection Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Choose Amount</h2>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`relative py-4 px-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        selectedAmount === amount
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:scale-105 hover:shadow-md'
                      }`}
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Or enter custom amount
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'customAmount' ? 'scale-[1.02]' : ''}`}>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      name="customAmount"
                      value={formData.customAmount}
                      onChange={handleCustomAmount}
                      onFocus={() => setFocusedField('customAmount')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter amount"
                      className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Anonymous Donation Toggle */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Make this donation anonymous
                    </span>
                  </label>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Your Information</h2>
                  </div>

                  {/* Guest Donation Toggle - Only show if user is logged in */}
                  {isLoggedIn && (
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={donateAsGuest}
                          onChange={handleGuestToggle}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Donate as Guest
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {isLoggedIn && !donateAsGuest && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-blue-800 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Your details are pre-filled from your account
                    </p>
                  </div>
                )}

                {donateAsGuest && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-amber-800 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Donating on behalf of someone else - Fill in their details
                    </p>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Full Name */}
                  <div className={`transition-all duration-300 ${(!isLoggedIn || donateAsGuest) && focusedField === 'fullName' ? 'scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Full Name
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => (!isLoggedIn || donateAsGuest) && setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        required
                        readOnly={isLoggedIn && !donateAsGuest}
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 ${
                          isLoggedIn && !donateAsGuest
                            ? 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed' 
                            : 'border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      {isLoggedIn && !donateAsGuest && (
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`transition-all duration-300 ${(!isLoggedIn || donateAsGuest) && focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Email Address
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => (!isLoggedIn || donateAsGuest) && setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="john@example.com"
                        required
                        readOnly={isLoggedIn && !donateAsGuest}
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300 ${
                          isLoggedIn && !donateAsGuest
                            ? 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed' 
                            : 'border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      {isLoggedIn && !donateAsGuest && (
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className={`transition-all duration-300 ${focusedField === 'phone' ? 'scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* PAN */}
                  <div className={`transition-all duration-300 ${focusedField === 'pan' ? 'scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      PAN Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('pan')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="ABCDE1234F"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300 uppercase"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        maxLength={10}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Required for donations above ₹2,000 for tax benefits
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!finalAmount || finalAmount <= 0 || !formData.selectedPool}
                className="w-full relative py-5 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 overflow-hidden group animate-slideUp"
                style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.3s' }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center justify-center gap-3">
                  <span>Proceed to Secure Payment</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-600/30 p-6 text-white animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold mb-4 opacity-90" style={{ fontFamily: "'Inter', sans-serif" }}>Donation Summary</h3>
              <div className="space-y-3">
                {formData.selectedPool && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">{getSectorConfig(formData.selectedPool.sectorName).icon}</span>
                      <div>
                        <div className="text-xs opacity-75">Donating to</div>
                        <div className="font-bold">{formData.selectedPool.poolName}</div>
                        <div className="text-xs opacity-75">{formData.selectedPool.sectorName}</div>
                      </div>
                    </div>
                    <div className="h-px bg-white/20"></div>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Amount</span>
                  <span className="text-3xl font-bold">₹{finalAmount ? parseInt(finalAmount).toLocaleString() : '0'}</span>
                </div>
                <div className="h-px bg-white/20"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-90">Processing Fee</span>
                  <span className="font-semibold">₹0</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-90">Tax Benefit</span>
                  <span className="font-semibold">80G Eligible</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>100% Secure</h4>
                  <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Your donation is encrypted and secured with industry-standard SSL technology.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-semibold text-gray-700">🔒 SSL Encrypted</div>
                <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-semibold text-gray-700">⛓️ Blockchain</div>
              </div>
            </div>

            {/* Impact Info */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <h4 className="font-bold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Your Impact</h4>
              <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% of your donation goes to the cause</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track your donation in real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Receive tax deduction certificate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { allocationAPI, poolAPI, beneficiaryAPI } from '../../services/api';

const AllocateFunds = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    poolId: location.state?.poolId || '',
    beneficiaryId: '',
    amount: '',
    purpose: ''
  });
  
  const [pools, setPools] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.poolId && pools.length > 0) {
      const pool = pools.find(p => p.poolId === parseInt(formData.poolId));
      setSelectedPool(pool);
    }
  }, [formData.poolId, pools]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [poolsData, beneficiariesData] = await Promise.all([
        poolAPI.getAll(0, 100),
        beneficiaryAPI.getAll(0, 100)
      ]);
      
      // Handle different response structures
      let poolsList = [];
      let beneficiariesList = [];
      
      if (Array.isArray(poolsData)) {
        poolsList = poolsData;
      } else if (poolsData && poolsData.content) {
        poolsList = poolsData.content;
      } else if (poolsData && Array.isArray(poolsData.data)) {
        poolsList = poolsData.data;
      }
      
      if (Array.isArray(beneficiariesData)) {
        beneficiariesList = beneficiariesData;
      } else if (beneficiariesData && beneficiariesData.content) {
        beneficiariesList = beneficiariesData.content;
      } else if (beneficiariesData && Array.isArray(beneficiariesData.data)) {
        beneficiariesList = beneficiariesData.data;
      }
      
      // Show all active pools (not just those with balance)
      const activePools = poolsList.filter(p => p.active === true || p.active === 1);
      const activeBeneficiaries = beneficiariesList.filter(b => b.active === true || b.active === 1);
      
      setPools(activePools);
      setBeneficiaries(activeBeneficiaries);
      
      // Set selected pool if passed from navigation
      if (location.state?.poolId) {
        const pool = activePools.find(p => p.poolId === location.state.poolId);
        setSelectedPool(pool);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load data: ${err.message}. Please check if the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Update selected pool when pool changes
    if (name === 'poolId') {
      const pool = pools.find(p => p.poolId === parseInt(value));
      setSelectedPool(pool);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.poolId || !formData.beneficiaryId || !formData.amount || !formData.purpose) {
      setError('Please fill in all fields');
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    if (selectedPool && amount > selectedPool.availableBalance) {
      setError(`Amount exceeds available balance of ₹${selectedPool.availableBalance.toLocaleString()}`);
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const allocationData = {
        poolId: parseInt(formData.poolId),
        beneficiaryId: parseInt(formData.beneficiaryId),
        amount: amount,
        purpose: formData.purpose
      };
      
      await allocationAPI.allocate(allocationData);
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        poolId: '',
        beneficiaryId: '',
        amount: '',
        purpose: ''
      });
      setSelectedPool(null);
      
      // Show success message and redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/allocations');
      }, 2000);
      
    } catch (err) {
      console.error('Error allocating funds:', err);
      setError(err.message || 'Failed to allocate funds. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getBeneficiaryName = (id) => {
    const beneficiary = beneficiaries.find(b => b.beneficiaryId === parseInt(id));
    return beneficiary ? beneficiary.name : '';
  };

  const getPoolName = (id) => {
    const pool = pools.find(p => p.poolId === parseInt(id));
    return pool ? pool.poolCode : '';
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Allocate Funds</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Funds allocated successfully! Redirecting to allocation history...
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : pools.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-700 font-semibold mb-2">No Active Pools Found</p>
            <p className="text-sm text-gray-500 mb-6">Donation pools are created automatically when donations are received for each sector.</p>
            <button 
              onClick={() => navigate('/admin/pools')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Pools
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Allocation Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              Found {pools.length} active pool(s) and {beneficiaries.length} active beneficiary(ies)
            </p>
            
            {/* Info banner for pools with zero balance */}
            {pools.every(p => p.availableBalance <= 0) && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">All pools have zero available balance</p>
                    <p className="text-sm mt-1">Pools need to receive donations before funds can be allocated to beneficiaries.</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Select Pool *</label>
                <select 
                  name="poolId" 
                  value={formData.poolId} 
                  onChange={handleChange} 
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600 bg-white"
                  required
                >
                  <option value="">Choose a donation pool</option>
                  {pools.map(pool => (
                    <option 
                      key={pool.poolId} 
                      value={pool.poolId}
                      disabled={pool.availableBalance <= 0}
                    >
                      {pool.poolCode} - Available: ₹{pool.availableBalance?.toLocaleString() || '0'}
                      {pool.availableBalance <= 0 ? ' (No funds available)' : ''}
                    </option>
                  ))}
                </select>
                {selectedPool && (
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600">
                      <span className="font-medium">Total Collected:</span> ₹{selectedPool.totalCollectedAmount?.toLocaleString() || '0'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Already Allocated:</span> ₹{selectedPool.totalAllocatedAmount?.toLocaleString() || '0'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Available Balance:</span> 
                      <span className={selectedPool.availableBalance > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {' '}₹{selectedPool.availableBalance?.toLocaleString() || '0'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Select Beneficiary *</label>
                <select 
                  name="beneficiaryId" 
                  value={formData.beneficiaryId} 
                  onChange={handleChange} 
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600 bg-white"
                  required
                >
                  <option value="">Choose a beneficiary</option>
                  {beneficiaries.map(beneficiary => (
                    <option key={beneficiary.beneficiaryId} value={beneficiary.beneficiaryId}>
                      {beneficiary.name} ({beneficiary.beneficiaryType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Enter Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g., 5000.00"
                  step="0.01"
                  min="0.01"
                  max={selectedPool?.availableBalance || 999999999}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                  required
                />
                {selectedPool && formData.amount && parseFloat(formData.amount) > selectedPool.availableBalance && (
                  <p className="text-sm text-red-600">
                    Amount exceeds available balance of ₹{selectedPool.availableBalance.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Purpose *</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Briefly describe the purpose of this allocation (e.g., Medical equipment for community health center)"
                  rows="4"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600 resize-y min-h-[100px]"
                  required
                ></textarea>
              </div>

              {selectedPool && (
                <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Available balance in selected pool:</span>
                    <span className="font-bold text-blue-600 text-2xl">₹{selectedPool.availableBalance?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              )}

              {formData.poolId && formData.beneficiaryId && formData.amount && formData.purpose && (
                <details className="p-5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                  <summary className="font-semibold text-gray-900 py-2 cursor-pointer">Review Allocation Summary</summary>
                  <div className="mt-4 p-5 bg-white rounded-lg space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Pool:</span>
                      <span className="font-semibold text-gray-900">{getPoolName(formData.poolId)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Beneficiary:</span>
                      <span className="font-semibold text-gray-900">{getBeneficiaryName(formData.beneficiaryId)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-green-600 text-lg">₹{parseFloat(formData.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Purpose:</span>
                      <span className="font-medium text-gray-900 text-right max-w-md">{formData.purpose}</span>
                    </div>
                  </div>
                </details>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={submitting || !selectedPool || parseFloat(formData.amount) > (selectedPool?.availableBalance || 0)}
                >
                  {submitting ? 'Allocating...' : 'Submit Allocation'}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/admin/pools')}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllocateFunds;

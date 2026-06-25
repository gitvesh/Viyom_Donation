import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { allocationAPI, poolAPI, beneficiaryAPI } from '../../services/api';

const AllocationHistory = () => {
  const [filters, setFilters] = useState({
    pool: '',
    beneficiary: '',
    dateRange: ''
  });
  const [allocations, setAllocations] = useState([]);
  const [pools, setPools] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch allocations, pools, and beneficiaries in parallel
      const [allocationsData, poolsData, beneficiariesData] = await Promise.all([
        allocationAPI.getHistory(0, 100),
        poolAPI.getAll(0, 100),
        beneficiaryAPI.getAll(0, 100)
      ]);
      
      setAllocations(allocationsData.content || allocationsData || []);
      setPools(poolsData.content || poolsData || []);
      setBeneficiaries(beneficiariesData.content || beneficiariesData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load allocation history');
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

  const handleApplyFilters = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Apply filters based on selection
      if (filters.pool) {
        const data = await allocationAPI.getByPool(filters.pool);
        setAllocations(data.content || data || []);
      } else if (filters.beneficiary) {
        const data = await allocationAPI.getByBeneficiary(filters.beneficiary);
        setAllocations(data.content || data || []);
      } else {
        await fetchData();
      }
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      pool: '',
      beneficiary: '',
      dateRange: ''
    });
    fetchData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };


  return (
    <AdminLayout>
      <div className="bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Allocation History</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Filter Allocations</h2>
          <form onSubmit={handleApplyFilters} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Pool</label>
                <select 
                  name="pool" 
                  value={filters.pool} 
                  onChange={handleChange} 
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600 text-sm bg-white"
                >
                  <option value="">All Pools</option>
                  {pools.map(pool => (
                    <option key={pool.poolId} value={pool.poolId}>
                      {pool.poolCode} (₹{pool.availableBalance?.toLocaleString() || '0'} available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Beneficiary</label>
                <select 
                  name="beneficiary" 
                  value={filters.beneficiary} 
                  onChange={handleChange} 
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600 text-sm bg-white"
                >
                  <option value="">All Beneficiaries</option>
                  {beneficiaries.map(beneficiary => (
                    <option key={beneficiary.beneficiaryId} value={beneficiary.beneficiaryId}>{beneficiary.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Date Range</label>
                <input
                  type="date"
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Apply Filters'}
              </button>
              <button 
                type="button" 
                onClick={handleClearFilters} 
                className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                disabled={loading}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Allocation Details ({allocations.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading allocations...</p>
            </div>
          ) : allocations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No allocations found. Allocate funds to beneficiaries to see history here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Pool</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Beneficiary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Purpose</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Blockchain Tx Hash</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(allocation => (
                    <tr key={allocation.fundAllocationId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        {allocation.poolCode}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        {allocation.beneficiary}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        ₹{allocation.amount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-sm max-w-[200px]">
                        <div className="truncate" title={allocation.purpose}>
                          {allocation.purpose || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        {formatDate(allocation.allocationDate)}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {allocation.allocationTxnHash ? (
                          <a 
                            href={`https://amoy.polygonscan.com/tx/${allocation.allocationTxnHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs break-all"
                          >
                            {allocation.allocationTxnHash.substring(0, 20)}...
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          allocation.blockchainStatus === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700' 
                            : allocation.blockchainStatus === 'FAILED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {allocation.blockchainStatus === 'CONFIRMED' 
                            ? 'Confirmed' 
                            : allocation.blockchainStatus === 'FAILED' 
                              ? 'Failed' 
                              : 'Pending'}
                        </span>
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

export default AllocationHistory;

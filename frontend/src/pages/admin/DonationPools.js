import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const DonationPools = () => {
  const poolsBySector = {
    Education: [
      { name: "Children's Literacy Program", collected: 75000, allocated: 50000, balance: 25000 },
      { name: 'STEM Scholarship Fund', collected: 120000, allocated: 80000, balance: 40000 },
      { name: 'School Supplies Drive', collected: 30000, allocated: 28000, balance: 2000 }
    ],
    Healthcare: [
      { name: 'Community Health Clinic Support', collected: 90000, allocated: 65000, balance: 25000 },
      { name: 'Vaccination Program', collected: 55000, allocated: 50000, balance: 5000 }
    ],
    Environmental: [
      { name: 'Forest Restoration Project', collected: 150000, allocated: 100000, balance: 50000 }
    ]
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Donation Pools</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">Overview of all active donation pools, grouped by sector, with key financial metrics and quick actions.</p>

        {Object.entries(poolsBySector).map(([sector, pools]) => (
          <div key={sector} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">{sector} Sector Pools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pools.map((pool, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">{pool.name}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total Collected:</span>
                      <span className="text-base font-semibold text-gray-900">${pool.collected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total Allocated:</span>
                      <span className="text-base font-semibold text-gray-900">${pool.allocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Available Balance:</span>
                      <span className="text-base font-semibold text-gray-900">${pool.balance.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-gray-700 px-4 py-3 rounded-md font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors">View Allocations</button>
                    <button className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">Allocate Funds</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default DonationPools;

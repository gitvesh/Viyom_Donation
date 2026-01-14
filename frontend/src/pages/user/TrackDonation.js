import React from 'react';

const TrackDonation = () => {
  const allocations = [
    {
      id: 1,
      amount: 3000.00,
      beneficiary: 'Green Earth Foundation',
      purpose: 'Provide clean water to rural communities in drought-prone regions of Rajasthan.',
      date: '2023-10-26',
      txHash: '0x1a2b3c4d5e6f7a8b9c0dfe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f'
    },
    {
      id: 2,
      amount: 2000.00,
      beneficiary: 'Educate Tomorrow Initiative',
      purpose: 'Fund educational supplies and after-school programs for underprivileged children in urban slums.',
      date: '2023-11-15',
      txHash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f'
    }
  ];

  return (
    <div className="flex-1 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Track Your Donation</h1>
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">Follow the journey of your contribution, from its origin to its impact on beneficiaries. Transparency at every step.</p>

        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900">Donation Journey</h2>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[100px]">
              <div className="w-15 h-15 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-600">👤</div>
              <div className="text-sm font-medium text-gray-600">Donor</div>
            </div>
            <div className="text-2xl text-gray-400 flex-shrink-0">→</div>
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[100px]">
              <div className="w-15 h-15 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-600">📄</div>
              <div className="text-sm font-medium text-gray-600">Donation</div>
            </div>
            <div className="text-2xl text-gray-400 flex-shrink-0">→</div>
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[100px]">
              <div className="w-15 h-15 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-600">⚏</div>
              <div className="text-sm font-medium text-gray-600">Pool</div>
            </div>
            <div className="text-2xl text-gray-400 flex-shrink-0">→</div>
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[100px]">
              <div className="w-15 h-15 bg-blue-600 rounded-full flex items-center justify-center text-2xl text-white">📤</div>
              <div className="text-sm font-semibold text-blue-600">Allocations</div>
            </div>
            <div className="text-2xl text-gray-400 flex-shrink-0">→</div>
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[100px]">
              <div className="w-15 h-15 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-600">👥</div>
              <div className="text-sm font-medium text-gray-600">Beneficiaries</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Donation Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Donation Amount:</span>
                  <span className="text-xl font-bold text-gray-900">₹10,000.00</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-sm text-gray-600">Remaining Pool Balance:</span>
                  <span className="text-xl font-bold text-gray-900">₹2,500.00</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Donation Progress</h3>
              <div className="text-base font-medium mb-4 text-gray-700">Donation Utilization: 75% Utilized</div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-8 text-gray-900">Fund Allocations</h3>
              <div className="space-y-6">
                {allocations.map(allocation => (
                  <div key={allocation.id} className="p-8 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl font-bold text-gray-900">Amount: ₹{allocation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">View Impact</button>
                    </div>
                    <div className="space-y-3 text-gray-600 leading-relaxed">
                      <div><strong className="text-gray-700">Beneficiary:</strong> {allocation.beneficiary}</div>
                      <div><strong className="text-gray-700">Purpose:</strong> {allocation.purpose}</div>
                      <div><strong className="text-gray-700">Date:</strong> {allocation.date}</div>
                      <div className="break-all"><strong className="text-gray-700">Tx Hash:</strong> <span className="font-mono text-blue-600 text-sm">{allocation.txHash}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDonation;

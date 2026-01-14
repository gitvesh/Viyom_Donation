import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AllocateFunds = () => {
  const [formData, setFormData] = useState({
    pool: '',
    beneficiary: '',
    amount: '',
    purpose: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Allocate Funds</h1>

        <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900">Allocation Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Select Pool</label>
              <select name="pool" value={formData.pool} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600" required>
                <option value="">Choose a donation pool</option>
                <option value="tech-education">Tech Education Fund</option>
                <option value="healthcare">Healthcare Support Fund</option>
                <option value="community">Community Development Fund</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Select Beneficiary</label>
              <select name="beneficiary" value={formData.beneficiary} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600" required>
                <option value="">Choose a beneficiary</option>
                <option value="innovate-minds">Innovate Minds NGO</option>
                <option value="wellness-alliance">Wellness Alliance Clinic</option>
                <option value="urban-renewal">Urban Renewal Collective</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Enter Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 5000.00"
                step="0.01"
                className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Purpose</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Briefly describe the purpose of this allocation."
                rows="4"
                className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 resize-y min-h-[100px]"
                required
              ></textarea>
            </div>

            <div className="p-4 bg-blue-50 rounded-md text-sm text-gray-700">
              Available balance in selected pool: <span className="font-bold text-blue-600 text-lg">$0.00</span>
            </div>

            <details className="p-4 bg-gray-50 rounded-md cursor-pointer">
              <summary className="font-medium text-gray-700 py-2">Confirmation Summary</summary>
              <div className="mt-4 p-4 bg-white rounded-md">
                {/* Summary content would go here */}
              </div>
            </details>

            <button type="submit" className="bg-blue-400 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-500 transition-colors">Submit Allocation</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllocateFunds;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DonationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '100',
    anonymous: false,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    pan: 'ABCDE1234F'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment-processing');
  };

  return (
    <div className="flex-1 py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-8">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">Make a Secure Donation</h1>
        <p className="text-center text-gray-600 mb-8 text-lg">Ensure your contributions reach those in need, securely and transparently.</p>
        
        <div className="bg-white p-12 rounded-xl shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Donation Details</h3>
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-700">Amount</label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-200 font-semibold text-gray-700">$</span>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 text-lg font-semibold outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="anonymous" className="cursor-pointer text-gray-700">Donate Anonymously</label>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Your Information</h3>
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-700">Full Name</label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-200 text-xl">👤</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 outline-none focus:bg-gray-50"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-700">Email Address</label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-200 text-xl">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 outline-none focus:bg-gray-50"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-700">Phone Number</label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-200 text-xl">📞</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 outline-none focus:bg-gray-50"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-700">PAN (Optional for higher amounts)</label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-200 text-xl">📄</span>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 outline-none focus:bg-gray-50"
                  />
                </div>
                <small className="text-gray-500 text-sm mt-1 block">Providing PAN enables larger donations and tax benefits.</small>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg mb-8 text-green-800">
              <span className="text-2xl font-bold text-green-600">✓</span>
              <span>Your transaction is secure and encrypted. Viyom uses advanced security protocols.</span>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">Proceed to Payment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;

import React from 'react';
import { Link } from 'react-router-dom';

const DonationSuccess = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] py-8 px-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-5xl font-bold mx-auto mb-6">✓</div>
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Donation Successful!</h1>
          <div className="text-left mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Donation ID:</span>
              <span className="font-semibold text-gray-900">#VYM-DON-1234567890</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">$500.00</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Sector:</span>
              <span className="font-semibold text-gray-900">Education</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-medium text-gray-600">Payment Status:</span>
              <span className="font-semibold text-green-600">Completed</span>
            </div>
          </div>
          <Link to="/track-donation" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Track Your Donation</Link>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;

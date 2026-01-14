import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">Welcome back, {user?.name || 'John Doe'}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-2 font-medium">Total Donated</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$15,230</div>
            <div className="text-sm text-green-600">+20% from last month.</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-2 font-medium">Number of Donations</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">78</div>
            <div className="text-sm text-green-600">+5 donations this quarter.</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-2 font-medium">Lives Touched</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">3,500</div>
            <div className="text-sm text-gray-600">Across various sectors.</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-2 font-medium">Projects Funded</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
            <div className="text-sm text-gray-600">Making a real impact.</div>
          </div>
        </div>

        <div className="flex gap-6">
          <Link to="/donate" className="flex-1 bg-blue-600 text-white p-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors border-2 border-blue-600">
            <span className="text-2xl">$</span>
            Donate Now
          </Link>
          <Link to="/track-donation" className="flex-1 bg-white text-gray-700 p-6 rounded-xl font-semibold flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-colors">
            <span className="text-2xl">⚏</span>
            Track Your Donation
          </Link>
          <Link to="/my-donations" className="flex-1 bg-white text-gray-700 p-6 rounded-xl font-semibold flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-colors">
            <span className="text-2xl">📄</span>
            My Donations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

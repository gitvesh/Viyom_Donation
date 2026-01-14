import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <div className="w-8 h-8 bg-white text-blue-600 flex items-center justify-center rounded font-bold">V</div>
          <span>Viyom</span>
        </Link>
        <nav className="flex gap-8">
          <Link to="/" className="text-white font-medium hover:opacity-80 transition-opacity">Home</Link>
          <Link to="/sectors" className="text-white font-medium hover:opacity-80 transition-opacity">Sectors</Link>
          {user && !user.isAdmin && (
            <>
              <Link to="/dashboard" className="text-white font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
              <Link to="/my-donations" className="text-white font-medium hover:opacity-80 transition-opacity">My Donations</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.isAdmin ? (
                <Link to="/admin/dashboard" className="bg-transparent text-white px-6 py-2 rounded border border-white font-semibold hover:bg-white/10 transition-colors">Admin</Link>
              ) : (
                <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold text-sm">JD</div>
                </div>
              )}
              <button onClick={handleLogout} className="bg-transparent text-white px-6 py-2 rounded border border-white font-semibold hover:bg-white/10 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-transparent text-white px-6 py-2 rounded border border-white font-semibold hover:bg-white/10 transition-colors">Login</Link>
              <Link to="/signup" className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

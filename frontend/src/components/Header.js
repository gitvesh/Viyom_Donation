import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'JD';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced animation */}
          <Link to="/" className="flex items-center gap-2.5 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-9 h-9 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white flex items-center justify-center rounded-lg font-bold text-base shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                V
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent tracking-tight group-hover:tracking-normal transition-all duration-300" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
              Viyom
            </span>
          </Link>

          {/* Navigation with enhanced hover effects */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              {isActive('/') && (
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-lg animate-pulse"></span>
              )}
              <span className="relative">Home</span>
            </Link>
            <Link 
              to="/sectors" 
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/sectors') 
                  ? 'text-blue-600 bg-blue-50 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              {isActive('/sectors') && (
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-lg animate-pulse"></span>
              )}
              <span className="relative">Sectors</span>
            </Link>
            {user && !user.isAdmin && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {isActive('/dashboard') && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-lg animate-pulse"></span>
                  )}
                  <span className="relative">Dashboard</span>
                </Link>
                <Link 
                  to="/my-donations" 
                  className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    isActive('/my-donations') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {isActive('/my-donations') && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-lg animate-pulse"></span>
                  )}
                  <span className="relative">My Donations</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions with enhanced animations */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all duration-300 hover:shadow-md hover:scale-105"
                    style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                  </Link>
                )}
                
                {/* Enhanced User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-semibold text-xs shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                        {getUserInitials()}
                      </div>
                    </div>
                    <svg className={`w-3.5 h-3.5 text-gray-600 transition-all duration-300 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-slideDown overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
                          <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>{user.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>{user.email}</p>
                        </div>
                        
                        {/* Mobile Navigation Links */}
                        <div className="md:hidden border-b border-gray-100 pb-2 mb-2">
                          <Link
                            to="/"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                          >
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                          </Link>
                          <Link
                            to="/sectors"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                          >
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Sectors
                          </Link>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link
                          to="/my-donations"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          My Donations
                        </Link>
                        <Link
                          to="/track-donation"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          Track Donation
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                          >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-1.5 rounded-lg font-semibold text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="relative px-4 py-1.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105 overflow-hidden group"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

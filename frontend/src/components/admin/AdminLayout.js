import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/admin/sectors', 
      label: 'Sector Management', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      path: '/admin/pools', 
      label: 'Donation Pools', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      path: '/admin/donations', 
      label: 'Donations List', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { 
      path: '/admin/beneficiaries', 
      label: 'Beneficiaries', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      path: '/admin/allocate', 
      label: 'Allocate Funds', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      path: '/admin/allocations', 
      label: 'Allocation History', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      path: '/admin/reports', 
      label: 'Reports', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      path: '/admin/ledger', 
      label: 'Blockchain Ledger', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Modern Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30">
                V
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Viyom Admin
                </h1>
                <p className="text-xs text-gray-500 leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Dashboard Management
                </p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              {/* View User Dashboard Button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-md"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                User View
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden md:block">
                  <div className="font-bold text-gray-900 text-sm leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {user?.name || 'Admin'}
                  </div>
                  <div className="text-xs text-gray-600 leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content wrapper with proper spacing */}
      <div className="flex-1 pt-[60px] flex">
        {/* Modern Sidebar - Fixed */}
        <aside className="fixed left-0 top-[60px] bottom-0 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-lg overflow-y-auto z-40">
          <nav className="flex-1 py-6 px-4">
            <div className="space-y-1.5">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span className={location.pathname === item.path ? 'text-white' : 'text-gray-600'}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-white/50">
            <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-600/20">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-xs truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {user?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {user?.email || 'admin@viyom.com'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-br from-red-500 to-red-600 text-white py-2.5 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm shadow-lg shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main content with left margin for fixed sidebar */}
        <main className="flex-1 ml-72 p-8 pb-20">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Modern Footer - Fixed at bottom */}
      <footer className="fixed bottom-0 left-72 right-0 bg-white/80 backdrop-blur-xl py-3 border-t border-gray-200/50 z-30">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <div className="flex gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
          </div>
          <span className="font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2026 Viyom. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;

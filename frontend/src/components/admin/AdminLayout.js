import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/sectors', label: 'Sector Management', icon: '⚙️' },
    { path: '/admin/pools', label: 'Donation Pools', icon: '📦' },
    { path: '/admin/donations', label: 'Donations List', icon: '📋' },
    { path: '/admin/beneficiaries', label: 'Beneficiaries', icon: '👥' },
    { path: '/admin/allocate', label: 'Allocate Funds', icon: '💰' },
    { path: '/admin/allocations', label: 'Allocation History', icon: '🕐' },
    { path: '/admin/ledger', label: 'Blockchain Ledger', icon: '⛓️' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-[1600px] mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-white text-blue-600 flex items-center justify-center rounded font-bold">V</div>
            <span>Viyom Admin Dashboard</span>
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold text-sm">AU</div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-[calc(100vh-73px)]">
          <nav className="flex-1 py-4">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-gray-700 font-medium transition-colors border-l-4 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 border-blue-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <span className="text-xl w-6 text-center">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-gray-200">
            <div className="font-semibold text-gray-700 mb-3">Viyom Admin</div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 flex justify-between items-center text-sm text-gray-500">
          <span>Made with Visily</span>
          <span>© 2024 Viyom Admin Dashboard. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;

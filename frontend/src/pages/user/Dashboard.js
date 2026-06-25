import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { donationAPI } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonated: 0,
    numberOfDonations: 0,
    livesTouched: 0,
    projectsFunded: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's donations only (not admin endpoint)
      const donations = await donationAPI.getMyDonations();

      const donationsList = donations || [];

      // Calculate stats
      const totalDonated = donationsList.reduce((sum, d) => sum + (d.amount || 0), 0);
      const numberOfDonations = donationsList.length;
      
      // Lives touched - estimate based on donations (e.g., ₹100 = 1 life)
      const livesTouched = Math.floor(totalDonated / 100);
      
      // Projects funded - estimate based on unique sectors donated to
      const uniqueSectors = new Set(donationsList.map(d => d.sectorId).filter(Boolean));
      const projectsFunded = uniqueSectors.size;

      setStats({
        totalDonated,
        numberOfDonations,
        livesTouched,
        projectsFunded
      });

      // Get recent donations (last 3)
      const recent = donationsList
        .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
        .slice(0, 3);
      setRecentDonations(recent);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };


    };
    return colors[sectorName] || colors.default;
  };

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full border border-blue-200/50 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your Dashboard
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <span className="block text-gray-900 mb-2">Welcome back,</span>
              <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                {user?.name || 'User'}!
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Here's what's happening with your donations today
            </p>
          </div>
        </div>
      </section>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center animate-slideUp">
            <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-6 text-gray-600 font-semibold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Donated */}
              <div className="group bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 hover:-translate-y-1 animate-slideUp opacity-100" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Total Donated</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  ₹{stats.totalDonated.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>lifetime contributions</div>
              </div>

              {/* Number of Donations */}
              <div className="group bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 hover:-translate-y-1 animate-slideUp opacity-100" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Donations</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stats.numberOfDonations}
                </div>
                <div className="text-sm text-gray-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>total contributions</div>
              </div>

              {/* Lives Touched */}
              <div className="group bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 hover:-translate-y-1 animate-slideUp opacity-100" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Lives Touched</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stats.livesTouched.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>estimated impact</div>
              </div>

              {/* Projects Funded */}
              <div className="group bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 hover:-translate-y-1 animate-slideUp opacity-100" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  {stats.projectsFunded > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Active</span>
                  )}
                </div>
                <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Projects</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stats.projectsFunded}
                </div>
                <div className="text-sm text-gray-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>sectors supported</div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link 
                to="/donate" 
                className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/50 transition-all duration-500 hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Donate Now</h3>
                  <p className="text-blue-100 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Make a difference today</p>
                </div>
              </Link>
              
              <Link 
                to="/track-donation" 
                className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Track Donation</h3>
                  <p className="text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>See where your money goes</p>
                </div>
              </Link>
              
              <Link 
                to="/my-donations" 
                className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: '0.7s' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>My Donations</h3>
                  <p className="text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>View donation history</p>
                </div>
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-slideUp" style={{ animationDelay: '0.8s' }}>
              <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-blue-100 rounded-3xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent Activity</h2>
                </div>
              </div>
              
              {recentDonations.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-[3rem] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-bold text-xl mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>No donations yet</p>
                  <p className="text-gray-500 mb-8 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Start making a difference today</p>
                  <Link 
                    to="/donate"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Make Your First Donation
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentDonations.map((donation, index) => (
                    <div key={donation.donationId || index} className="p-6 sm:p-8 hover:bg-blue-50/50 transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 ${
                            donation.sectorName === 'Education' ? 'bg-emerald-100' :
                            donation.sectorName === 'Healthcare' ? 'bg-blue-100' :
                            donation.sectorName === 'Environment' ? 'bg-green-100' :
                            'bg-orange-100'
                          } rounded-3xl flex items-center justify-center flex-shrink-0`}>
                            <svg className={`w-7 h-7 ${
                              donation.sectorName === 'Education' ? 'text-emerald-600' :
                              donation.sectorName === 'Healthcare' ? 'text-blue-600' :
                              donation.sectorName === 'Environment' ? 'text-green-600' :
                              'text-orange-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {donation.sectorName || 'General'} {donation.anonymous ? '(Anonymous)' : ''}
                            </h4>
                            <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {formatDate(donation.donationDate)} • ₹{donation.amount?.toLocaleString() || '0'}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 ${
                          donation.status === 'SUCCESS' || donation.status === 'COMPLETED' || donation.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        } text-sm font-bold rounded-full`} style={{ fontFamily: "'Inter', sans-serif" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {donation.status === 'SUCCESS' || donation.status === 'COMPLETED' || donation.status === 'PAID' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

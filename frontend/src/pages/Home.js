import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { donationAPI, poolAPI, sectorAPI } from '../services/api';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counts, setCounts] = useState({ donations: 0, lives: 0, transparency: 0 });
  const [realStats, setRealStats] = useState({ totalDonations: 0, livesImpacted: 0, transparency: 100 });
  const [sectors, setSectors] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const statsRef = useRef(null);

  // Fetch sectors from database
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await sectorAPI.getAll(0, 100);
        const sectorsList = response.content || response || [];
        // Only show active sectors, limit to 3 for home page
        const activeSectors = sectorsList.filter(s => s.active).slice(0, 3);
        setSectors(activeSectors);
      } catch (error) {
        console.error('Error fetching sectors:', error);
      }
    };

    fetchSectors();
  }, []);

  // Fetch real stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all pools to calculate total donations
        const poolsResponse = await poolAPI.getAll(0, 100);
        const pools = poolsResponse.content || poolsResponse || [];
        
        // Calculate total donations from all pools
        const totalDonations = pools.reduce((sum, pool) => {
          return sum + (pool.totalCollectedAmount || 0);
        }, 0);
        
        // Calculate lives impacted (estimate: ₹100 = 1 life)
        const livesImpacted = Math.floor(totalDonations / 100);
        
        setRealStats({
          totalDonations: totalDonations,
          livesImpacted: livesImpacted,
          transparency: 100
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values if fetch fails
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update time for India (Delhi timezone)
  useEffect(() => {
    const updateIndiaTime = () => {
      const now = new Date();
      const indiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const hours = indiaTime.getHours();
      const minutes = indiaTime.getMinutes();
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
      setCurrentTime(formattedTime);
    };

    updateIndiaTime(); // Set initial time immediately
    const interval = setInterval(updateIndiaTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = statsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [statsVisible]);

  // Counter animation
  useEffect(() => {
    if (!statsVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      donations: realStats.totalDonations,
      lives: realStats.livesImpacted,
      transparency: realStats.transparency
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        donations: Math.floor(targets.donations * progress),
        lives: Math.floor(targets.lives * progress),
        transparency: Math.floor(targets.transparency * progress)
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [statsVisible, realStats]);

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-200px)]">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-10 animate-slideUp order-1">
              <div className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full border border-blue-200/50 backdrop-blur-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Blockchain-Powered Transparency
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <span className="block text-gray-900 mb-1 sm:mb-2">
                  All Donations
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-1 sm:mb-2">
                  Under Control
                </span>
                <span className="block text-gray-900">
                  With Your Hand
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                Manage your donations anywhere with our platform. Transparent giving has never been easier with our blockchain-powered tracking system.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
                <Link
                  to="/donate"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden text-center sm:text-left"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center sm:justify-start gap-2">
                    Get Started
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  to="/sectors"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-center sm:text-left"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Explore Sectors
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 group">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>100% Transparent</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>Tax Benefits</span>
                </div>
              </div>
            </div>

            {/* Right Content - Authentic iPhone Mockups - Hidden on mobile */}
            <div className="hidden lg:block relative h-[650px] animate-slideUp order-2" style={{ animationDelay: '0.2s' }}>
              {/* Phone 1 - Dark Theme - iPhone 14 Pro Style */}
              <div 
                className="absolute left-4 top-12 w-[270px] transform hover:scale-[1.02] transition-all duration-700 ease-out z-20 will-change-transform"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
              >
                {/* iPhone Frame with realistic proportions */}
                <div className="relative bg-[#1a1a1a] rounded-[50px] p-[12px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-gray-800">
                  {/* Side Buttons */}
                  <div className="absolute -left-[3px] top-[120px] w-[3px] h-[28px] bg-[#2a2a2a] rounded-l-sm"></div>
                  <div className="absolute -left-[3px] top-[170px] w-[3px] h-[58px] bg-[#2a2a2a] rounded-l-sm"></div>
                  <div className="absolute -left-[3px] top-[240px] w-[3px] h-[58px] bg-[#2a2a2a] rounded-l-sm"></div>
                  <div className="absolute -right-[3px] top-[150px] w-[3px] h-[85px] bg-[#2a2a2a] rounded-r-sm"></div>
                  
                  {/* Screen */}
                  <div className="relative bg-black rounded-[40px] overflow-hidden">
                    {/* Dynamic Island - Smaller */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[95px] h-[28px] bg-black rounded-full z-30">
                      <div className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] bg-[#1a1a2e] rounded-full">
                        <div className="absolute inset-[2px] bg-[#0d0d1a] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className="relative h-[520px] bg-black overflow-hidden">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-7 pt-2.5 pb-1">
                        <span className="text-white text-[13px] font-semibold tracking-wide" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>{currentTime || '9:41'}</span>
                        <div className="flex gap-1.5 items-center">
                          <svg className="w-4 h-3 text-white" viewBox="0 0 20 12" fill="currentColor">
                            <rect x="0.5" y="3" width="2.5" height="6" rx="0.5"/>
                            <rect x="4" y="1.5" width="2.5" height="9" rx="0.5"/>
                            <rect x="7.5" y="0.5" width="2.5" height="11" rx="0.5"/>
                            <rect x="11" y="2" width="2.5" height="8" rx="0.5"/>
                          </svg>
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11 11c.39.39 1.02.39 1.41 0l11-11c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
                          </svg>
                          <div className="flex items-center gap-0.5">
                            <span className="text-white text-[11px] font-medium">100</span>
                            <svg className="w-6 h-3 text-white" viewBox="0 0 24 12">
                              <rect x="1" y="1" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                              <rect x="3" y="3" width="14" height="6" rx="1" fill="currentColor"/>
                              <path d="M21 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* App Content - iOS Style */}
                      <div className="px-5 pt-8 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                              <span className="text-white text-sm font-semibold">DN</span>
                            </div>
                            <div>
                              <p className="text-white text-[15px] font-semibold" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>Donor Name</p>
                              <p className="text-gray-500 text-[12px]">Welcome back!</p>
                            </div>
                          </div>
                          <button className="w-9 h-9 bg-gray-900/80 rounded-full flex items-center justify-center backdrop-blur-md border border-gray-800/50">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </button>
                        </div>

                        {/* Main Card - iOS Glassmorphism */}
                        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-[24px] p-5 space-y-4 shadow-xl shadow-blue-900/40">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-blue-100/80 text-[11px] font-medium uppercase tracking-wider mb-0.5">Total Donated</p>
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-white text-[34px] font-bold tracking-tight" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>₹12,570</span>
                                <span className="text-blue-100/70 text-[15px]">.00</span>
                              </div>
                            </div>
                            <button className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Progress */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[12px] text-blue-100/90 font-medium">
                              <span>Monthly Goal</span>
                              <span>₹15,000</span>
                            </div>
                            <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: '84%' }}></div>
                            </div>
                            <p className="text-blue-100/70 text-[11px]">84% Complete</p>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <button className="bg-white/20 backdrop-blur-md text-white py-2.5 rounded-[14px] text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform border border-white/10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                              Donate
                            </button>
                            <button className="bg-white/20 backdrop-blur-md text-white py-2.5 rounded-[14px] text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform border border-white/10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Track
                            </button>
                          </div>
                        </div>

                        {/* Recent Donations - iOS List Style */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                            <p className="text-white text-[17px] font-semibold" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>Recent Donations</p>
                            <button className="text-blue-400 text-[13px] font-medium">See All</button>
                          </div>
                          <div className="bg-[#1c1c1e] rounded-[16px] p-4 border border-gray-800/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-white text-[15px] font-medium">Education</p>
                                  <p className="text-gray-500 text-[12px]">2 days ago</p>
                                </div>
                              </div>
                              <span className="text-white text-[16px] font-semibold" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>₹500</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 2 - Light Theme - iPhone 14 Pro Style */}
              <div 
                className="absolute right-0 top-32 w-[270px] transform hover:scale-[1.02] transition-all duration-700 ease-out z-10 will-change-transform"
                style={{ transform: `translateY(${scrollY * -0.1}px)` }}
              >
                {/* iPhone Frame */}
                <div className="relative bg-[#e8e8e8] rounded-[50px] p-[12px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-gray-300">
                  {/* Side Buttons */}
                  <div className="absolute -left-[3px] top-[120px] w-[3px] h-[28px] bg-gray-400 rounded-l-sm"></div>
                  <div className="absolute -left-[3px] top-[170px] w-[3px] h-[58px] bg-gray-400 rounded-l-sm"></div>
                  <div className="absolute -left-[3px] top-[240px] w-[3px] h-[58px] bg-gray-400 rounded-l-sm"></div>
                  <div className="absolute -right-[3px] top-[150px] w-[3px] h-[85px] bg-gray-400 rounded-r-sm"></div>
                  
                  {/* Screen */}
                  <div className="relative bg-white rounded-[40px] overflow-hidden">
                    {/* Dynamic Island - Smaller */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[95px] h-[28px] bg-black rounded-full z-30">
                      <div className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] bg-[#1a1a2e] rounded-full">
                        <div className="absolute inset-[2px] bg-[#0d0d1a] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className="relative h-[520px] bg-[#f5f5f7] overflow-hidden">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-7 pt-2.5 pb-1">
                        <span className="text-black text-[13px] font-semibold tracking-wide" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>{currentTime || '9:41'}</span>
                        <div className="flex gap-1.5 items-center">
                          <svg className="w-4 h-3 text-black" viewBox="0 0 20 12" fill="currentColor">
                            <rect x="0.5" y="3" width="2.5" height="6" rx="0.5"/>
                            <rect x="4" y="1.5" width="2.5" height="9" rx="0.5"/>
                            <rect x="7.5" y="0.5" width="2.5" height="11" rx="0.5"/>
                            <rect x="11" y="2" width="2.5" height="8" rx="0.5"/>
                          </svg>
                          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11 11c.39.39 1.02.39 1.41 0l11-11c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
                          </svg>
                          <div className="flex items-center gap-0.5">
                            <span className="text-black text-[11px] font-medium">100</span>
                            <svg className="w-6 h-3 text-black" viewBox="0 0 24 12">
                              <rect x="1" y="1" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                              <rect x="3" y="3" width="14" height="6" rx="1" fill="currentColor"/>
                              <path d="M21 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="px-5 pt-8 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <button className="w-8 h-8 rounded-full bg-gray-200/80 active:bg-gray-300 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h2 className="text-[17px] font-semibold text-gray-900" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>Activities</h2>
                          <button className="w-8 h-8 rounded-full bg-gray-200/80 active:bg-gray-300 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="6" r="2"/>
                              <circle cx="12" cy="12" r="2"/>
                              <circle cx="12" cy="18" r="2"/>
                            </svg>
                          </button>
                        </div>

                        {/* Stats Card - iOS Style */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-200/50">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wider">Your Impact</p>
                              <div className="flex items-baseline gap-0.5 mt-0.5">
                                <span className="text-gray-900 text-[32px] font-bold tracking-tight" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>₹8,330</span>
                                <span className="text-gray-500 text-[14px]">.00</span>
                              </div>
                            </div>
                            <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full">This month</span>
                          </div>
                          
                          {/* Circular Progress */}
                          <div className="flex justify-center py-2">
                            <div className="relative w-36 h-36">
                              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="7"/>
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="7" strokeDasharray="238.8" strokeDashoffset="59.7" strokeLinecap="round"/>
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="7" strokeDasharray="238.8" strokeDashoffset="178.5" strokeLinecap="round"/>
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-[28px] font-bold text-gray-900" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>75%</p>
                                  <p className="text-[11px] text-gray-500 font-medium">Goal</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex justify-center gap-6 mt-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                              <span className="text-[12px] text-gray-600 font-medium">Education</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                              <span className="text-[12px] text-gray-600 font-medium">Healthcare</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <button className="bg-blue-600 text-white py-3 rounded-[14px] text-[14px] font-semibold active:scale-95 transition-transform shadow-lg shadow-blue-600/25">
                            View Details
                          </button>
                          <button className="bg-white text-gray-900 py-3 rounded-[14px] text-[14px] font-semibold active:scale-95 transition-transform border border-gray-200 shadow-sm">
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-b from-purple-50/30 via-white to-white relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -top-20 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 - Blue Glass */}
            <div className="group text-center px-4 sm:px-8 py-6 sm:py-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-2xl border border-blue-200/30 animate-slideUp transform hover:scale-[1.02] transition-all duration-500 shadow-[0_8px_32px_0_rgba(59,130,246,0.12)] hover:shadow-[0_12px_40px_0_rgba(59,130,246,0.2)] relative overflow-hidden">
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 tracking-tight leading-none" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: '-0.03em' }}>
                  ₹{counts.donations.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium text-xs uppercase tracking-widest mt-3" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.1em' }}>Total Donations</div>
              </div>
            </div>

            {/* Card 2 - Purple Glass */}
            <div className="group text-center px-4 sm:px-8 py-6 sm:py-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-2xl border border-purple-200/30 animate-slideUp transform hover:scale-[1.02] transition-all duration-500 shadow-[0_8px_32px_0_rgba(168,85,247,0.12)] hover:shadow-[0_12px_40px_0_rgba(168,85,247,0.2)] relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2 tracking-tight leading-none" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: '-0.03em' }}>
                  {counts.lives.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium text-xs uppercase tracking-widest mt-3" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.1em' }}>Lives Impacted</div>
              </div>
            </div>

            {/* Card 3 - Green Glass */}
            <div className="group text-center px-4 sm:px-8 py-6 sm:py-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-2xl border border-green-200/30 animate-slideUp transform hover:scale-[1.02] transition-all duration-500 shadow-[0_8px_32px_0_rgba(34,197,94,0.12)] hover:shadow-[0_12px_40px_0_rgba(34,197,94,0.2)] relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 tracking-tight leading-none" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: '-0.03em' }}>
                  {counts.transparency}%
                </div>
                <div className="text-gray-600 font-medium text-xs uppercase tracking-widest mt-3" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.1em' }}>Transparent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Donation Sectors Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 animate-slideUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent" style={{ fontFamily: "'Inter', sans-serif" }}>
              Explore Donation Sectors
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Choose a cause that matters to you and make a lasting impact
            </p>
          </div>

          {/* Sector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {sectors.map((sector, index) => {
              const colorMap = {
                'Education': { color: 'blue', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                'Healthcare': { color: 'red', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                'Food & Shelter': { color: 'orange', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                'Environment': { color: 'green', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                'Poverty Alleviation': { color: 'purple', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
              };
              
              const sectorConfig = colorMap[sector.name] || { color: 'blue', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' };
              const color = sectorConfig.color;
              
              return (
                <div key={sector.sectorId} className="group relative animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:border-${color}-200/60 transition-all duration-500 hover:shadow-xl overflow-hidden hover:scale-[1.02]`}>
                    {/* Hover shine effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <div className={`w-16 h-16 mx-auto mb-6 bg-${color}-50 rounded-2xl flex items-center justify-center group-hover:bg-${color}-100 transition-colors duration-300`}>
                        <svg className={`w-8 h-8 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sectorConfig.icon} />
                        </svg>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {sector.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {sector.description}
                      </p>
                      
                      {/* View Details Link */}
                      <Link 
                        to="/sectors" 
                        className={`inline-flex items-center gap-2 text-${color}-600 font-semibold text-sm hover:gap-3 transition-all duration-300`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View More Sectors Button */}
          <div className="text-center mt-12 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/sectors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/40 backdrop-blur-xl border border-gray-200/50 text-gray-700 rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:border-blue-300/60 hover:bg-white/60 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative z-10">View More Sectors</span>
              <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-slideUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
              Why Choose Viyom?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Experience the future of transparent giving with blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 - 100% Secure */}
            <div className="group relative animate-slideUp">
              <div className="relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:border-blue-200/60 transition-all duration-500 hover:shadow-xl overflow-hidden hover:scale-[1.02]">
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    100% Secure
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Your donations are protected with bank-level encryption and blockchain technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Full Transparency */}
            <div className="group relative animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:border-purple-200/60 transition-all duration-500 hover:shadow-xl overflow-hidden hover:scale-[1.02]">
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Full Transparency
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Track every rupee from donation to impact with real-time blockchain tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Instant Impact */}
            <div className="group relative animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:border-green-200/60 transition-all duration-500 hover:shadow-xl overflow-hidden hover:scale-[1.02]">
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Instant Impact
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Your contributions reach beneficiaries quickly with automated smart contracts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment to Transparency Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slideUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our Commitment to Transparency
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Viyom leverages cutting-edge blockchain technology to provide unprecedented transparency. Every donation, from contribution to allocation, is recorded on an immutable ledger, ensuring trust and accountability.
            </p>
            <Link
              to="/track-donation"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold text-base hover:gap-3 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Learn more about our blockchain tracking
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

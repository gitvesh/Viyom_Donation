import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]">
            {/* Left Content */}
            <div className="space-y-10 animate-slideUp">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full border border-blue-200/50 backdrop-blur-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-blue-700 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Blockchain-Powered Transparency
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="block text-gray-900 mb-2">
                  All Donations
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-2">
                  Under Control
                </span>
                <span className="block text-gray-900">
                  With Your Hand
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                Manage your donations anywhere with our platform. Transparent giving has never been easier with our blockchain-powered tracking system.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/donate"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2.5">
                    Get Started
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  to="/sectors"
                  className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Explore Sectors
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2.5 group">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>100% Transparent</span>
                </div>
                <div className="flex items-center gap-2.5 group">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2.5 group">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>Tax Benefits</span>
                </div>
              </div>
            </div>

            {/* Right Content - Phone Mockups */}
            <div className="relative h-[650px] animate-slideUp" style={{ animationDelay: '0.2s' }}>
              {/* Phone 1 - Dark Theme */}
              <div 
                className="absolute left-0 top-0 w-[280px] transform hover:scale-105 transition-all duration-500 z-10"
                style={{ transform: `translateY(${scrollY * 0.08}px)` }}
              >
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-gray-900/50 border-[6px] border-gray-800">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10 flex items-end justify-center pb-1">
                      <div className="w-14 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                    
                    {/* Screen */}
                    <div className="relative bg-gradient-to-b from-gray-950 to-black rounded-[2.5rem] overflow-hidden h-[600px]">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-7 pt-4 pb-2 text-white text-xs font-medium">
                        <span>9:41</span>
                        <div className="flex gap-1 items-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-6 py-4 space-y-6">
                        {/* User Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                              <span className="text-white text-sm font-bold">DN</span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold">Donor Name</p>
                              <p className="text-gray-400 text-xs">Welcome back!</p>
                            </div>
                          </div>
                          <div className="w-9 h-9 bg-gray-800/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-3xl p-6 space-y-4 shadow-xl shadow-blue-600/20">
                          <p className="text-blue-100 text-sm font-medium">Total Donated</p>
                          <p className="text-white text-4xl font-bold tracking-tight">₹12,570.00</p>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs text-blue-100 font-medium">
                              <span>Monthly Goal</span>
                              <span>₹15,000.00</span>
                            </div>
                            <div className="h-2.5 bg-blue-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                              <div className="h-full bg-gradient-to-r from-white to-blue-100 rounded-full shadow-lg" style={{ width: '84%' }}></div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3 pt-3">
                            <button className="bg-white/20 backdrop-blur-md text-white py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all duration-300 border border-white/10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Donate
                            </button>
                            <button className="bg-white/20 backdrop-blur-md text-white py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all duration-300 border border-white/10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Track
                            </button>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-3">
                          <p className="text-gray-400 text-sm font-semibold">Recent Donations</p>
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                  <span className="text-xl">📚</span>
                                </div>
                                <div>
                                  <p className="text-white text-sm font-semibold">Education</p>
                                  <p className="text-gray-400 text-xs">2 days ago</p>
                                </div>
                              </div>
                              <p className="text-white font-bold text-base">₹500</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 2 - Light Theme */}
              <div 
                className="absolute right-0 top-24 w-[280px] transform hover:scale-105 transition-all duration-500"
                style={{ transform: `translateY(${scrollY * -0.04}px)` }}
              >
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-[3rem] p-3 shadow-2xl shadow-gray-400/50 border-[6px] border-gray-200">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-200 rounded-b-3xl z-10 flex items-end justify-center pb-1">
                      <div className="w-14 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    
                    {/* Screen */}
                    <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-[2.5rem] overflow-hidden h-[600px]">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-7 pt-4 pb-2 text-gray-900 text-xs font-semibold">
                        <span>9:41</span>
                        <div className="flex gap-1 items-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-6 py-4 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <button className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h2 className="text-xl font-bold text-gray-900">Activities</h2>
                          <button className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 space-y-4 border border-gray-200 shadow-lg">
                          <div className="flex justify-between items-center">
                            <p className="text-gray-600 text-sm font-semibold">Your Impact</p>
                            <span className="text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-full">This month</span>
                          </div>
                          <p className="text-gray-900 text-4xl font-bold tracking-tight">₹8,330.00</p>
                          
                          {/* Donut Chart */}
                          <div className="flex justify-center py-6">
                            <div className="relative w-44 h-44">
                              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray="188.4" strokeDashoffset="47.1" strokeLinecap="round" className="transition-all duration-1000"/>
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="188.4" strokeDashoffset="141.3" strokeLinecap="round" className="transition-all duration-1000"/>
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-3xl font-bold text-gray-900">75%</p>
                                  <p className="text-xs text-gray-500 font-medium mt-1">Goal</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex justify-center gap-6 text-xs font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                              <span className="text-gray-700">Education</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-purple-600 rounded-full shadow-sm"></div>
                              <span className="text-gray-700">Healthcare</span>
                            </div>
                          </div>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 animate-slideUp">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                ₹52L+
              </div>
              <div className="text-gray-600 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Total Donations</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                12,500+
              </div>
              <div className="text-gray-600 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Lives Impacted</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                100%
              </div>
              <div className="text-gray-600 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Transparent</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Why Choose Viyom?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Experience the future of transparent giving with blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:scale-105 transition-transform duration-300 animate-slideUp">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                100% Secure
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your donations are protected with bank-level encryption and blockchain technology.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                Full Transparency
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Track every rupee from donation to impact with real-time blockchain tracking.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                Instant Impact
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your contributions reach beneficiaries quickly with automated smart contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slideUp" style={{ fontFamily: "'Inter', sans-serif" }}>
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 animate-slideUp" style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.1s' }}>
            Join thousands of donors creating real impact through transparent giving
          </p>
          <Link
            to="/donate"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300 animate-slideUp"
            style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}
          >
            Start Donating Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

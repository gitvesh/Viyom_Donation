import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sectorAPI } from '../services/api';

const Sectors = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const response = await sectorAPI.getAll(0, 100);
      const sectorsList = response.content || response || [];
      
      // Only show active sectors
      const activeSectors = sectorsList.filter(s => s.active);
      setSectors(activeSectors);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError('Failed to load sectors');
    } finally {
      setLoading(false);
    }
  };

  const getSectorColor = (name) => {
    const colorMap = {
      'Education': 'blue',
      'Healthcare': 'red',
      'Food & Shelter': 'orange',
      'Food & Nutrition': 'orange',
      'Food': 'orange',
      'Environment': 'green',
      'Poverty Alleviation': 'purple',
      'Animal Welfare': 'teal',
      'Disaster Relief': 'indigo',
      'Women Empowerment': 'pink'
    };
    return colorMap[name] || 'blue';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        hover: 'hover:bg-blue-100',
        icon: 'text-blue-600',
        border: 'border-gray-200/50 hover:border-blue-200/60',
        shine: 'from-blue-50/50'
      },
      red: {
        bg: 'bg-red-50',
        hover: 'hover:bg-red-100',
        icon: 'text-red-600',
        border: 'border-gray-200/50 hover:border-red-200/60',
        shine: 'from-red-50/50'
      },
      orange: {
        bg: 'bg-orange-50',
        hover: 'hover:bg-orange-100',
        icon: 'text-orange-600',
        border: 'border-gray-200/50 hover:border-orange-200/60',
        shine: 'from-orange-50/50'
      },
      green: {
        bg: 'bg-green-50',
        hover: 'hover:bg-green-100',
        icon: 'text-green-600',
        border: 'border-gray-200/50 hover:border-green-200/60',
        shine: 'from-green-50/50'
      },
      purple: {
        bg: 'bg-purple-50',
        hover: 'hover:bg-purple-100',
        icon: 'text-purple-600',
        border: 'border-gray-200/50 hover:border-purple-200/60',
        shine: 'from-purple-50/50'
      },
      teal: {
        bg: 'bg-teal-50',
        hover: 'hover:bg-teal-100',
        icon: 'text-teal-600',
        border: 'border-gray-200/50 hover:border-teal-200/60',
        shine: 'from-teal-50/50'
      },
      indigo: {
        bg: 'bg-indigo-50',
        hover: 'hover:bg-indigo-100',
        icon: 'text-indigo-600',
        border: 'border-gray-200/50 hover:border-indigo-200/60',
        shine: 'from-indigo-50/50'
      },
      pink: {
        bg: 'bg-pink-50',
        hover: 'hover:bg-pink-100',
        icon: 'text-pink-600',
        border: 'border-gray-200/50 hover:border-pink-200/60',
        shine: 'from-pink-50/50'
      }
    };
    return colors[color];
  };

  const getIcon = (name) => {
    const icons = {
      'Education': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      'Healthcare': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'Food & Shelter': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      'Food & Nutrition': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      'Food': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      'Environment': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Poverty Alleviation': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      'Animal Welfare': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Disaster Relief': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      'Women Empowerment': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    };
    return icons[name] || icons['Education'];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading sectors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Sectors</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchSectors}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-slideUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
              Explore Donation Sectors
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Discover various causes where your generosity can make a profound impact. Each sector represents a vital area of need, supported by transparent and traceable donations.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {sectors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No active sectors available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectors.map((sector, index) => {
                const color = getSectorColor(sector.name);
                const colorClasses = getColorClasses(color);
                return (
                  <div key={sector.sectorId} className="group relative animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`relative p-6 rounded-3xl bg-white/60 backdrop-blur-xl border ${colorClasses.border} transition-all duration-500 hover:shadow-xl overflow-hidden hover:scale-[1.02]`}>
                      {/* Hover shine effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.shine} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      <div className="relative z-10 text-center">
                        {/* Icon */}
                        <div className={`w-16 h-16 mx-auto mb-4 ${colorClasses.bg} rounded-2xl flex items-center justify-center ${colorClasses.hover} transition-colors duration-300`}>
                          <div className={colorClasses.icon}>
                            {getIcon(sector.name)}
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {sector.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 text-xs leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {sector.description}
                        </p>
                        
                        {/* Donate Button */}
                        <Link 
                          to={`/donate?sector=${sector.sectorId}`}
                          className={`inline-flex items-center justify-center gap-2 w-full py-2.5 ${colorClasses.bg} ${colorClasses.icon} rounded-xl text-sm font-semibold ${colorClasses.hover} transition-all duration-300`}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Donate Now
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Sectors;

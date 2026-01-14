import React from 'react';
import { Link } from 'react-router-dom';

const Sectors = () => {
  const sectors = [
    {
      id: 'education',
      name: 'Education',
      icon: '📚',
      description: 'Supporting quality education, scholarships, and learning resources for underprivileged children and adults.',
      funds: '₹15,23,456',
      path: '/sector/education'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: '🏥',
      description: 'Access to medical care, vaccinations, health awareness programs, and emergency medical support.',
      funds: '₹23,89,712',
      path: '/sectors'
    },
    {
      id: 'environment',
      name: 'Environment',
      icon: '🌿',
      description: 'Conservation efforts, reforestation, pollution reduction, and sustainable environmental initiatives.',
      funds: '₹9,87,654',
      path: '/sectors'
    },
    {
      id: 'poverty',
      name: 'Poverty Alleviation',
      icon: '⬆️',
      description: 'Economic empowerment, skill development, and sustainable livelihood opportunities for marginalized communities.',
      funds: '₹18,76,543',
      path: '/sectors'
    },
    {
      id: 'animal',
      name: 'Animal Welfare',
      icon: '🐾',
      description: 'Protection and care for animals, rescue operations, and promoting animal rights and welfare.',
      funds: '₹7,65,432',
      path: '/sectors'
    },
    {
      id: 'disaster',
      name: 'Disaster Relief',
      icon: '🏠',
      description: 'Emergency aid, relief supplies, and long-term recovery support for communities affected by disasters.',
      funds: '₹31,24,567',
      path: '/sectors'
    }
  ];

  return (
    <div className="flex-1 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Explore Donation Sectors</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">Discover various causes where your generosity can make a profound impact. Each sector represents a vital area of need, supported by transparent and traceable donations through Viyom.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map(sector => (
            <div key={sector.id} className="bg-white p-10 rounded-xl shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="text-6xl mb-6">{sector.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{sector.name}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed min-h-[80px]">{sector.description}</p>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="block text-sm text-gray-600 mb-1">Collected Funds:</span>
                <strong className="block text-2xl font-bold text-blue-600">{sector.funds}</strong>
              </div>
              <Link to={sector.path} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-center">Donate</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sectors;

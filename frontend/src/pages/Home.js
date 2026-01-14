import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex-1">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Empowering Transparent Giving Through Blockchain</h1>
            <p className="text-xl mb-8 opacity-90">Viyom connects donors with NGOs, ensuring every contribution is trackable, secure, and impactful. See your generosity in action.</p>
            <div className="flex gap-4">
              <Link to="/donate" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">Donate Now</Link>
              <Link to="/track-donation" className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-white/10 transition-colors inline-block">Track Your Donation</Link>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md h-72 bg-white/10 rounded-xl relative overflow-hidden">
              <div className="absolute top-12 left-12 w-16 h-16 bg-white/30 rounded-full"></div>
              <div className="absolute bottom-12 right-12 w-16 h-16 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <div className="text-5xl font-bold text-blue-600 mb-2">₹5,234,120</div>
            <div className="text-lg text-gray-600">Total Donations Collected</div>
          </div>
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <div className="text-5xl font-bold text-blue-600 mb-2">12,500+</div>
            <div className="text-lg text-gray-600">Beneficiaries Helped</div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Explore Donation Sectors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Education</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Supporting schools, scholarships, and educational programs globally.</p>
              <Link to="/sector/education" className="text-blue-600 font-semibold hover:underline">View Details</Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Food & Shelter</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Providing meals, safe housing, and essential resources to communities in need.</p>
              <Link to="/sectors" className="text-blue-600 font-semibold hover:underline">View Details</Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Medical Aid</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Delivering healthcare services, medical supplies, and emergency relief.</p>
              <Link to="/sectors" className="text-blue-600 font-semibold hover:underline">View Details</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Commitment to Transparency</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">Viyom leverages cutting-edge blockchain technology to provide unprecedented transparency. Every donation, from contribution to allocation, is recorded on an immutable ledger, ensuring trust and accountability.</p>
          <a href="#learn-more" className="text-blue-600 font-semibold hover:underline">Learn more about our blockchain tracking</a>
        </div>
      </section>
    </div>
  );
};

export default Home;

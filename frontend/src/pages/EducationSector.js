import React from 'react';
import { Link } from 'react-router-dom';

const EducationSector = () => {
  return (
    <div className="flex-1 py-16 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Education Sector</h1>
          <p className="text-lg text-gray-600 leading-relaxed">At Viyom, we believe that education is the cornerstone of progress and empowerment. Our Education Sector initiatives focus on providing quality learning opportunities for underprivileged children and adults, ensuring access to knowledge that can transform lives. Through our programs, we support the construction of schools, provide educational resources, fund scholarships, and implement innovative learning programs that break down barriers to education. Join us in our mission to make education accessible to all, regardless of their circumstances.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          <div className="w-full">
            <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-30">📚</div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Total Funds Collected</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$2,345,678</div>
              <div className="text-sm text-gray-600">Across all projects in this sector</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Available Balance</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$450,980</div>
              <div className="text-sm text-gray-600">Ready for new initiatives</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Funding Progress</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '47%' }}></div>
              </div>
              <div className="text-sm text-gray-600">47% of goal achieved</div>
              <div className="text-xs text-gray-500 mt-1">Goal: $5,000,000</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-4xl font-bold text-gray-900 mb-1">12,345</div>
              <div className="text-sm text-gray-600">Beneficiaries Reached</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">✓</div>
              <div className="text-4xl font-bold text-gray-900 mb-1">230</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div className="flex gap-4 mt-4">
              <Link to="/donate" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">Donate Now</Link>
              <Link to="/sectors" className="flex-1 bg-white text-blue-600 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-gray-50 transition-colors text-center">View Detailed Impact</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 p-12 bg-gray-50 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Vision for Education</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">Viyom is committed to transforming lives through education. We focus on early childhood development, primary and secondary education, vocational training, and adult literacy programs. Our holistic approach ensures that educational initiatives are not just about building schools, but about creating sustainable, impactful projects that address the root causes of educational inequality.</p>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">We partner with local communities, educational institutions, and NGOs to implement programs that are culturally sensitive and contextually relevant. Our blockchain-based transparency ensures that every donation is tracked from contribution to impact, giving donors confidence that their contributions are making a real difference.</p>
          <p className="text-lg text-gray-600 leading-relaxed">Currently, we are expanding our digital literacy programs to reach rural and remote areas, recognizing that technology skills are essential for future opportunities. Through these initiatives, we aim to bridge the digital divide and empower the next generation with the tools they need to succeed in an increasingly connected world.</p>
        </div>
      </div>
    </div>
  );
};

export default EducationSector;

import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const SectorManagement = () => {
  const [sectors, setSectors] = useState([
    { id: 1, name: 'Education', description: 'Providing quality education and resources to underprivileged children.', status: 'Enabled' },
    { id: 2, name: 'Healthcare', description: 'Access to medical care, vaccinations, and health awareness programs.', status: 'Enabled' },
    { id: 3, name: 'Community Development', description: 'Sustainable infrastructure and economic empowerment projects.', status: 'Disabled' },
    { id: 4, name: 'Environmental Protection', description: 'Conservation efforts, reforestation, and pollution reduction initiatives.', status: 'Enabled' },
    { id: 5, name: 'Disaster Relief', description: 'Emergency aid and long-term recovery support for affected communities.', status: 'Enabled' }
  ]);

  const toggleStatus = (id) => {
    setSectors(sectors.map(sector =>
      sector.id === id
        ? { ...sector, status: sector.status === 'Enabled' ? 'Disabled' : 'Enabled' }
        : sector
    ));
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sector Management</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">+ Create New Sector</button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Existing Sectors</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Sector Name</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Description</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Status</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map(sector => (
                  <tr key={sector.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 border-b border-gray-200 font-semibold text-gray-900">{sector.name}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 max-w-md">{sector.description}</td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        sector.status === 'Enabled' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {sector.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <div className="flex gap-2">
                        <button className="text-xl hover:scale-110 transition-transform">✏️</button>
                        {sector.status === 'Enabled' ? (
                          <button onClick={() => toggleStatus(sector.id)} className="text-xl text-red-500 hover:scale-110 transition-transform">✕</button>
                        ) : (
                          <button onClick={() => toggleStatus(sector.id)} className="text-xl text-green-600 hover:scale-110 transition-transform">✓</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SectorManagement;

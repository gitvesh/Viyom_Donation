import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const Beneficiaries = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    email: '',
    phone: '',
    active: true
  });

  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: 'Green Earth Foundation', type: 'Organization', email: 'info@greenearth.org', phone: '+1 (234) 567-8900', status: 'Active' },
    { id: 2, name: 'Sarah Connor', type: 'Individual', email: 'sarah.connor@example.com', phone: '+1 (555) 123-4567', status: 'Active' },
    { id: 3, name: 'Future Innovations Project', type: 'Project', email: 'project@futureinnovations.io', phone: '+1 (987) 654-3210', status: 'Active' },
    { id: 4, name: 'United Children Fund', type: 'Organization', email: 'contact@ucf.org', phone: '+1 (111) 222-3333', status: 'Pending' },
    { id: 5, name: 'John Doe', type: 'Individual', email: 'john.doe@email.com', phone: '+1 (444) 555-6666', status: 'Active' }
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Beneficiaries Management</h1>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">Add New Beneficiary</h2>
          <p className="text-sm text-gray-600 mb-6">Fill in the details to add a new beneficiary to the system.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Beneficiary Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Green Earth Foundation"
                  className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Beneficiary Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm" required>
                  <option value="">Select type...</option>
                  <option value="Organization">Organization</option>
                  <option value="Individual">Individual</option>
                  <option value="Project">Project</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., contact@greenearth.org"
                  className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +1 (555) 123-4567"
                  className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-11 h-6 appearance-none bg-gray-200 rounded-full relative cursor-pointer transition-colors checked:bg-blue-600"
                style={{
                  backgroundImage: formData.active ? 'none' : 'none',
                  backgroundSize: '20px 20px',
                  backgroundPosition: formData.active ? 'calc(100% - 2px) center' : '2px center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <label className="font-medium text-gray-700 cursor-pointer">Active</label>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">Add Beneficiary</button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Existing Beneficiaries</h2>
          <input type="text" placeholder="Search beneficiaries..." className="w-full px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm mb-6" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Name</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Type</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Email</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Phone</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Status</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map(beneficiary => (
                  <tr key={beneficiary.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{beneficiary.name}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{beneficiary.type}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{beneficiary.email}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">{beneficiary.phone}</td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        beneficiary.status === 'Active' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {beneficiary.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <div className="flex gap-2">
                        <button className="text-xl hover:scale-110 transition-transform">✏️</button>
                        <button className="text-xl text-red-500 hover:scale-110 transition-transform">🗑️</button>
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

export default Beneficiaries;

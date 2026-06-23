import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { beneficiaryAPI } from '../../services/api';

const Beneficiaries = () => {
  const [formData, setFormData] = useState({
    name: '',
    beneficiaryType: '',
    description: '',
    contactDetails: '',
    active: true
  });

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await beneficiaryAPI.getAll(0, 100);
      setBeneficiaries(response.content || response || []);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setError('Failed to load beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.beneficiaryType || !formData.contactDetails) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      if (editingId) {
        // Update existing beneficiary
        await beneficiaryAPI.update(editingId, formData);
        setSuccess('Beneficiary updated successfully!');
        setEditingId(null);
      } else {
        // Create new beneficiary
        await beneficiaryAPI.create(formData);
        setSuccess('Beneficiary added successfully!');
      }
      
      // Reset form
      setFormData({
        name: '',
        beneficiaryType: '',
        description: '',
        contactDetails: '',
        active: true
      });
      
      // Refresh list
      await fetchBeneficiaries();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving beneficiary:', err);
      setError(err.message || 'Failed to save beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (beneficiary) => {
    setFormData({
      name: beneficiary.name,
      beneficiaryType: beneficiary.beneficiaryType,
      description: beneficiary.description || '',
      contactDetails: beneficiary.contactDetails,
      active: beneficiary.active
    });
    setEditingId(beneficiary.beneficiaryId);
    setError(null);
    setSuccess(null);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({
      name: '',
      beneficiaryType: '',
      description: '',
      contactDetails: '',
      active: true
    });
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this beneficiary? This action will mark them as inactive.')) {
      return;
    }

    try {
      setError(null);
      await beneficiaryAPI.delete(id);
      setSuccess('Beneficiary deactivated successfully!');
      await fetchBeneficiaries();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deactivating beneficiary:', err);
      setError(err.message || 'Failed to deactivate beneficiary');
    }
  };

  // Filter beneficiaries based on search term
  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.beneficiaryType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.contactDetails?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Beneficiaries Management</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">
            {editingId ? 'Edit Beneficiary' : 'Add New Beneficiary'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {editingId ? 'Update the beneficiary details below.' : 'Fill in the details to add a new beneficiary to the system.'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Beneficiary Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Rural School - Panhala"
                  className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Beneficiary Type *</label>
                <select 
                  name="beneficiaryType" 
                  value={formData.beneficiaryType} 
                  onChange={handleChange} 
                  className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm bg-white" 
                  required
                >
                  <option value="">Select type...</option>
                  <option value="SCHOOL">School</option>
                  <option value="HOSPITAL">Hospital</option>
                  <option value="ORPHANAGE">Orphanage</option>
                  <option value="ANIMAL_SHELTER">Animal Shelter</option>
                  <option value="NGO">NGO</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="ORGANIZATION">Organization</option>
                  <option value="PROJECT">Project</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the beneficiary (optional)"
                rows="3"
                className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm resize-y"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Contact Details *</label>
              <textarea
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
                placeholder="e.g., Principal Sharma, +91-9876543210, school.panhala@example.com"
                rows="2"
                className="px-3 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm resize-y"
                required
              />
              <p className="text-xs text-gray-500">Include name, phone, email, or any relevant contact information</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Active Status</span>
              </label>
              <span className="text-xs text-gray-500">
                {formData.active ? 'Beneficiary is active and can receive allocations' : 'Beneficiary is inactive'}
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : editingId ? 'Update Beneficiary' : 'Add Beneficiary'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Existing Beneficiaries ({filteredBeneficiaries.length})
              </h2>
            </div>
            <input 
              type="text" 
              placeholder="Search beneficiaries by name, type, or contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-md outline-none focus:border-blue-600 text-sm" 
            />
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading beneficiaries...</p>
            </div>
          ) : filteredBeneficiaries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm ? 'No beneficiaries found matching your search.' : 'No beneficiaries found. Add your first beneficiary above.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Name</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Type</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Description</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Contact Details</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Status</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeneficiaries.map(beneficiary => (
                    <tr key={beneficiary.beneficiaryId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-900 text-sm font-medium">
                        {beneficiary.name}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {beneficiary.beneficiaryType?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm max-w-[200px]">
                        <div className="truncate" title={beneficiary.description}>
                          {beneficiary.description || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 text-sm max-w-[250px]">
                        <div className="truncate" title={beneficiary.contactDetails}>
                          {beneficiary.contactDetails}
                        </div>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          beneficiary.active ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {beneficiary.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(beneficiary)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit beneficiary"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(beneficiary.beneficiaryId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete beneficiary"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Beneficiaries;

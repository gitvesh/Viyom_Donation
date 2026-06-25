// API Configuration and Service
const getApiBaseUrl = () => {
  let url = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL;
  if (!url || url === 'undefined' || url === 'null' || url.trim() === '') {
    console.warn('Warning: REACT_APP_API_BASE_URL environment variable is not set. Defaulting to localhost.');
    return 'http://localhost:8080/viyom/api';
  }
  
  // Clean trailing slashes
  url = url.replace(/\/+$/, '');
  
  // If it's a remote production URL (starts with http, not localhost) and lacks context path, append it automatically
  if (url.startsWith('http') && !url.includes('localhost') && !url.endsWith('/viyom/api')) {
    if (url.endsWith('/viyom')) {
      url = `${url}/api`;
    } else {
      url = `${url}/viyom/api`;
    }
  }
  
  return url;
};
const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth token
const getAuthToken = () => {
  const user = localStorage.getItem('viyom_user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Helper function to create headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: getHeaders(options.auth !== false),
  };

  try {
    // Check network connectivity before making the call
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    const response = await fetch(url, config);
    
    // Get content type to determine how to parse response
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      let errorMessage = 'Request failed';
      
      try {
        if (isJson) {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } else {
          // Backend returned plain text error
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
      } catch (parseError) {
        // If parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. Please log in again.';
        // Clear invalid token
        localStorage.removeItem('viyom_user');
      } else if (response.status === 404) {
        errorMessage = 'Resource not found';
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    if (isJson) {
      return await response.json();
    } else {
      // If backend returns plain text for success (like registration)
      const text = await response.text();
      // Try to parse as JSON, if fails return as object with message
      try {
        return JSON.parse(text);
      } catch {
        return { message: text, success: true };
      }
    }
  } catch (error) {
    console.error('API call failed:', error);
    
    // Provide more specific error messages for network issues
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: async (data) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    });
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });
  },
};

// Sector APIs
export const sectorAPI = {
  getAll: async (page = 0, size = 10) => {
    return apiCall(`/sectors?page=${page}&size=${size}`, {
      method: 'GET',
      auth: false,
    });
  },

  getById: async (id) => {
    return apiCall(`/sectors/${id}`, {
      method: 'GET',
      auth: false,
    });
  },

  getByOrganization: async (organizationId) => {
    return apiCall(`/sectors/organization/${organizationId}`, {
      method: 'GET',
      auth: false,
    });
  },

  create: async (data) => {
    return apiCall('/sectors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deactivate: async (id) => {
    return apiCall(`/sectors/${id}/deactivate`, {
      method: 'PUT',
    });
  },
};

// Pool APIs
export const poolAPI = {
  getAll: async (page = 0, size = 10) => {
    return apiCall(`/pools?page=${page}&size=${size}`, {
      method: 'GET',
      auth: false,
    });
  },

  getBySector: async (sectorId) => {
    return apiCall(`/pools/sector/${sectorId}`, {
      method: 'GET',
      auth: false,
    });
  },

  getById: async (id) => {
    return apiCall(`/pools/${id}`, {
      method: 'GET',
      auth: false,
    });
  },

  create: async (data) => {
    return apiCall('/pools', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deactivate: async (id) => {
    return apiCall(`/pools/${id}/deactivate`, {
      method: 'PUT',
    });
  },
};

// Donation APIs
export const donationAPI = {
  createOrder: async (data) => {
    return apiCall('/donations/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyPayment: async (data) => {
    return apiCall('/donations/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyDonations: async () => {
    return apiCall('/donations/my-donations', {
      method: 'GET',
    });
  },

  getAllDonations: async () => {
    return apiCall('/donations/admin/donations', {
      method: 'GET',
    });
  },
};

// Beneficiary APIs
export const beneficiaryAPI = {
  getAll: async (page = 0, size = 10) => {
    return apiCall(`/beneficiaries?page=${page}&size=${size}`, {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiCall(`/beneficiaries/${id}`, {
      method: 'GET',
    });
  },

  create: async (data) => {
    return apiCall('/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiCall(`/beneficiaries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiCall(`/beneficiaries/${id}/deactivate`, {
      method: 'PUT',
    });
  },
};

// Fund Allocation APIs
export const allocationAPI = {
  allocate: async (data) => {
    return apiCall('/admin/fund-allocate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getHistory: async (page = 0, size = 10) => {
    return apiCall('/admin/allocations', {
      method: 'GET',
    });
  },

  getByPool: async (poolId) => {
    return apiCall(`/admin/pool/${poolId}/allocations`, {
      method: 'GET',
    });
  },

  getByBeneficiary: async (beneficiaryId) => {
    return apiCall(`/admin/beneficiary/${beneficiaryId}/allocations`, {
      method: 'GET',
    });
  },
  getLedger: async () => {
    return apiCall('/admin/ledger/summary', {
      method: 'GET',
    });
  },
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: async () => {
    return apiCall('/admin/dashboard/stats', {
      method: 'GET',
    });
  },

  getAuditLogs: async (page = 0, size = 20) => {
    return apiCall(`/admin/audit-logs?page=${page}&size=${size}`, {
      method: 'GET',
    });
  },
};

// Notification APIs
export const notificationAPI = {
  getMyNotifications: async () => {
    return apiCall('/notifications/my-notifications', {
      method: 'GET',
    });
  },

  markAsRead: async (id) => {
    return apiCall(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },
};

// Report APIs
export const reportAPI = {
  getDonationReport: async (startDate, endDate) => {
    return apiCall(`/reports/donations?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
    });
  },

  getAllocationReport: async (startDate, endDate) => {
    return apiCall(`/reports/allocations?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
    });
  },
};

const api = {
  authAPI,
  sectorAPI,
  poolAPI,
  donationAPI,
  beneficiaryAPI,
  allocationAPI,
  adminAPI,
  notificationAPI,
  reportAPI,
};

export default api;

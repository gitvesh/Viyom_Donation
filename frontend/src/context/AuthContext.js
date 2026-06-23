import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('viyom_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('viyom_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Call backend API
      const response = await authAPI.login(email, password);
      
      console.log('Login response from backend:', response);
      
      // Extract user data from JWT response
      const userData = {
        id: response.id,
        email: response.email || email,
        token: response.token,
        roles: response.roles || [],
        role: response.roles && response.roles.length > 0 ? response.roles[0] : 'ROLE_USER',
        isAdmin: response.roles && response.roles.includes('ROLE_ADMIN'),
        name: response.name || response.username || (response.email ? response.email.split('@')[0] : email.split('@')[0]),
      };
      
      console.log('User data being stored:', userData);
      
      setUser(userData);
      localStorage.setItem('viyom_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const signup = async (name, email, password, phone, pan) => {
    try {
      setError(null);
      setLoading(true);
      
      // Call backend API
      await authAPI.register({
        name,
        email,
        password,
        phone,
        pan,
      });
      
      // After successful registration, login automatically
      await login(email, password);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('viyom_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


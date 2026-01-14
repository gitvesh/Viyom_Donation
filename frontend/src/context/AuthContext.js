import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('viyom_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, isAdmin = false) => {
    // Dummy authentication
    const dummyUser = {
      id: '1',
      email: email,
      name: isAdmin ? 'Admin User' : 'John Doe',
      isAdmin: isAdmin,
    };
    setUser(dummyUser);
    localStorage.setItem('viyom_user', JSON.stringify(dummyUser));
    return true;
  };

  const signup = (email, password, name) => {
    // Dummy signup
    const dummyUser = {
      id: Date.now().toString(),
      email: email,
      name: name,
      isAdmin: false,
    };
    setUser(dummyUser);
    localStorage.setItem('viyom_user', JSON.stringify(dummyUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('viyom_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


import React from 'react';
import { Navigate } from 'react-router-dom';

const Signup = () => {
  // Redirect to login page with signup tab active
  // This is a simple implementation - in a real app you'd handle this differently
  return <Navigate to="/login" replace />;
};

export default Signup;

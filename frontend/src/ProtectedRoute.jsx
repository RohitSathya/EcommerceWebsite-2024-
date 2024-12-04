import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const userdetail = localStorage.getItem('userdetail');
  
  if (!userdetail) {
    alert('Please log in first!');
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;

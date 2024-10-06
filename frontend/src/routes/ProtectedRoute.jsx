import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component
const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if the user's role matches the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
};

export default ProtectedRoute;

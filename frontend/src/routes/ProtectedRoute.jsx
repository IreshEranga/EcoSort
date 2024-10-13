import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component
const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const driver = JSON.parse(localStorage.getItem('driver'));

  // If neither user nor driver is logged in, redirect to login page
  if (!user && !driver) {
    return <Navigate to="/login" />;
  }

  // Determine the current user or driver role
  const currentRole = user ? user.role : driver ? driver.role : null;

  // Check if the current role matches the allowed roles
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Render the component if the role is allowed
  return <Component />;
};

export default ProtectedRoute;

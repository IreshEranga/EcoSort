import React from 'react';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="cancel-icon"></div>
      <h2 className="unauthorized-heading">Access Denied</h2>
      <p className="unauthorized-message">You are not authorized to view this page</p>
    </div>
  );
};

export default Unauthorized;

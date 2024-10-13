import React from 'react';
import { useNavigate } from 'react-router-dom';
import DriverNavBar from './DriverNavBar';
function DriverHome() {
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Handle logout


  return (
    <div>
      <DriverNavBar/>
      <h1>Driver Home</h1>
      
    </div>
  );
}

export default DriverHome;

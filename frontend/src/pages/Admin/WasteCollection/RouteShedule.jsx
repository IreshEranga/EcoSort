import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminSidebar from '../../../components/Admin/AdminSidebar';

function RouteShedule() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle button click and navigate to another page
  const handleNavigation = () => {
    navigate('/admindashboard/collection-routine/dateShedule'); // Replace '/another-page' with the actual route
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}
      
      {/* Main Content */}
      <div className="main-content">
        <h1 style={{ fontStyle: 'italic' }}>Schedule Route</h1>

        {/* Button to navigate, positioned at the top right */}
        <button 
          onClick={handleNavigation} 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Shedule Dates
        </button>
      </div>
    </div>
  );
}

export default RouteShedule;

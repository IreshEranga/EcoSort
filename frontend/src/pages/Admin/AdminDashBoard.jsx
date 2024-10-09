import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar'; // Import the sidebar component
import './AdminDashBoard.css'; // Optional: Create styles for the main dashboard
import axios from 'axios'; // For making API requests

export default function AdminDashBoard() {
  const [userCount, setUserCount] = useState(0); // State to hold user count

  // Fetch user count from the backend
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/count'); // Ensure this matches your backend route
        setUserCount(response.data.count); // Set user count in state
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}
      
      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome Admin !</h1>
        
        {/* User Count Card */}
        <div className="user-count-card">
          <h2>Total Users 👤</h2>
          <p>{userCount}</p>
        </div>
        
        {/* Add additional content here */}
      </div>
    </div>
  );
}

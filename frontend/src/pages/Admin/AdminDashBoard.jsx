import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar'; // Import the sidebar component
import './AdminDashBoard.css'; // Optional: Create styles for the main dashboard
import axios from 'axios'; // For making API requests

export default function AdminDashBoard() {
  const [userCount, setUserCount] = useState(0); // State to hold user count
  const [driverCount, setDriverCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };
  
  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users'); // Ensure this matches your backend route
        const users = response.data; // Assuming the API returns an array of users
        setUserCount(users.length); // Set the user count based on array length
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/driver/drivers'); // Ensure this matches your backend route
        const drivers = response.data; // Assuming the API returns an array of users
        setDriverCount(drivers.length); // Set the user count based on array length
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const today = getCurrentDay();

        // Filter routes based on today's day
        const filteredRoutes = response.data.filter(route => route.date === today);
        
        setRouteCount(filteredRoutes.length); // Set initial filtered routes to the full list
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}

      {/* Main Content */}
      <div className="main-content" style={{backgroundColor:'white'}}>
        <h1>Welcome Admin!</h1>

       <div className="card" style={{display:'flex', flexDirection:'row', gap:20, backgroundColor:'#f4f4f4', border:'1px solid #f4f4f4'}}>
         {/* User Count Card */}
         <div className="user-count-card" style={{marginLeft:'50px'}}>
          <h2>Total Users 👤</h2>
          <p>{userCount}</p>
        </div>

        {/* User Count Card */}
        <div className="user-count-card">
          <h2>Total Drivers 🚜</h2>
          <p>{driverCount}</p>
        </div>

        <div className="user-count-card">
          <h2>Today Routes 🛣️</h2>
          <p>{routeCount}</p>
        </div>

       </div>

        {/* Add additional content here */}
      </div>
    </div>
  );
}

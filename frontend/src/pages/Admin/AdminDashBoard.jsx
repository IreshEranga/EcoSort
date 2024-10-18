import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar'; // Import the sidebar component
import './AdminDashBoard.css'; // Optional: Create styles for the main dashboard
import axios from 'axios'; // For making API requests
import { ClipLoader } from 'react-spinners'; // Import ClipLoader for loading animation

export default function AdminDashBoard() {
  const [userCount, setUserCount] = useState(0); // State to hold user count
  const [driverCount, setDriverCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);
  const [specialRequestCount, setSpecialRequestCount] = useState(0); // State to hold special request count

  // Loading states for each API request
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axios.get('http://localhost:8000/api/users'); // Ensure this matches your backend route
        const users = response.data; // Assuming the API returns an array of users
        setUserCount(users.length); // Set the user count based on array length
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false); // Stop loading after fetching
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoadingDrivers(true);
      try {
        const response = await axios.get('http://localhost:8000/api/driver/drivers'); // Ensure this matches your backend route
        const drivers = response.data; // Assuming the API returns an array of drivers
        setDriverCount(drivers.length); // Set the driver count based on array length
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setIsLoadingDrivers(false); // Stop loading after fetching
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoadingRoutes(true);
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const today = getCurrentDay();

        // Filter routes based on today's day
        const filteredRoutes = response.data.filter(route => route.date === today);

        setRouteCount(filteredRoutes.length); // Set initial filtered routes to the full list
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setIsLoadingRoutes(false); // Stop loading after fetching
      }
    };

    fetchRoutes();
  }, []);

  // Fetch current special request count from the backend
  useEffect(() => {
    const fetchSpecialRequestCount = async () => {
      setIsLoadingRequests(true);
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests/count-current'); // Your new backend route
        const { totalCurrentRequests } = response.data; // Adjusted to match the new API response
        setSpecialRequestCount(totalCurrentRequests); // Set the current special request count
      } catch (error) {
        console.error('Error fetching current special requests:', error);
      } finally {
        setIsLoadingRequests(false); // Stop loading after fetching
      }
    };

    fetchSpecialRequestCount();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}

      {/* Main Content */}
      <div className="main-content" style={{ backgroundColor: 'white' }}>
        <h1>Welcome Admin !</h1>

        <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: 20, backgroundColor: '#ffffff', border: '1px solid #ffffff' }}>
          {/* User Count Card */}
          <div className="user-count-card" style={{ marginLeft: '50px' }}>
            <h2>Total Users 👤</h2>
            {isLoadingUsers ? (
              <ClipLoader color="#00BFFF" loading={isLoadingUsers} size={30} />
            ) : (
              <p>{userCount}</p>
            )}
          </div>

          {/* Driver Count Card */}
          <div className="user-count-card">
            <h2>Total Drivers 🚜</h2>
            {isLoadingDrivers ? (
              <ClipLoader color="#00BFFF" loading={isLoadingDrivers} size={30} />
            ) : (
              <p>{driverCount}</p>
            )}
          </div>

          {/* Route Count Card */}
          <div className="user-count-card">
            <h2>Today Routes 🛣️</h2>
            {isLoadingRoutes ? (
              <ClipLoader color="#00BFFF" loading={isLoadingRoutes} size={30} />
            ) : (
              <p>{routeCount}</p>
            )}
          </div>

          {/* Special Request Count Card */}
          <div className="user-count-card">
            <h2>Current Special Requests 🗑️</h2>
            {isLoadingRequests ? (
              <ClipLoader color="#00BFFF" loading={isLoadingRequests} size={30} />
            ) : (
              <p>{specialRequestCount}</p>
            )}
          </div>
       </div>

        {/* Add additional content here */}
      </div>
    </div>
  );
}

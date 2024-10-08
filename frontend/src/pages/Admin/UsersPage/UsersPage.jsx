import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './UserPage.css';
import axios from 'axios'; // For making API requests

function UsersPage() {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users'); // Ensure this matches your backend route
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle map navigation
  const handleNavigateToMap = (latitude, longitude) => {
    // Open Google Maps centered on the user's latitude and longitude
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank'); // Open in a new tab
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}
      
      {/* Main Content */}
      <div className="main-content">
        <h1 className="topic" style={{ color: 'black' }}>Users</h1>
        
        {/* Users Table */}
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>City</th>
              <th>Type</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.type}</td>
                  <td>
                    {user.location.latitude && user.location.longitude ? (
                      <button 
                        className="map-button" 
                        onClick={() => handleNavigateToMap(user.location.latitude, user.location.longitude)}
                      >
                        View on Map
                      </button>
                    ) : (
                      'Location not available'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;

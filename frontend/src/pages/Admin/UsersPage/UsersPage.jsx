import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './UserPage.css';
import axios from 'axios'; // For making API requests
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users'); // Ensure this matches your backend route
        setUsers(response.data);
        setFilteredUsers(response.data); // Set filtered users initially to all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle map navigation
  const handleNavigateToMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank'); // Open in a new tab
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    // Filter users based on search term
    const filtered = users.filter(user => 
      user.firstName.toLowerCase().includes(value) ||
      user.lastName.toLowerCase().includes(value) ||
      user.city.toLowerCase().includes(value) ||
      user.type.toLowerCase().includes(value)
    );

    setFilteredUsers(filtered);
  };

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set Title
    doc.setFontSize(18);
    doc.text('User Report', 14, 20);

    // Set Column Titles
    const headers = ['User ID', 'First Name', 'Last Name', 'Email', 'Mobile', 'Address', 'City', 'Type'];
    const data = filteredUsers.map(user => [
      user.userId,
      user.firstName,
      user.lastName,
      user.email,
      user.mobile,
      user.address,
      user.city,
      user.type
    ]);

    // Add headers
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    // Save the PDF
    doc.save('user_report.pdf');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}
      
      {/* Main Content */}
      <div className="main-content">
        <h1 className="topic" style={{ color: 'black' }}>Users</h1>
        
        <div style={{display:'flex', flexDirection:'row'}}>
          {/* Search Bar */}
            <input 
              type="text" 
              placeholder="Search by name, city, or type..." 
              value={searchTerm} 
              onChange={handleSearchChange} 
              className="search-input"
            />
            {/* Report Generation Button */}
            {filteredUsers.length > 0 && (
              <div className="report-section">
                <button className="btn btn-primary" onClick={generatePDF}>
                  Download PDF Report
                </button>
              </div>
            )}
        </div>

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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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

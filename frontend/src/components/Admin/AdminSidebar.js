import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminSidebar.css'; // CSS file for sidebar styling
import logo from '../../assets/ECOSORT.png';



export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Placeholder for admin avatar image */}
        <img src={logo} alt="Admin" className="admin-avatar" />
        <h3 className="admin-name">Admin</h3> {/* Placeholder for admin name */}
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/admindashboard">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/admindashboard/drivers">Drivers</Link></li>
        <li><Link to="/waste-management">Waste Management</Link></li>
        <li><Link to="/admindashboard/collection-routine">Collection Routines</Link></li>
        <li><Link to="/waste-management">Payments</Link></li>
        <li><Link to="/waste-management">Issues</Link></li>
  
        {/* Add more links as needed */}
      </ul>

      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

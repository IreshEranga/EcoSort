import React from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar'; // Import the sidebar component
import './AdminDashBoard.css'; // Optional: Create styles for the main dashboard

export default function AdminDashBoard() {
  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}
      
      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome to Admin Dashboard</h1>
        {/* Add additional content here */}
      </div>
    </div>
  );
}

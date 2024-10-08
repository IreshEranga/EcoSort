import React from 'react'
import AdminSidebar from '../../../components/Admin/AdminSidebar'
import './UserPage.css';



function UsersPage() {
  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}
      
      {/* Main Content */}
      <div className="main-content">
        <h1 className='topic' style={{color:'black'}}>Users</h1>
        {/* Add additional content here */}
      </div>
    </div>
  )
}

export default UsersPage
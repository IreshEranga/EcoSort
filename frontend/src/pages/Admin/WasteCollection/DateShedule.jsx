import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import UpdateDateModal from './UpdateDateModal';

function DateShedule() {
  const [usersByCity, setUsersByCity] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users');
      const users = response.data;

      // Organize users by city
      const groupedUsers = users.reduce((acc, user) => {
        const city = user.city;
        if (!acc[city]) {
          acc[city] = [];
        }
        acc[city].push(user);
        return acc;
      }, {});

      setUsersByCity(groupedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle update date action
  const handleUpdateDate = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Update the waste collection date (placeholder for actual implementation)
  const updateWasteCollectionDate = (selectedDay) => {
    console.log(`Update date for user ID: ${selectedUserId} to ${selectedDay}`);
    // Implement the API call to update the date in the database
  };

  // Filter users based on the search term
  const filteredUsersByCity = Object.fromEntries(
    Object.entries(usersByCity).map(([city, users]) => [
      city,
      users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ])
  );

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}

      {/* Main Content */}
      <div className="main-content">
        <h1 style={{ fontStyle: 'bold' }}>Schedule Date</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
        />

        {/* Users Table by City */}
        {Object.entries(filteredUsersByCity).map(([city, users]) => (
          <div key={city} style={{ marginBottom: '20px' }}>
            <h2>{city}</h2>
            <table style={{ width: '100%', border: '1px solid #ddd', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>User ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>First Name</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Name</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Waste Collection Date</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.userId}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.userId}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.firstName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.lastName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.wasteCollectionDate ? new Date(user.wasteCollectionDate).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <button onClick={() => handleUpdateDate(user.userId)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                        Update Date
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Modal for updating date */}
        <UpdateDateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={updateWasteCollectionDate}
        />
      </div>
    </div>
  );
}

export default DateShedule;

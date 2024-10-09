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
  const handleUpdateDate = (_id) => {
    setSelectedUserId(_id);
    setIsModalOpen(true);
  };

  // Update the waste collection date (placeholder for actual implementation)
  /*
  const updateWasteCollectionDate = (selectedDay) => {
    console.log(`Update date for user ID: ${selectedUserId} to ${selectedDay}`);
    // Implement the API call to update the date in the database
  };
*/

  const updateWasteCollectionDate = async (selectedDay) => {
    console.log(`Update date for user ID: ${selectedUserId} to ${selectedDay}`);
    
    try {
      // Update the waste collection date via API call
      const response = await axios.put(`http://localhost:8000/api/users/${selectedUserId}/waste-collection-date`, {
        wasteCollectionDate: selectedDay,
      });

      console.log(response.data); // Log response for debugging
      fetchUsers(); // Refresh the user list after updating
    } catch (error) {
      console.error('Error updating waste collection date:', error); // Log error
    }
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
    ]).filter(([_, users]) => users.length > 0) // Filter out cities with no matching users
  );

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}

      {/* Main Content */}
      <div className="main-content">
        <h1 style={{ fontWeight: 'bold' }}>Schedule Date</h1>
            
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name or Email or City"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', padding: '10px', width: '30%', marginLeft:'800px', marginTop:'-100px'  }}
        />

        {/* Users Table by City */}
        {Object.entries(filteredUsersByCity).map(([city, users]) => (
          <div key={city} style={{ marginBottom: '20px' }}>
            <h2>{city}</h2> <br />
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
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.wasteCollectionDate || 'N/A'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <button onClick={() => handleUpdateDate(user._id)} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius:'15px', backgroundColor: 'rgba(60, 247, 122, 0.9)' }}>
                        Update Date
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
<br /><br /><br />
        {/* Modal for updating date */}
        <UpdateDateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUpdate={updateWasteCollectionDate}
            userId={selectedUserId} // Pass the selectedUserId here
        />

      </div>
    </div>
  );
}

export default DateShedule;

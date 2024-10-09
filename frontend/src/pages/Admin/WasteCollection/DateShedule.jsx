import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import UpdateDateModal from './UpdateDateModal';
import './DateShedule.css';



function DateShedule() {
  const [usersByCity, setUsersByCity] = useState({});
  const [cities, setCities] = useState([]); // List of cities to fetch users for
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch the list of cities
  const fetchCities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Fetch users data for each city
  const fetchUsersByCity = async (city) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/city/${city}/door-to-door`);
      return { [city]: response.data };
    } catch (error) {
      console.error(`Error fetching users for city ${city}:`, error);
      return { [city]: [] }; // Return empty array in case of error
    }
  };

  // Memoized version of fetchAllUsers to avoid recreation on each render
  const fetchAllUsers = useCallback(async () => {
    const usersByCityData = {};
    for (const city of cities) {
      const cityUsers = await fetchUsersByCity(city);
      Object.assign(usersByCityData, cityUsers);
    }
    setUsersByCity(usersByCityData);
  }, [cities]); // Only re-create if cities change

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      fetchAllUsers(); // Calls memoized fetchAllUsers
    }
  }, [cities, fetchAllUsers]);

  // Handle update date action
  const handleUpdateDate = (_id) => {
    setSelectedUserId(_id);
    setIsModalOpen(true);
  };

  const updateWasteCollectionDate = async (selectedDay) => {
    console.log(`Update date for user ID: ${selectedUserId} to ${selectedDay}`);
    
    try {
      const response = await axios.put(`http://localhost:8000/api/users/${selectedUserId}/waste-collection-date`, {
        wasteCollectionDate: selectedDay,
      });

      console.log(response.data);
      fetchAllUsers(); // Refresh the user list after updating
    } catch (error) {
      console.error('Error updating waste collection date:', error);
    }
  };

  // Function to view location on map
  const viewLocationOnMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
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
          style={{ marginBottom: '20px', padding: '10px', width: '30%', marginLeft:'800px', marginTop:'-100px' }}
        />

        {/* Users Table by City */}
        {Object.entries(filteredUsersByCity).map(([city, users]) => (
          <div key={city} style={{ marginBottom: '20px', paddingLeft:'20px' }}>
            <h2> {city}</h2> <br />
            <table style={{ width: '100%', border: '1px solid #ddd', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{color:'white'}}>
                  <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'darkcyan' }}>User ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'darkcyan' }}>Name</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'darkcyan' }}>Email</th>
                  {/* <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'darkcyan' }}>Location</th> */}
                  <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'darkcyan' }}>Waste Collection Date</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'darkcyan' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{backgroundColor:'#b3b3b3f8f9f'}}>
                {users.map(user => (
                  <tr key={user.userId}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.userId}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.firstName} {user.lastName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.city}</td> */}
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.wasteCollectionDate || 'N/A'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <center>
                      <button className='updateButton' onClick={() => handleUpdateDate(user._id)} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius:'15px', backgroundColor: 'rgba(60, 247, 122, 0.9)' }}>
                        Update Date
                      </button>
                      <button className='locationButton' onClick={() => viewLocationOnMap(user.location.latitude, user.location.longitude)} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius:'15px', backgroundColor: 'rgba(60, 140, 247, 0.9)', marginLeft: '10px' }}>
                        View Location
                      </button>
                      </center>
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

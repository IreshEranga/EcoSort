import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './RouteShedule.css';

function RouteShedule() {
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]); 
  const [groupedUsers, setGroupedUsers] = useState({}); 
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch users and bins from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/bins/bins/all');
        const data = await response.json();
        setUsers(data); 
      } catch (error) {
        console.error('Error fetching users with bins:', error);
      }
    };
    fetchUsers();
  }, []);

  // Group users by city with today's waste collection date
  useEffect(() => {
    const today = formatDate(currentDateTime).toLowerCase(); 
    const filteredUsers = users.filter(user => user.wasteCollectionDate && user.wasteCollectionDate.toLowerCase() === today);

    const grouped = filteredUsers.reduce((acc, user) => {
      acc[user.city] = acc[user.city] || [];
      acc[user.city].push(user);
      return acc;
    }, {});

    setGroupedUsers(grouped); 
  }, [users, currentDateTime]);

  // Format the current date and time
  const formatDate = (date) => {
    const options = { weekday: 'long' }; 
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  // Handle button clicks for navigation
  const handleNavigation = () => {
    navigate('/admindashboard/collection-routine/dateShedule');
  };

  const handleNavigationRoutes = () => {
    navigate('/admindashboard/displayRoutes');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> 

      <div className="main-content" style={{ backgroundColor: 'white' }}>
        <div className="date-time-container" style={dateTimeStyles}>
          <div className="current-date" style={dateStyles}>{formatDate(currentDateTime)}</div>
          <div className="current-time" style={timeStyles}>{formatTime(currentDateTime)}</div>
        </div>

        <button onClick={handleNavigationRoutes} style={buttonStylesRoutes}>
          Routes
        </button>

        <button onClick={handleNavigation} style={buttonStyles}>
          Schedule Dates
        </button>

        <h1 style={{marginTop:'5px'}}>User Schedule For {formatDate(currentDateTime)}</h1>
        <hr style={{color:'green'}}/>

        {/* Display Users and Their Bins Grouped by City */}
        <div>
          {Object.entries(groupedUsers).length > 0 ? (
            Object.entries(groupedUsers).map(([city, users]) => (
              <div key={city}>
                <h2>{city}</h2>
                <table style={tableStyles}>
                  <thead >
                    <tr style={{border:'1px solid black'}}>
                      <th style={{border:'1px solid black'}}>User ID</th>
                      <th style={{border:'1px solid black'}}>Name</th>
                      {/* <th style={{border:'1px solid black'}}>Last Name</th> */}
                      <th style={{border:'1px solid black'}}>Email</th>
                      {/* <th style={{border:'1px solid black'}}>Mobile</th> */}
                      <th style={{border:'1px solid black'}}>Address</th>
                      {/* <th style={{border:'1px solid black'}}>Waste Collection Date</th> */}
                      <th style={{border:'1px solid black'}}>Bins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.userId} className={`table-row ${index % 2 === 0 ? 'rowEven' : 'rowOdd'}`}>
                        <td style={{border:'1px solid black'}}>{user.userId}</td>
                        <td style={{border:'1px solid black'}}>{user.name}</td>
                        {/* <td style={{border:'1px solid black'}}>{user.name.split(' ')[1]}</td> */}
                        <td style={{border:'1px solid black'}}>{user.email}</td>
                        {/* <td style={{border:'1px solid black'}}>{user.mobile}</td> */}
                        <td style={{border:'1px solid black'}}>{user.address}</td>
                        {/* <td style={{border:'1px solid black'}}>{user.wasteCollectionDate}</td> */}
                        <td style={{border:'1px solid black'}}>
                          <table style={innerTableStyles}>
                            <thead>
                              <tr style={{border:'1px solid black'}}>
                                <th style={{border:'1px solid black'}}>Bin ID</th>
                                <th style={{border:'1px solid black'}}>Type</th>
                                <th style={{border:'1px solid black'}}>Percentage</th>
                                <th style={{border:'1px solid black'}}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.bins.map((bin, binIndex) => (
                                <tr key={bin.binId} className={`table-row ${binIndex % 2 === 0 ? 'rowEven' : 'rowOdd'}`}>
                                  <td style={{border:'1px solid black'}}>{bin.binId}</td>
                                  <td style={{border:'1px solid black'}}>{bin.type}</td>
                                  <td style={{border:'1px solid black'}}>{bin.percentage}%</td>
                                  <td style={{border:'1px solid black'}}>{bin.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No users scheduled for collection today.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// CSS styles
const buttonStyles = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const buttonStylesRoutes = {
  position: 'absolute',
  top: '20px',
  left: '300px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const dateTimeStyles = {
  marginTop: '-10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: '1.2rem',
  color: '#333',
};

const dateStyles = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const timeStyles = {
  fontSize: '1.8rem',
  fontWeight: 'normal',
  color: '#007bff',
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '20px 0',
  border: '1px solid black', // Add border
};

const innerTableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px',
  border: '1px solid black', // Add border for inner table
};

const tableRowStyles = {
  border: '1px solid black', // Add border for table rows
};

export default RouteShedule;

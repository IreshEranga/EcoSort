import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './RouteShedule.css';


function RouteShedule() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [users, setUsers] = useState([]); // State to hold all users
  const [groupedUsers, setGroupedUsers] = useState({}); // State to hold users grouped by city
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Function to update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, []);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users');
        const data = await response.json();
        setUsers(data); // Set users from API response
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Group users by city with today's waste collection date
  useEffect(() => {
    const today = formatDate(currentDateTime).toLowerCase(); // Get today's date in the format used in the DB
    const filteredUsers = users.filter(user => user.wasteCollectionDate && user.wasteCollectionDate.toLowerCase() === today);

    const grouped = filteredUsers.reduce((acc, user) => {
      acc[user.city] = acc[user.city] || [];
      acc[user.city].push(user);
      return acc;
    }, {});

    setGroupedUsers(grouped); // Set grouped users
  }, [users, currentDateTime]); // Re-run when users or current date/time changes

  // Format the current date and time
  const formatDate = (date) => {
    const options = { weekday: 'long' }; // Only get the day of the week
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  // Function to handle button click and navigate to another page
  const handleNavigation = () => {
    navigate('/admindashboard/collection-routine/dateShedule');
  };

  const handleNavigationRoutes = () => {
    navigate('/admindashboard/displayRoutes');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}

      {/* Main Content */}
      <div className="main-content" style={{ backgroundColor: 'white' }}>
        

        {/* Display Current Date and Time */}
        <div className="date-time-container" style={dateTimeStyles}>
          <div className="current-date" style={dateStyles}>{formatDate(currentDateTime)}</div>
          <div className="current-time" style={timeStyles}>{formatTime(currentDateTime)}</div>
        </div>

        {/* Button to navigate, positioned at the top right */}
        <button 
          onClick={handleNavigationRoutes} 
          style={buttonStylesRoutes}
        >
          Routes
        </button>

        <button 
          onClick={handleNavigation} 
          style={buttonStyles}
        >
          Schedule Dates
        </button>

        {/* Display Users in Tables Grouped by City */}
        <div>
          {Object.entries(groupedUsers).length > 0 ? (
            Object.entries(groupedUsers).map(([city, users]) => (
              <div key={city}>
                <h2>{city}</h2>
                <table style={tableStyles}>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id} className={`table-row ${index % 2 === 0 ? 'rowEven' : 'rowOdd'}`}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.address}</td>
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

// CSS styles for the button and date/time display
const buttonStyles = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
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
  cursor: 'pointer'
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
};

/*
const rowEvenStyles = {
  backgroundColor: '#f2f2f2', // Light grey for even rows
};

const rowOddStyles = {
  backgroundColor: '#ffffff', // White for odd rows
};

// Add hover effect
const hoverStyles = {
  backgroundColor: '#e0e0e0', // Light grey on hover
};
*/

export default RouteShedule;

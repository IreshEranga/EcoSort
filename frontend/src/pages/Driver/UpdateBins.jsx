import React, { useState, useEffect } from 'react';
import DriverNavBar from './DriverNavBar';
import { useNavigate } from 'react-router-dom';

function UpdateBins() {
  const Driver = JSON.parse(localStorage.getItem('driver'));
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [groupedUsers, setGroupedUsers] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    const today = formatDate(currentDateTime).toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.wasteCollectionDate &&
        user.wasteCollectionDate.toLowerCase() === today &&
        user.city === Driver.city
    );

    const grouped = filteredUsers.reduce((acc, user) => {
      acc[user.city] = acc[user.city] || [];
      acc[user.city].push(user);
      return acc;
    }, {});

    setGroupedUsers(grouped);
  }, [users, currentDateTime]);

  const formatDate = (date) => {
    const options = { weekday: 'long' };
    return date.toLocaleDateString(undefined, options);
  };

  

  const handleUpdateBinStatus = async (binId) => {
    try {
      await fetch(`http://localhost:8000/api/bins/bins/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Collected' }),
      });
      alert(`Bin ${binId} status updated to Collected!`);
    } catch (error) {
      console.error('Error updating bin status:', error);
    }
  };

  const filteredGroupedUsers = Object.entries(groupedUsers).map(([city, users]) => [
    city,
    users.filter((user) =>
      user.userID ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  ]);

  return (
    <div className='driver-home'>
      <DriverNavBar />
      <div className="driverContainer" style={{ marginTop: '150px' }}>
        <h1>Driver Update Bins</h1>
        <input
          type="text"
          placeholder="Search by user Id, name, email, city, address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />

        <div>
          {filteredGroupedUsers.length > 0 ? (
            filteredGroupedUsers.map(([city, users]) => (
              users.length > 0 && (
                <div key={city}>
                  <h2>{city}</h2>
                  <br />
                  <table style={tableStyles}>
                    <thead>
                      <tr style={{ border: '1px solid black' }}>
                        <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>User ID</th>
                        <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Name</th>
                        <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Email</th>
                        <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Address</th>
                        <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Bins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.userId} className={`table-row ${index % 2 === 0 ? 'rowEven' : 'rowOdd'}`}>
                          <td style={{ border: '1px solid black', width: '20px' }}>{user.userId}</td>
                          <td style={{ border: '1px solid black', width: '200px' }}>{user.name}</td>
                          <td style={{ border: '1px solid black', width: '200px' }}>{user.email}</td>
                          <td style={{ border: '1px solid black' }}>{user.address}</td>
                          <td style={{ border: '1px solid black', width: '50%' }}>
                            <table style={innerTableStyles}>
                              <thead>
                                <tr style={{ border: '1px solid black' }}>
                                  <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Bin ID</th>
                                  <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Type</th>
                                  <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Percentage</th>
                                  <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Status</th>
                                  <th style={{ border: '1px solid black', backgroundColor: 'darkcyan', color: 'white' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {user.bins.map((bin, binIndex) => (
                                  <tr
                                    key={bin.binId}
                                    className={`table-row ${binIndex % 2 === 0 ? 'rowEven' : 'rowOdd'}`}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                  >
                                    <td style={{ border: '1px solid black' }}>{bin.binId}</td>
                                    <td style={{ border: '1px solid black' }}>{bin.type}</td>
                                    <td style={{ border: '1px solid black' }}>{bin.percentage}%</td>
                                    <td style={{ border: '1px solid black' }}>{bin.status}</td>
                                    <td style={{ border: '1px solid black' }}>
                                      <button
                                        onClick={() => handleUpdateBinStatus(bin.binId)}
                                        style={buttonStyle}
                                      >
                                        Update to Collected
                                      </button>
                                    </td>
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
              )
            ))
          ) : (
            <p>No users scheduled for collection today.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
};

const innerTableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
};

const searchInputStyle = {
  width: '400px',
  padding: '5px',
  marginBottom: '10px',
  borderRadius: '4px',
};

const buttonStyle = {
  backgroundColor: 'darkcyan',
  color: 'white',
  padding: '5px 10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default UpdateBins;

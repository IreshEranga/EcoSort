import React, { useState, useEffect } from 'react';
import DriverNavBar from './DriverNavBar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      //toast.success(`Bin ${binId} status updated to Collected!`); 
      toast.success(`Bin ${binId} status updated to Collected!`, {
        position: "top-center",
        autoClose: 5000, 
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });// Success toast
      setTimeout(() => {
        window.location.reload(); // Refresh page after successful update
      }, 1000);
    } catch (error) {
      toast.error('Error updating bin status'); // Error toast
      console.error('Error updating bin status:', error);
    }
  };

  const filteredGroupedUsers = Object.entries(groupedUsers).map(([city, users]) => [
    city,
    users.filter((user) =>
      user.bins.some((bin) => bin.binId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.userId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <div style={{display:'flex', gap:500}}>
          <h1>Driver Update Bins</h1>
          <input
            type="text"
            placeholder="Search by binId, user Id, name, email, city, address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>

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
                        <th style={headerStyle}>User ID</th>
                        <th style={headerStyle}>Name</th>
                        <th style={headerStyle}>Email</th>
                        <th style={headerStyle}>Address</th>
                        <th style={headerStyle}>Bins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.userId} className={`table-row ${index % 2 === 0 ? 'rowEven' : 'rowOdd'}`}>
                          <td style={cellStyle}>{user.userId}</td>
                          <td style={cellStyle}>{user.name}</td>
                          <td style={cellStyle}>{user.email}</td>
                          <td style={cellStyle1}>{user.address}</td>
                          <td style={cellStyle}>
                            <table style={innerTableStyles}>
                              <thead>
                                <tr>
                                  <th style={innerHeaderStyle}>Bin ID</th>
                                  <th style={innerHeaderStyle}>Type</th>
                                  <th style={innerHeaderStyle}>Percentage</th>
                                  <th style={innerHeaderStyle}>Status</th>
                                  <th style={innerHeaderStyle}>Action</th>
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
                                    <td style={cellStyle}>{bin.binId}</td>
                                    <td style={cellStyle}>{bin.type}</td>
                                    <td style={cellStyle}>{bin.percentage}%</td>
                                    <td style={cellStyle}>{bin.status}</td>
                                    <td style={cellStyle}>
                                      <button
                                        onClick={() => handleUpdateBinStatus(bin.binId)}
                                        style={buttonStyleUpdateBin}
                                        disabled={bin.status === 'Collected'} // Disable button if status is 'Collected'
                                      >
                                        {bin.status === 'Collected' ? 'Collected' : 'Update to Collected'}
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
      <ToastContainer />
    </div>
  );
}

const tableStyles = {
  width: '110%',
  borderCollapse: 'collapse',
  
};

const innerTableStyles = {
  width: '90%',
  borderCollapse: 'collapse',
  padding:'10px',
  marginTop:'20px',
  marginLeft:'20px',
};

const searchInputStyle = {
  width: '400px',
  padding: '5px',
  marginBottom: '10px',
  borderRadius: '4px',
};

const buttonStyleUpdateBin = {
  backgroundColor: '#00ff84',
  color: 'black',
  padding: '5px 10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const headerStyle = {
  border: '1px solid black',
  backgroundColor: 'darkcyan',
  color: 'white',
};

const innerHeaderStyle = {
  border: '1px solid black',
  backgroundColor: 'darkcyan',
  color: 'white',
};

const cellStyle = {
  border: '1px solid black',
  padding: '5px',
};

const cellStyle1 = {
  border: '1px solid black',
  padding: '5px',
  width:'200px'
};
export default UpdateBins;

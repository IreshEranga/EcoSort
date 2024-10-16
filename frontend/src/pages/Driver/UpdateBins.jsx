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
      toast.success(`Bin ${binId} status updated to Collected!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    } catch (error) {
      toast.error('Error updating bin status');
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
        <div className="title-search-container">
          <h1>Driver Update Bins</h1>
          <input
            type="text"
            placeholder="Search by binId, user Id, name, email, city, address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div>
          {filteredGroupedUsers.length > 0 ? (
            filteredGroupedUsers.map(([city, users]) => (
              users.length > 0 && (
                <div key={city}>
                  <h2>{city}</h2>
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th style={{backgroundColor:'darkcyan', color:'white'}}>User ID</th>
                        <th style={{backgroundColor:'darkcyan', color:'white'}}>Name</th>
                        <th style={{backgroundColor:'darkcyan', color:'white'}}>Email</th>
                        <th style={{backgroundColor:'darkcyan', color:'white'}}>Address</th>
                        <th style={{backgroundColor:'darkcyan', color:'white'}}>Bins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.userId}>
                          <td>{user.userId}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.address}</td>
                          <td>
                            <table className="inner-table">
                              <thead>
                                <tr onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#23f682'}>
                                  <th style={{backgroundColor:'darkcyan', color:'white'}}>Bin ID</th>
                                  <th style={{backgroundColor:'darkcyan', color:'white'}}>Type</th>
                                  <th style={{backgroundColor:'darkcyan', color:'white'}}>Percentage</th>
                                  <th style={{backgroundColor:'darkcyan', color:'white'}}>Status</th>
                                  <th style={{backgroundColor:'darkcyan', color:'white'}}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {user.bins.map((bin, binIndex) => (
                                  <tr key={bin.binId}
                                  className={`table-row ${binIndex % 2 === 0 ? 'rowEven' : 'rowOdd'}`}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                                    <td>{bin.binId}</td>
                                    <td>{bin.type}</td>
                                    <td>{bin.percentage}%</td>
                                    <td>{bin.status}</td>
                                    <td>
                                      <button
                                        onClick={() => handleUpdateBinStatus(bin.binId)}
                                        disabled={bin.status === 'Collected'}
                                        className="update-btn"
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

// Styles using media queries for responsive design
const styles = `
  .driverContainer {
    padding: 10px;
  }

  .title-search-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 5px;
    margin-top: 10px;
    border-radius: 4px;
  }

  .responsive-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .responsive-table th, .responsive-table td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }

  .inner-table {
    width: 100%;
    border-collapse: collapse;
  }

  .inner-table th, .inner-table td {
    border: 1px solid black;
    padding: 5px;
  }

  .update-btn {
    background-color: #00ff84;
    color: black;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .responsive-table, .inner-table {
      font-size: 14px;
    }

    .responsive-table th, .responsive-table td, 
    .inner-table th, .inner-table td {
      padding: 6px;
    }
  }

  @media (max-width: 480px) {
    .title-search-container {
      flex-direction: column;
      gap: 10px;
    }

    .search-input {
      width: 100%;
    }

    .responsive-table th, .responsive-table td {
      display: block;
      width: 100%;
    }

    .responsive-table th, .responsive-table td {
      text-align: right;
    }

    .responsive-table th::after, 
    .responsive-table td::after {
      content: ": ";
    }

    .responsive-table th {
      text-align: left;
    }

    .inner-table th, .inner-table td {
      text-align: center;
    }
  }
`;

// Adding styles to the document head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UpdateBins;

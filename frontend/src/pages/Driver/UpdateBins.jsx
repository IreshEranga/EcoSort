import React, { useState, useEffect } from 'react';
import DriverNavBar from './DriverNavBar';
//import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import * as loadingAnimation from '../../assets/loadingAnimation.json'; // Import Lottie animation

function UpdateBins() {
  const Driver = JSON.parse(localStorage.getItem('driver'));
  //const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [groupedUsers, setGroupedUsers] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Set loading before fetching
        const response = await fetch('http://localhost:8000/api/bins/bins/all');
        const data = await response.json();
        setUsers(data);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching users with bins:', error);
        setLoading(false); // Set loading to false if there's an error
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

  // Lottie animation configuration
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className='driver-home'>
      <DriverNavBar />
      {loading ? ( // Display Lottie animation while loading
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      ) : (
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
                          <tr key={user.userId} className="table-row">
                            <td>{user.userId}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>
                              <table className="inner-table">
                                <thead>
                                  <tr>
                                    <th style={{backgroundColor:'darkcyan', color:'white'}}>Bin ID</th>
                                    <th style={{backgroundColor:'darkcyan', color:'white'}}>Type</th>
                                    <th style={{backgroundColor:'darkcyan', color:'white'}}>Percentage</th>
                                    <th style={{backgroundColor:'darkcyan', color:'white'}}>Status</th>
                                    <th style={{backgroundColor:'darkcyan', color:'white'}}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {user.bins.map((bin, binIndex) => (
                                    <tr key={bin.binId} className="table-row-inner">
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
      )}
      <ToastContainer />
    </div>
  );
}

// Styles for hover effects
const styles = `
  .responsive-table th, .responsive-table td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }

  .table-row:hover {
    background-color: #dcfff5;
  }
    .table-row-inner:hover{
    background-color: #d3f0fd;
    }

  .update-btn {
    background-color: #00ff84;
    color: black;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .update-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Adding styles to the document head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UpdateBins;

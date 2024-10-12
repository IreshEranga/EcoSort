import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import './DisplayRoutes.css';

function DisplayRoutes() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get the current day of the week
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const today = getCurrentDay();
        const filteredRoutes = response.data.filter(route => route.date === today);
        setRoutes(filteredRoutes);
        setFilteredRoutes(filteredRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
    fetchRoutes();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const lowerCaseQuery = e.target.value.toLowerCase();
    const filtered = routes.filter(
      (route) =>
        route.routeName.toLowerCase().includes(lowerCaseQuery) ||
        route.city.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredRoutes(filtered);
  };

  // Group routes by city
  const groupedRoutes = filteredRoutes.reduce((acc, route) => {
    if (!acc[route.city]) acc[route.city] = [];
    acc[route.city].push(route);
    return acc;
  }, {});

  // Fetch available drivers for a selected city
  const fetchAvailableDrivers = async (city) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/driver/drivers/available/${city}`);
      setAvailableDrivers(response.data);
    } catch (error) {
      console.error('Error fetching available drivers:', error);
    }
  };

  // Open the modal to assign a driver
  const handleAssignDriver = (route) => {
    setSelectedRoute(route);
    fetchAvailableDrivers(route.city);
    setIsModalOpen(true);
  };

  // Handle driver assignment and update driver status
  const handleDriverAssignment = async () => {
    if (!selectedDriver) return;

    try {
      // Assign driver to the route
      await axios.put(`http://localhost:8000/router/routes/${selectedRoute._id}`, {
        assignedDriver: selectedDriver
      });

      // Update driver status to 'onRide'
      await axios.put(`http://localhost:8000/api/driver/drivers/${selectedDriver}`, {
        status: 'onRide'
      });

      setIsModalOpen(false);

      // Optionally refresh the routes after assignment
      // fetchRoutes(); // Uncomment this if you want to refresh the route list after assignment
    } catch (error) {
      console.error('Error assigning driver or updating status:', error);
    }
  };

  const handleViewRoute = (route) => {
    navigate('/view-route', { state: { route } });
  };

  const handleCreateRoute = () => {
    navigate('/create-route');
  };

  return (
    <div className='admin-dashboard' style={{ backgroundColor: 'white' }}>
      <AdminSidebar />
      <div className="main-content" style={{ backgroundColor: 'white' }}>
        <button className="create-route-btn" onClick={handleCreateRoute}>
          Create Route
        </button>

        <h1> Routes for {getCurrentDay()}</h1>

        <input
          type="text"
          className="search-bar"
          placeholder="Search by route name or city"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {Object.keys(groupedRoutes).length > 0 ? (
          Object.keys(groupedRoutes).map((city) => (
            <div key={city} className="city-section">
              <h2>{city}</h2>
              <table className="routes-table">
                <thead>
                  <tr>
                    <th>Route Name</th>
                    <th>Date</th>
                    <th>Stops</th>
                    <th>Action</th>
                    <th>Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedRoutes[city].map((route) => (
                    <tr key={route._id}>
                      <td style={{ width: '250px' }}>{route.routeName}</td>
                      <td>{route.date}</td>
                      <td>{route.routes.length} Stops</td>
                      <td>
                        <button onClick={() => handleViewRoute(route)}>View Route</button>
                        <button
                          style={{ marginLeft: '20px' }}
                          onClick={() => handleAssignDriver(route)}
                        >
                          Assign Rider
                        </button>
                      </td>
                      <td>{route.assignedDriver ? route.assignedDriver.name : 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No routes scheduled for today</p>
        )}

        {/* Modal for assigning a driver */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Assign Driver to {selectedRoute.routeName}</h2>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">Select a driver</option>
                {availableDrivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
              </select>
              <button onClick={handleDriverAssignment}>Assign</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayRoutes;

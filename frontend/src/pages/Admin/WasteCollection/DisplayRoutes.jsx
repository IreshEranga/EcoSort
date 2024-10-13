import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import './DisplayRoutes.css';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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

  // Fetch routes function
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

  useEffect(() => {
    fetchRoutes(); // Fetch routes on component mount
  });

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

  /*
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

       // Fetch driver details to get their email
    const driverResponse = await axios.get(`http://localhost:8000/api/driver/drivers/${selectedDriver}`);
    const driverEmail = driverResponse.data.email; // Assuming the driver object has an email field

    // Send email to driver
    await axios.post('http://localhost:8000/email/api/send-assignment-email', {
      driverEmail,
      routeName: selectedRoute.routeName,
    });

      setIsModalOpen(false);

      // Refresh the routes after assignment
      fetchRoutes(); // Now this will work
    } catch (error) {
      console.error('Error assigning driver or updating status:', error);
    }
  };
  */
/*
  const handleDriverAssignment = async () => {
    if (!selectedDriver) return;
  
    try {
      // Assign driver to the route
      await axios.post('http://localhost:8000/api/driver/assignDriver', {
        routeId: selectedRoute._id,
        driverId: selectedDriver,
      });
      toast.success('Driver assigned successfully!', {
        position: toast.POSITION.TOP_RIGHT
      });
      setIsModalOpen(false);
      fetchRoutes(); // Refresh the routes after assignment
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };
  */

  const handleDriverAssignment = async () => {
    if (!selectedDriver) return;
  
    try {
      // Assign driver to the route
      await axios.post('http://localhost:8000/api/driver/assignDriver', {
        routeId: selectedRoute._id,
        driverId: selectedDriver,
      });
      
      // Show success toast
      toast.success('Driver assigned successfully!', {
        position: 'top-right', // Use string instead of toast.POSITION
      });
      
  
      // Close modal
      setIsModalOpen(false);
      
      // Refresh the routes after assignment
      fetchRoutes(); 
    } catch (error) {
      console.error('Error assigning driver:', error);
      
      // Show error toast if assignment fails
      toast.error('Failed to assign driver. Please try again.', {
        position: toast.POSITION.TOP_RIGHT
      });
      
      // Optionally close the modal or keep it open depending on your preference
      // setIsModalOpen(false); // Uncomment if you want to close the modal on error
    }
  };
  

  const handleViewRoute = (route) => {
    navigate('/view-route', { state: { route } });
  };

  const handleCreateRoute = () => {
    navigate('/admindashboard/createRoute');
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
                      <td style={{ width: '150px' }}>{route.date}</td>
                      <td style={{ width: '150px' }}>{route.routes.length} Stops</td>
                      <td style={{width:'300px'}}>
                        <button onClick={() => handleViewRoute(route)}>View Route</button>
                        <button
                          style={{ marginLeft: '20px' }}
                          onClick={() => handleAssignDriver(route)}
                        >
                          Assign Rider
                        </button>
                      </td>
                      <td style={{ width: '250px' }}>{route.assignedDriver ? route.assignedDriver.name : 'Unassigned'}</td>
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
      <ToastContainer />
    </div>
  );
}

export default DisplayRoutes;

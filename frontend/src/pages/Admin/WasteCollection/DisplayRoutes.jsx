import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import './DisplayRoutes.css';

function DisplayRoutes() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

        // Filter routes based on today's day
        const filteredRoutes = response.data.filter(route => route.date === today);
        setRoutes(filteredRoutes);
        setFilteredRoutes(filteredRoutes); // Set initial filtered routes to the full list
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

    // Filter routes based on search query (match route name or city)
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

  const handleViewRoute = (route) => {
    navigate('/view-route', { state: { route } }); // Pass the full route as state
  };

  const handleCreateRoute = () => {
    navigate('/create-route'); // Navigate to the route creation page
  };

  return (
    <div className='admin-dashboard' style={{backgroundColor:'white'}}>
      <AdminSidebar />
      <div className="main-content" style={{backgroundColor:'white'}}>
        {/* Create Route Button */}
        <button className="create-route-btn" onClick={handleCreateRoute}>
          Create Route
        </button>

        <h1> Routes for {getCurrentDay()}</h1> {/* Show current day */}

        {/* Search Bar */}
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
              <h2>{city}</h2> {/* Display city name */}
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
                      <td style={{width:'250px'}}>{route.routeName}</td>
                      <td>{route.date}</td>
                      <td>{route.routes.length} Stops</td>
                      <td>
                        <button onClick={() => handleViewRoute(route)}>View Route</button>
                        <button style={{marginLeft:'20px', marginRight:'-150px'}}>Assign Rider</button>
                      </td>
                      <td>{route.driver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No routes scheduled for today</p>
        )}
      </div>
    </div>
  );
}

export default DisplayRoutes;

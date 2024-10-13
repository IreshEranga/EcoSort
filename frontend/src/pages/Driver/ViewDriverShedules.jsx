import React, { useEffect, useState } from 'react';
import DriverNavBar from './DriverNavBar';
import './ViewDriverShedule.css'; // Make sure the filename matches the component
import axios from 'axios';

function ViewDriverSchedules() {
  const [routes, setRoutes] = useState([]);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };
  const today = getCurrentDay();


  // Get the driver information from local storage
  const driver = JSON.parse(localStorage.getItem('driver')); // Parse the driver object
  const DriverId = driver ? driver.id : null; // Check if driver exists before accessing _id

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const allRoutes = response.data;
        console.log(allRoutes);

        // Filter routes for the logged-in driver
        const filteredRoutes = allRoutes.filter(route => 
          route.assignedDriver && route.assignedDriver._id === DriverId && route.date === today
        );

        setRoutes(filteredRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    if (DriverId) { // Ensure DriverId is valid before fetching
      fetchRoutes();
    }
  }, [DriverId]);

  return (
    <div className='driver-home'>
      <DriverNavBar />
      <div className="driverschedule-container">
        <h1>Your Assigned Routes</h1>
        {routes.length === 0 ? (
          <p>No routes assigned to you.</p>
        ) : (
          <ul className="route-list">
            {routes.map(route => (
              <li key={route._id} className="route-item">
                <h2>{route.routeName}</h2>
                <p>Date: {route.date}</p>
                <p>City: {route.city}</p>
                <div className="route-details">
                  <h3>Route Stops:</h3>
                  {route.routes.length > 0 ? (
                    <ul>
                      {route.routes.map((stop, index) => (
                        <li key={index}> {/* Use index if no unique ID for stops */}
                          Lat: {stop.lat}, Lng: {stop.lng}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No stops available for this route.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ViewDriverSchedules;

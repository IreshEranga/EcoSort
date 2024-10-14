import React, { useEffect, useState } from 'react';
import DriverNavBar from './DriverNavBar';
import './ViewDriverShedule.css';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

function ViewDriverSchedules() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = { lat: 7.50089752317855, lng: 80.34802588329134 };

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  const today = getCurrentDay();

  const driver = JSON.parse(localStorage.getItem('driver'));
  const DriverId = driver ? driver.id : null;

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const allRoutes = response.data;

        const filteredRoutes = allRoutes.filter(route =>
          route.assignedDriver && route.assignedDriver._id === DriverId && route.date === today
        );

        setRoutes(filteredRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    if (DriverId) {
      fetchRoutes();
    }
  }, [DriverId]);

  // Mark the route as completed and the driver as available
  const handleMarkAsCompleted = async (routeId) => {
    try {
      // Update the driver status to "available"
      await axios.put(`http://localhost:8000/api/driver/drivers/${DriverId}`, { status: 'available' });

      // Update the route status to "completed"
      await axios.put(`http://localhost:8000/router/routes/${routeId}`, { status: 'Completed' });

      // Fetch updated routes after marking as completed
      setRoutes(prevRoutes => prevRoutes.filter(route => route._id !== routeId));
      alert('Route marked as completed and driver set to available.');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update the status.');
    }
  };

  return (
    <div className='driver-home'>
      <DriverNavBar />
      <div className="driverschedule-container">
        <h1>Your Assigned Routes for Today</h1>
        {routes.length === 0 ? (
          <p>No routes assigned to you.</p>
        ) : (
          <ul className="route-list">
            {routes.map(route => (
              <li key={route._id} className="route-item">
                <h2>{route.routeName}</h2>
                <p>Date: {route.date}</p>
                <p>City: {route.city}</p>
                <p>Status: {route.status}</p>
                <p>Total Stops: {route.routes.length}</p>
                <div className="route-details">
                  <h3>Route Stops:</h3>
                  {route.routes.length > 0 ? (
                    <ul>
                      {route.routes.map((stop, index) => (
                        <li key={stop._id}>
                          Lat: {stop.lat}, Lng: {stop.lng}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No stops available for this route.</p>
                  )}

                  <button
                    className="view-route-btn"
                    onClick={() => setSelectedRoute(route)}
                  >
                    View Stops on Map
                  </button>

                  

                  {/* Mark as Completed Button */}
                  {/* <button
                    className="mark-completed-btn"
                    onClick={() => handleMarkAsCompleted(route._id)}
                  >
                    Mark as Completed
                  </button> */}

                  <button
                    className="mark-completed-btn"
                    onClick={() => handleMarkAsCompleted(route._id)}
                    disabled={route.status === 'Completed'} // Disable if route is completed
                  >
                    {route.status === 'Completed' ? 'Completed' : 'Mark as Completed'}
                  </button>


                  {/* Render Google Map when the "View Stops" button is clicked */}
                  {selectedRoute && selectedRoute._id === route._id && (
                    <LoadScript googleMapsApiKey="AIzaSyC_pYhIJVCAFchZnvhbnE9awl5u_XIoRIg">
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={route.routes.length > 0 ? { lat: route.routes[0].lat, lng: route.routes[0].lng } : defaultCenter}
                        zoom={14}
                        onLoad={() => console.log('Map Loaded')}
                      >
                        {route.routes.map((stop) => (
                          <Marker
                            key={stop._id}
                            position={{ lat: stop.lat, lng: stop.lng }}
                            label={(route.routes.indexOf(stop) + 1).toString()}
                            onLoad={() => console.log('Marker Loaded:', stop.lat, stop.lng)}
                          />
                        ))}
                      </GoogleMap>
                    </LoadScript>
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

/*import React, { useEffect, useState } from 'react';
import DriverNavBar from './DriverNavBar';
import './ViewDriverShedule.css';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

function ViewDriverSchedules() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [specialRequest, setSpecialRequest] = useState([]);

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


  useEffect(()=>{
    const fetchSpecialRequests = async () => {
      try {
        const responseRequests = await axios.get('http://localhost:8000/api/special-requests');
        const allRequests = responseRequests.data;


        const filteredRequests = allRequests.filter(specialRequest =>
          specialRequest.assignedDriver && specialRequest.assignedDriver._id === DriverId && specialRequest.collectStatus === 'Assigned'
        );

        setSpecialRequest(filteredRequests);
        console.log("filtered Requests : ", filteredRequests);

        fetchSpecialRequests();
      }
      catch (error) {
        console.error('Error fetching routes:', error);
      }
    }
  })
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

                  

                 

                  <button
                    className="mark-completed-btn"
                    onClick={() => handleMarkAsCompleted(route._id)}
                    disabled={route.status === 'Completed'} // Disable if route is completed
                  >
                    {route.status === 'Completed' ? 'Completed' : 'Mark as Completed'}
                  </button>


                 
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
*/


/*
import React, { useEffect, useState } from 'react';
import DriverNavBar from './DriverNavBar';
import './ViewDriverShedule.css';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

function ViewDriverSchedules() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [specialRequests, setSpecialRequests] = useState([]);

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

  // Fetch assigned routes
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

  // Fetch special requests
  useEffect(() => {
    const fetchSpecialRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests');
        const allRequests = response.data;

        const filteredRequests = allRequests.filter(specialRequest =>
          specialRequest.assignedDriver && specialRequest.assignedDriver._id === DriverId && specialRequest.collectStatus === 'Assigned'
        );

        setSpecialRequests(filteredRequests);
      } catch (error) {
        console.error('Error fetching special requests:', error);
      }
    };

    if (DriverId) {
      fetchSpecialRequests();
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

                  <button
                    className="mark-completed-btn"
                    onClick={() => handleMarkAsCompleted(route._id)}
                    disabled={route.status === 'Completed'} // Disable if route is completed
                  >
                    {route.status === 'Completed' ? 'Completed' : 'Mark as Completed'}
                  </button>

                  {selectedRoute && selectedRoute._id === route._id && (
                    <LoadScript googleMapsApiKey="AIzaSyC_pYhIJVCAFchZnvhbnE9awl5u_XIoRIg">
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={route.routes.length > 0 ? { lat: route.routes[0].lat, lng: route.routes[0].lng } : defaultCenter}
                        zoom={14}
                      >
                        {route.routes.map((stop) => (
                          <Marker
                            key={stop._id}
                            position={{ lat: stop.lat, lng: stop.lng }}
                            label={(route.routes.indexOf(stop) + 1).toString()}
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

        
        <h1>Your Assigned Special Requests</h1>
        {specialRequests.length === 0 ? (
          <p>No special requests assigned to you.</p>
        ) : (
          <ul className="special-request-list">
            {specialRequests.map(request => (
              <li key={request._id} className="special-request-item">
                <h2>Special Request ID: {request._id}</h2>
                <p>Customer: {request.customerName}</p>
                <p>Date: {request.date}</p>
                <p>City: {request.city}</p>
                <p>Collect Status: {request.collectStatus}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ViewDriverSchedules;


*/















/*


import React, { useEffect, useState, useRef } from 'react';
import DriverNavBar from './DriverNavBar';
import './ViewDriverShedule.css';
import axios from 'axios';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function ViewDriverSchedules() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapRef = useRef(null); // To hold reference to Google Map instance

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

  // Fetch assigned routes
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

  // Fetch special requests
  useEffect(() => {
    const fetchSpecialRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests');
        const allRequests = response.data;

        const filteredRequests = allRequests.filter(specialRequest =>
          specialRequest.assignedDriver && specialRequest.assignedDriver._id === DriverId && specialRequest.collectStatus === 'Assigned'
        );

        setSpecialRequests(filteredRequests);
      } catch (error) {
        console.error('Error fetching special requests:', error);
      }
    };

    if (DriverId) {
      fetchSpecialRequests();
    }
  }, [DriverId]);

  // Create markers with AdvancedMarkerElement
  const createMarker = (location, label = '') => {
    if (mapRef.current && location) {
      new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: mapRef.current,
        title: label,
      });
    }
  };

  // Effect to add marker for selected special request location
  useEffect(() => {
    if (selectedLocation) {
      createMarker(selectedLocation, 'Special Request');
    }
  }, [selectedLocation]);

  // Mark the route as completed and the driver as available
  const handleMarkAsCompleted = async (routeId) => {
    try {
      await axios.put(`http://localhost:8000/api/driver/drivers/${DriverId}`, { status: 'available' });
      await axios.put(`http://localhost:8000/router/routes/${routeId}`, { status: 'Completed' });

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
        {routes.length > 0 ? (
          <>
            <h1>Your Assigned Routes for Today</h1>
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

                    <button
                      className="mark-completed-btn"
                      onClick={() => handleMarkAsCompleted(route._id)}
                      disabled={route.status === 'Completed'}
                    >
                      {route.status === 'Completed' ? 'Completed' : 'Mark as Completed'}
                    </button>

                    {selectedRoute && selectedRoute._id === route._id && (
                      <LoadScript googleMapsApiKey="AIzaSyC_pYhIJVCAFchZnvhbnE9awl5u_XIoRIg">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={route.routes.length > 0 ? { lat: route.routes[0].lat, lng: route.routes[0].lng } : defaultCenter}
                          zoom={14}
                          onLoad={map => (mapRef.current = map)} // Save map instance
                        >
                          {route.routes.map((stop) => (
                            createMarker({ lat: stop.lat, lng: stop.lng }, `Stop ${route.routes.indexOf(stop) + 1}`)
                          ))}
                        </GoogleMap>
                      </LoadScript>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : specialRequests.length > 0 ? (
          <>
            <h1>Your Assigned Special Requests</h1>
            <ul className="special-request-list">
              {specialRequests.map(request => (
                <li key={request._id} className="special-request-item">
                  <h2>Special Request ID: {request.requestId}</h2>
                  <p>Customer: {request.user.firstName} {request.user.lastName}</p>
                  <p>Collect Status: {request.collectStatus}</p>

                  <button
                    className="view-location-btn"
                    onClick={() => setSelectedLocation({ lat: request.user.location.latitude, lng: request.user.location.longitude })}
                  >
                    View Location
                  </button>
                </li>
              ))}
            </ul>

            {selectedLocation && (
              <div className="map-container">
                <LoadScript googleMapsApiKey="AIzaSyC_pYhIJVCAFchZnvhbnE9awl5u_XIoRIg">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={selectedLocation || defaultCenter}
                    zoom={14}
                    onLoad={map => (mapRef.current = map)} // Save map instance
                  >
                    
                    {selectedLocation && createMarker(selectedLocation, 'Special Request Location')}
                  </GoogleMap>
                </LoadScript>
              </div>
            )}
          </>
        ) : (
          <p>No special requests assigned for today.</p>
        )}
      </div>
    </div>
  );
}

export default ViewDriverSchedules;




*/
















/*

import React, { useEffect, useState, useRef } from 'react';
import DriverNavBar from './DriverNavBar';
import './ViewDriverShedule.css';
import axios from 'axios';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function ViewDriverSchedules() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [specialRequests, setSpecialRequests] = useState([]);

  const mapRef = useRef(null); // To hold reference to Google Map instance

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

  // Fetch assigned routes
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

  // Fetch special requests
  useEffect(() => {
    const fetchSpecialRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests');
        const allRequests = response.data;

        const filteredRequests = allRequests.filter(specialRequest =>
          specialRequest.assignedDriver && specialRequest.assignedDriver._id === DriverId && specialRequest.collectStatus === 'Assigned'
        );

        setSpecialRequests(filteredRequests);
      } catch (error) {
        console.error('Error fetching special requests:', error);
      }
    };

    if (DriverId) {
      fetchSpecialRequests();
    }
  }, [DriverId]);

  // Create markers with AdvancedMarkerElement
  const createMarker = (location, label = '') => {
    if (window.google && mapRef.current && location) {
      new window.google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: mapRef.current,
        title: label,
      });
    }
  };

  // Mark the route as completed and the driver as available
  const handleMarkAsCompleted = async (routeId) => {
    try {
      await axios.put(`http://localhost:8000/api/driver/drivers/${DriverId}`, { status: 'available' });
      await axios.put(`http://localhost:8000/router/routes/${routeId}`, { status: 'Completed' });

      setRoutes(prevRoutes => prevRoutes.filter(route => route._id !== routeId));
      alert('Route marked as completed and driver set to available.');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update the status.');
    }
  };

  // Mark the special request as completed and the driver as available
const handleMarkAsCompletedSpecialRequest = async (specialRequestId) => {
  try {
    // Update the special request's collectStatus to "Completed"
    await axios.patch(`http://localhost:8000/api/special-requests/${specialRequestId}`, {
      collectStatus: 'Completed'
    });

    // Update the driver's status to "available"
    await axios.put(`http://localhost:8000/api/driver/drivers/${DriverId}`, {
      status: 'available'
    });

    // Filter out the completed special request from the list
    setSpecialRequests(prevRequests => prevRequests.filter(request => request._id !== specialRequestId));

    alert('Special request marked as completed and driver status updated to available.');
  } catch (error) {
    console.error('Error updating special request or driver status:', error);
    alert('Failed to update the special request or driver status.');
  }
};



  return (
    <div className='driver-home'>
      <DriverNavBar />
      <div className="driverschedule-container">
        {routes.length > 0 ? (
          <>
            <h1>Your Assigned Routes for Today</h1>
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

                    <button
                      className="mark-completed-btn"
                      onClick={() => handleMarkAsCompleted(route._id)}
                      disabled={route.status === 'Completed'}
                    >
                      {route.status === 'Completed' ? 'Completed' : 'Mark as Completed'}
                    </button>

                    {selectedRoute && selectedRoute._id === route._id && (
                      <LoadScript googleMapsApiKey="AIzaSyC_pYhIJVCAFchZnvhbnE9awl5u_XIoRIg">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={route.routes.length > 0 ? { lat: route.routes[0].lat, lng: route.routes[0].lng } : defaultCenter}
                          zoom={14}
                          onLoad={map => (mapRef.current = map)} // Save map instance
                        >
                          {route.routes.map((stop) => (
                            createMarker({ lat: stop.lat, lng: stop.lng }, `Stop ${route.routes.indexOf(stop) + 1}`)
                          ))}
                        </GoogleMap>
                      </LoadScript>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : <p>No Routes For Today</p>}

        {specialRequests.length > 0 ? (
          <>
            <h1>Your Assigned Special Requests</h1>
            <ul className="special-request-list">
              {specialRequests.map(request => (
                <li key={request._id} className="special-request-item">
                  <h2>Special Request ID: {request.requestId}</h2>
                  <p>Customer: {request.user.firstName} {request.user.lastName}</p>
                  <p>Collect Status: {request.collectStatus}</p>

                  <div className="routebtns">
                  <button
                    className="view-location-btn"
                    onClick={() => {
                      const lat = request.user.location.latitude;
                      const lng = request.user.location.longitude;
                      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                      window.open(googleMapsUrl, '_blank');
                    }}
                  >
                    View Location
                  </button>

                  <button
                    className="mark-spreq"
                    style={{textAlign:'center'}}
                    onClick={handleMarkAsCompletedSpecialRequest}
                  >
                    Mark As Completed
                  </button>
                  </div>

                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No special requests assigned for today.</p>
        )}
      </div>
    </div>
  );
}

export default ViewDriverSchedules;


*/


import React, { useEffect, useState, useRef } from 'react';
import DriverNavBar from './DriverNavBar';
import './ViewDriverShedule.css';
import axios from 'axios';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import { Player } from '@lottiefiles/react-lottie-player';
import * as loadingAnimation from '../../assets/loadingAnimation.json'; // Import Lottie animation

function ViewDriverSchedules() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading status

  const mapRef = useRef(null); // To hold reference to Google Map instance

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

  // Fetch assigned routes
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true); // Set loading to true before data fetch
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const allRoutes = response.data;

        const filteredRoutes = allRoutes.filter(route =>
          route.assignedDriver && route.assignedDriver._id === DriverId && route.date === today /*&& route.status !== 'Completed'*/
        );

        setRoutes(filteredRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (DriverId) {
      fetchRoutes();
    }
  }, [DriverId]);

  // Fetch special requests
  useEffect(() => {
    const fetchSpecialRequests = async () => {
      setLoading(true); // Set loading to true before data fetch
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests');
        const allRequests = response.data;

        const filteredRequests = allRequests.filter(specialRequest =>
          specialRequest.assignedDriver && specialRequest.assignedDriver._id === DriverId && specialRequest.collectStatus === 'Assigned'
        );

        setSpecialRequests(filteredRequests);
      } catch (error) {
        console.error('Error fetching special requests:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (DriverId) {
      fetchSpecialRequests();
    }
  }, [DriverId]);

  // Create markers with AdvancedMarkerElement
  const createMarker = (location, label = '') => {
    if (window.google && mapRef.current && location) {
      new window.google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: mapRef.current,
        title: label,
      });
    }
  };

  // Mark the route as completed and the driver as available
  const handleMarkAsCompleted = async (routeId) => {
    try {
      await axios.put(`http://localhost:8000/api/driver/drivers/${DriverId}`, { status: 'available' });
      await axios.put(`http://localhost:8000/router/routes/${routeId}`, { status: 'Completed' });

      setRoutes(prevRoutes => prevRoutes.filter(route => route._id !== routeId));
      toast.success('Route marked as completed and driver set to available.'); // Success toast
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update the status.'); // Error toast
    }
  };

  // Mark the special request as completed and the driver as available
  const handleMarkAsCompletedSpecialRequest = async (specialRequestId) => {
    try {
      await axios.patch(`http://localhost:8000/api/special-requests/${specialRequestId}`, {
        collectStatus: 'Completed'
      });

      await axios.put(`http://localhost:8000/api/driver/drivers/${DriverId}`, {
        status: 'available'
      });

      setSpecialRequests(prevRequests => prevRequests.filter(request => request._id !== specialRequestId));
      toast.success('Special request marked as completed and driver status updated to available.'); // Success toast
    } catch (error) {
      console.error('Error updating special request or driver status:', error);
      toast.error('Failed to update the special request or driver status.'); // Error toast
    }
  };

  return (
    <div className='driver-home'>
      <DriverNavBar />
      <ToastContainer /> {/* Add ToastContainer to render toast messages */}
      <div className="driverschedule-container">
        {loading ? ( // Show loading animation when data is being fetched
          <div className="loading-animation">
            <Player autoplay loop src={loadingAnimation} style={{ height: '300px', width: '300px' }} />
          </div>
        ) : (
          <>
            {routes.length > 0 ? (
              <>
                <h1>Your Assigned Routes for Today</h1>
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

                        <button
                          className="mark-completed-btn"
                          onClick={() => handleMarkAsCompleted(route._id)}
                          disabled={route.status === 'Completed'}
                        >
                          {route.status === 'Completed' ? 'Completed' : 'Mark as Completed'}
                        </button>

                        {selectedRoute && selectedRoute._id === route._id && (
                          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              center={route.routes.length > 0 ? { lat: route.routes[0].lat, lng: route.routes[0].lng } : defaultCenter}
                              zoom={14}
                              onLoad={map => (mapRef.current = map)} // Save map instance
                            >
                              {route.routes.map((stop) => (
                                createMarker({ lat: stop.lat, lng: stop.lng }, `Stop ${route.routes.indexOf(stop) + 1}`)
                              ))}
                            </GoogleMap>
                          </LoadScript>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : <p>No Routes For Today</p>}

            {specialRequests.length > 0 ? (
              <>
                <h1>Your Assigned Special Requests</h1>
                <ul className="special-request-list">
                  {specialRequests.map(request => (
                    <li key={request._id} className="special-request-item">
                      <h2>Special Request ID: {request.requestId}</h2>
                      <p>Customer: {request.user.firstName} {request.user.lastName}</p>
                      <p>Collect Status: {request.collectStatus}</p>

                      <div className="routebtns">
                        <button
                          className="view-location-btn"
                          onClick={() => {
                            const lat = request.user.location.latitude;
                            const lng = request.user.location.longitude;
                            const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                            window.open(googleMapsUrl, '_blank');
                          }}
                        >
                          View Location
                        </button>

                        <button
                          className="mark-spreq"
                          style={{ textAlign: 'center' }}
                          onClick={() => handleMarkAsCompletedSpecialRequest(request._id)}
                          disabled={request.collectStatus === 'Completed'}
                        >
                          {request.collectStatus === 'Completed' ? 'Completed' : 'Mark as Completed'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : <p>No Special Requests For Today</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewDriverSchedules;

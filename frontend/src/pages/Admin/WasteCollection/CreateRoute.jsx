/*import React, { useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import './CreateRoute.css';

// Default marker icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function CreateRoute() {
  const [routeName, setRouteName] = useState('');
  const [driver, setDriver] = useState('');
  const [stops, setStops] = useState([]);

  // Function to add a new stop with lat and lng
  const addStop = (lat, lng) => {
    setStops([...stops, { lat, lng }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const routeData = { routeName, driver, stops };
    console.log('Route Created:', routeData);
    // Submit logic (e.g., API call) goes here
  };

  // Component to handle clicks on the map
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        addStop(lat, lng); // Add stop to state when map is clicked
      },
    });
    return null;
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
        <h2>Create Route</h2>
        <form onSubmit={handleSubmit} className="route-form">
          <div className="form-group">
            <label htmlFor="routeName">Route Name:</label>
            <input
              type="text"
              id="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Enter route name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="driver">Assign Driver:</label>
            <select
              id="driver"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              required
            >
              <option value="">Select Driver</option>
              <option value="Driver 1">Driver 1</option>
              <option value="Driver 2">Driver 2</option>
            </select>
          </div>

          <div className="form-group">
            <label>Stopping Places (click on the map to add stops):</label>
            <MapContainer center={[7.8731, 80.7718]} zoom={7} className="map-container">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              {stops.map((stop, index) => (
                <Marker key={index} position={[stop.lat, stop.lng]} />
              ))}
            </MapContainer>
            

          </div>

          <button type="submit" className="submit-btn">Create Route</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoute;*/


import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './CreateRoute.css';
import axios from 'axios';


const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 7.5003887, // Default center (Sri Lanka)
  lng: 80.3398627,
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


function CreateRoute() {
  const [routeName, setRouteName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [stops, setStops] = useState([]);
  const [mapCenter, setMapCenter] = useState(center); // State to handle map center
  const autocompleteRef = useRef(null); // Reference for Autocomplete input

  const addStop = (lat, lng) => {
    setStops([...stops, { lat, lng }]);
  };

  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    addStop(lat, lng);
  };

  /*
  const handleSubmit = (e) => {
    e.preventDefault();
    const routeData = { routeName,  stops, selectedDay };
    console.log('Route Created:', routeData);
    // Submit logic (e.g., API call) goes here
  };
  */

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    const routeData = {
      routeName,
      stops,
      date: selectedDay  // Map selected day to date
    };
  
    try {
      // Make the POST request to the API
      const response = await axios.post('http://localhost:8000/router/routes', routeData);
      console.log('Route created successfully:', response.data);
      alert('Route created successfully!');
      // Reset form or redirect user after successful submission
    } catch (error) {
      console.error('Error creating route:', error);
      alert('Failed to create route. Please try again.');
    }
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const routeData = {
      routeName,
      routes: stops, // Rename stops to routes
      date: selectedDay  // Map selected day to date
    };
  
    try {
      // Make the POST request to the API
      const response = await axios.post('http://localhost:8000/router/routes', routeData);
      console.log('Route created successfully:', response.data);
      alert('Route created successfully!');
      // Reset form or redirect user after successful submission
      setRouteName(''); // Reset route name
      setStops([]); // Clear stops
      setSelectedDay(''); // Reset selected day
    } catch (error) {
      console.error('Error creating route:', error);
      alert('Failed to create route. Please try again.');
    }
  };
  

  // Function to handle place selection from Autocomplete
  const handlePlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMapCenter({ lat, lng }); // Recenter the map to the selected location
      addStop(lat, lng); // Optionally add a stop at the selected location
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
        <h2>Create Route</h2>
        <form onSubmit={handleSubmit} className="route-form">
          <div className="form-group">
            <label htmlFor="routeName">Route Name:</label>
            <input
              type="text"
              id="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Enter route name"
              required
            />
          </div>

     

          <div className="form-group">
            <label htmlFor="searchLocation">Search Location:</label>
            <LoadScript googleMapsApiKey="AIzaSyC_pYhIJVCAFchZnvhbnE9awl5u_XIoRIg" libraries={['places']}>
              {/* Autocomplete input for searching places */}
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelected}
              >
                <input
                  type="text"
                  id="searchLocation"
                  placeholder="Search for a location"
                  className="form-control"
                />
              </Autocomplete>

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter} // Center map based on selected location
                zoom={7}
                onClick={handleMapClick} // Add stop on map click
              >
                {stops.map((stop, index) => (
                  <Marker
                    key={index}
                    position={{ lat: stop.lat, lng: stop.lng }}
                    label={`${index + 1}`}
                    onClick={() => removeStop(index)} // Remove stop on marker click
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Dropdown for selecting day */}
          <div className="form-group">
            <label htmlFor="daySelect">Select Day:</label>
            <select
              id="daySelect"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              required
            >
              <option value="">--Select a Day--</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">Create Route</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoute;

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
const cities = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo',
  'Anuradhapura', 'Trincomalee', 'Matara', 'Batticaloa',
  'Kurunegala', 'Ratnapura', 'Nuwara Eliya', 'Vavuniya',
  'Mannar', 'Gampaha', 'Hambantota', 'Kalutara',
  'Puttalam', 'Badulla', 'Monaragala', 'Polonnaruwa'
];

function CreateRoute() {
  const [routeName, setRouteName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedCity, setSelectedCity] = useState(''); // State for selected city
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const routeData = {
      routeName,
      city: selectedCity,  // Include the selected city
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
      setSelectedCity(''); // Reset city
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

          {/* City Dropdown */}
          <div className="form-group">
            <label htmlFor="citySelect">Select City:</label>
            <select
              id="citySelect"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
            >
              <option value="">--Select a City--</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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

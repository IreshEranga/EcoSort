import React from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function ViewRoute() {
  const { state } = useLocation();
  const { route } = state; // Access the passed route data

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: route.routes[0]?.lat || 0, // Center map at the first stop
    lng: route.routes[0]?.lng || 0,
  };

  return (
    <div className="map-container">
      <h2>{route.routeName} - {route.date}</h2>
      <LoadScript googleMapsApiKey="AIzaSyC_pYhIJVCAFchZnvhbnE9awl5u_XIoRIg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          {route.routes.map((stop, index) => (
            <Marker key={index} position={{ lat: stop.lat, lng: stop.lng }} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default ViewRoute;

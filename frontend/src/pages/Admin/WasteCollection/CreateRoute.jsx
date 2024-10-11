import React, { useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './CreateRoute.css';

function CreateRoute() {
  const [routeName, setRouteName] = useState('');
  const [driver, setDriver] = useState('');
  const [stops, setStops] = useState(['']);
  
  const addStop = () => setStops([...stops, '']);
  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };
  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const routeData = { routeName, driver, stops };
    console.log('Route Created:', routeData);
    // Submit logic (e.g., API call) goes here
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
              {/* Options for drivers */}
              <option value="Driver 1">Driver 1</option>
              <option value="Driver 2">Driver 2</option>
              {/* Add more driver options dynamically if needed */}
            </select>
          </div>

          <div className="form-group">
            <label>Stopping Places:</label>
            {stops.map((stop, index) => (
              <div key={index} className="stop-item">
                <input
                  type="text"
                  value={stop}
                  onChange={(e) => handleStopChange(index, e.target.value)}
                  placeholder={`Stop ${index + 1}`}
                  required
                />
                <button type="button" onClick={() => removeStop(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addStop} className="add-stop-btn">
              Add Stop
            </button>
          </div>

          <button type="submit" className="submit-btn">Create Route</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoute;

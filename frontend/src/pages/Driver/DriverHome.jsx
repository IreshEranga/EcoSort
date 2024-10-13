import React from 'react';
import { useNavigate } from 'react-router-dom';
import DriverNavBar from './DriverNavBar';
import './DriverHome.css'; // Importing CSS for styling
import collecrWasteDriver from '../../assets/images/collecrWasteDriver.jpeg'



function DriverHome() {
  const navigate = useNavigate(); // Hook to navigate to different routes

  const Driver = JSON.parse(localStorage.getItem('driver'));
  console.log(Driver.id);

  return (
    <div className="driver-home">
      <DriverNavBar />
      <div className="drivercontainer">
        <center><h1>Welcome, {Driver.name}</h1></center>
        <center><p>Your journey to efficient waste management starts here.</p></center>
        
        <div className="info-section">
          <img src={collecrWasteDriver} alt="Waste Management" className="home-image" />
          <div className="details">
            <h2>Your Responsibilities</h2>
            <ul>
              <li>Collect waste on scheduled days</li>
              <li>Ensure proper disposal of waste</li>
              <li>Maintain communication with the central office</li>
            </ul>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default DriverHome;

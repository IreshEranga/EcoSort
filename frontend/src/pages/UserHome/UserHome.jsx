import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserHome.css';
import NavbarComponent from './NavbarComponent'; 

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    // Update the current date and time every second
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <div className="user-home">
      {/* Navbar */}
      <NavbarComponent />

      {/* Header with dynamic user name */}
      <header className="user-header">
        {user ? (
          <h2>Hi, {user.firstName}!</h2>
        ) : (
          <h2>Hi, Guest!</h2>
        )}
        <p>{formattedDate} {formattedTime}</p>
      </header>

      {/* Banner Section */}
      <section className="banner-section">
        <div className="banner-content">
          <h3>EcoSort</h3>
          <p>For a Seamless Waste Management</p>
          <p>Join with us and properly dispose of your waste</p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="services-grid">
        <Link to="/waste-management" className="service-card waste-card">
          <h4>My Waste Management</h4>
        </Link>

        <Link to="/collection-routines" className="service-card routine-card">
          <h4>Collection Routines</h4>
        </Link>

        <Link to="/special-waste" className="service-card special-waste-card">
          <h4>Special Waste Collection</h4>
        </Link>

        <Link to="/payments" className="service-card payment-card">
          <h4>Payments</h4>
        </Link>
      </section>
    </div>
  );
};

export default UserHome;
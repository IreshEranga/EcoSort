import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/ECOSORT.png';
import './DriverNavBar.css'; // Separate CSS for navbar

function DriverNavBar() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    // Retrieve driver data from localStorage
    const storedDriver = JSON.parse(localStorage.getItem('driver'));
    if (storedDriver) {
      setDriver(storedDriver);
    }
  }, []);

  const handleLogout = () => {
    // Remove driver data from localStorage
    localStorage.removeItem('driver');
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="driver-navbar" fixed="top">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand>
          <img className="logo" src={Logo} alt="EcoSort" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="driver-navbar-nav" />
        <Navbar.Collapse id="driver-navbar-nav" className="justify-content-end">
          <Nav className="nav-items">
            <Nav.Link href="/driverHome" className="nav-link-custom">Home</Nav.Link>
            <Nav.Link href="/driver-schedules" className="nav-link-custom">Schedules</Nav.Link>
            <Nav.Link href="/driver-reports" className="nav-link-custom">Reports</Nav.Link>
            <Nav.Link onClick={handleLogout} className="nav-link-custom logout-button">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DriverNavBar;

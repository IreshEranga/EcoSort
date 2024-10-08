import React from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../assets/ECOSORT.png'; // Use your logo here
import './UserHome.css'; // Separate CSS for navbar

const NavbarComponent = () => {
    return (
        <Navbar expand="lg" className="navbar-custom" fixed="top">
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={Link} to="/" className="navbar-logo">
                    <Image className='logo' src={Logo} alt="EcoSort" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="nav-items">
                        <Nav.Link as={Link} to="/userHome" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/features" className="nav-link-custom">Waste Management</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="nav-link-custom">Shedule</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="nav-link-custom">Issues</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="nav-link-custom">Payments</Nav.Link>
                        <Nav.Link as={Link} to="/login" className="nav-link-custom login-button">Logout</Nav.Link> {/* Logout button */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;

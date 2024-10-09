import React from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../assets/ECOSORT.png';
import './home.css';

const NavigationBar = () => {
    return (
        <Navbar expand="lg" className="navbar-custom" fixed="top">
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={Link} to="/" className="navbar-logo">
                    <Image className='logo' src={Logo} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="nav-items">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/features" className="nav-link-custom">Features</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="nav-link-custom">About</Nav.Link>
                        <Nav.Link as={Link} to="/report-issue" className="nav-link-custom">Support</Nav.Link>
                        <Nav.Link as={Link} to="/login" className="nav-link-custom login-button">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;

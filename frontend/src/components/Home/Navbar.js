import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './home.css';

const NavigationBar = () => {
    return (
        <Navbar expand="lg" className="navbar-custom" fixed="top">
            <Container className="d-flex justify-content-center">
                <Navbar.Brand as={Link} to="/" className="navbar-logo mx-auto">
                    <i className="fas fa-leaf"></i> Eco-Sort
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                    <Nav className="nav-items mx-auto">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/features" className="nav-link-custom">Features</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="nav-link-custom">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="nav-link-custom">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/login" className="nav-link-custom login-button">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
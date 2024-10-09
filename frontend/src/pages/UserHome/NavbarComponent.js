import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Importing the user icon
import Logo from '../../assets/ECOSORT.png'; // Your logo here
import './UserHome.css'; // Separate CSS for navbar


const NavbarComponent = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleProfilePage = ()=>{
        navigate('/dashboard');
    };

    return (
        <Navbar expand="lg" className="navbar-custom" fixed="top">
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={Link} to="/" className="navbar-logo">
                    <img className="logo" src={Logo} alt="EcoSort" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="nav-items d-flex align-items-center">
                        <Nav.Link as={Link} to="/userHome" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/waste" className="nav-link-custom">Waste</Nav.Link>
                        <Nav.Link as={Link} to="/CollectionRouting" className="nav-link-custom">Schedules</Nav.Link>
                        <Nav.Link as={Link} to="/report-issue" className="nav-link-custom">Issues</Nav.Link>
                        <Nav.Link as={Link} to="/payments" className="nav-link-custom">Payments</Nav.Link>
                        <Nav.Link as={Link} to="/login" className="nav-link-custom login-button">Logout</Nav.Link>

                        {/* User profile icon */}
                        {user ? (
                            <FontAwesomeIcon
                                icon={faUserCircle}
                                size="2x"
                                className="profile-icon"
                                title={user.firstName + user.lastName} // Tooltip with user name
                                onClick={handleProfilePage}
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faUserCircle}
                                size="2x"
                                className="profile-icon"
                                title="Guest"
                            />
                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;

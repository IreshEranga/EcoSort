import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserHomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user data
        navigate('/login'); // Redirect to login page
    };

    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Log the user data to the console for debugging
    console.log(user);

    // Handle location button click
    const handleSeeLocation = () => {
        if (user && user.location) {
            const { latitude, longitude } = user.location;
            const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(mapUrl, '_blank'); // Open the map in a new tab
        }
    };

    return (
        <div className="user-home-page">
            <h1>User Home Page</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.firstName} {user.lastName}!</p>
                    <p>Email: {user.email}</p>
                    <p>Mobile: {user.mobile}</p>
                    <p>Address: {user.address}, {user.city}</p>
                    <p>User Type: {user.type}</p>
                    <p>User Location: {user.location.latitude}, {user.location.longitude}</p>

                    {/* See Location button */}
                    <Button 
                        onClick={handleSeeLocation} 
                        variant="primary" 
                        className="mt-3"
                    >
                        See Location
                    </Button>
                </div>
            ) : (
                <p>No user data found. Please log in.</p>
            )}
            
            {/* Logout button */}
            <Button onClick={handleLogout} variant="danger" className="mt-3">
                Log Out
            </Button>
        </div>
    );
}

export default UserHomePage;

import React from 'react';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import './Features.css';

const Features = () => {
  return (
    <div className="features-page">
      <Navbar />
      <div className="features-header">
        <h1>EcoSort User Features</h1>
        <p>Discover the innovative features that make waste management simple and efficient.</p>
      </div>
      <div className="features-list">
        <div className="feature">
          <h2>Smart Waste Bins</h2>
          <p>Our smart bins are equipped with sensors that track waste levels in real-time, optimizing waste collection schedules.</p>
        </div>
        <div className="feature">
          <h2>Resident Portal</h2>
          <p>Residents can report waste collection issues, request special services, manage accounts, track waste generation, and make service payments.</p>
        </div>
        <div className="feature">
          <h2>View and Manage Bins</h2>
          <p>Users can view assigned bins, track waste levels, and update or delete bin information easily.</p>
        </div>
        <div className="feature">
          <h2>Special Waste Collection Requests</h2>
          <p>Request special waste collection services directly from the portal, and track your request status in real-time.</p>
        </div>
        <div className="feature">
          <h2>QR Code Bin Tracking</h2>
          <p>View and scan the QR code assigned to your bin to track waste management processes efficiently.</p>
        </div>
        <div className="feature">
          <h2>Issue Reporting and Support</h2>
          <p>Submit support tickets for waste management-related issues, select different issue types, and track ticket status.</p>
        </div>
        <div className="feature">
          <h2>Edit and Delete Requests</h2>
          <p>Manage special collection requests by editing or deleting them, ensuring flexibility and control over service needs.</p>
        </div>
        <div className="feature">
          <h2>Waste Collection Schedules</h2>
          <p>View upcoming waste collection schedules based on your location and receive notifications for collection times.</p>
        </div>
        <div className="feature">
          <h2>Payment Management</h2>
          <p>Make payments for waste management services easily, track past payments, and manage billing information through the portal.</p>
        </div>
      </div>
      
      <footer className="footer text-center">
        <Container>
            <p>&copy; 2024 Eco-Sort. All Rights Reserved | <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
        </Container>
      </footer>
    </div>
  );
};

export default Features;
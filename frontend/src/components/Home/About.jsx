import React from 'react';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-banner">
        <h1>About EcoSort</h1>
        <p>Innovative Waste Management for a Greener Future</p>
      </div>
      <div className="about-content">
        <div className="about-info">
          <h2>Our Mission</h2>
          <p>
            EcoSort is an innovative waste management system designed to modernize and optimize waste collection in urban areas.
            Our system integrates smart technologies such as sensor-equipped bins and real-time waste tracking, making waste
            collection more efficient and environmentally friendly.
          </p>
        </div>
        <div className="about-info">
          <h2>Our Vision</h2>
          <p>
            EcoSort helps reduce operational costs and improves resource allocation by providing tailored services to citizens, 
            waste collectors, and administrators. Our goal is to foster sustainability through data-driven decisions that minimize
            the environmental impact of waste disposal.
          </p>
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

export default About;
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css'; // Ensure to include the CSS file for custom styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    mobile: '',
    password: '',
    type: 'individual', // Default to individual
    city: '',
    latitude: '',   // New latitude field
    longitude: ''   // New longitude field
  });

  // List of Sri Lankan cities
  const cities = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 
    'Anuradhapura', 'Trincomalee', 'Matara', 'Batticaloa', 
    'Kurunegala', 'Ratnapura', 'Nuwara Eliya', 'Vavuniya', 
    'Mannar', 'Gampaha', 'Hambantota', 'Kalutara', 
    'Puttalam', 'Badulla', 'Monaragala', 'Polonnaruwa'
  ];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful signup
        
        toast.success("Sign up successful!", {
          position: "top-center",
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } else {
        // Handle errors
        toast.error(data.message || 'Sign up failed!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      toast.error('An error occurred during sign up. Please try again.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="justify-content-center align-items-center vh-200">
        <Col xs={12} sm={10} md={8} lg={6} className="signup-form-container" style={{marginTop:'30px'}}>
          <h2 className="text-center">Sign Up</h2>
          <Form onSubmit={handleSubmit} className="signup-form">
            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                placeholder="Enter your first name" 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Enter your last name" 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter your email" 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Enter your address" 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formMobile" className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control 
                type="tel" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleChange} 
                placeholder="Enter your mobile number" 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Enter your password" 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formUserType" className="mb-3">
              <Form.Label>User Type</Form.Label>
              <Form.Control 
                as="select" 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                required
              >
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formCity" className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control 
                as="select" 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                required
              >
                <option value="">Select your city</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* New Fields for Latitude and Longitude */}
            <Form.Group controlId="formLatitude" className="mb-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control 
                type="text" 
                name="latitude" 
                value={formData.latitude} 
                onChange={handleChange} 
                placeholder="Enter latitude" 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formLongitude" className="mb-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control 
                type="text" 
                name="longitude" 
                value={formData.longitude} 
                onChange={handleChange} 
                placeholder="Enter longitude" 
                required 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>

            <div className="text-center mt-3">
              <p>Already have an account? <Link to="/login" className="signup-link">Log In</Link></p>
            </div>
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default SignUp;

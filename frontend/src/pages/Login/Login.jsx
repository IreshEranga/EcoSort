import React, { useState } from 'react';
import { Form, Button, Container, Row, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoginImg from '../../assets/ECOSORT.png';
import axios from 'axios'; 
import './login.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Login() {
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear previous error messages

    try {
      // Make API call to login
      const response = await axios.post(/*`${process.env.REACT_APP_BACKEND_API}/api/login`*/'http://localhost:8000/api/login', {
        email,
        password,
      });

      // Assuming the response contains user details
      const user = response.data.user; // Adjust this based on your API response

      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(user)); // Store user details as a JSON string
      
        toast.success("Log In successful!", {
          position: "top-center",
          autoClose: 5000, // Auto close after 3 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      setTimeout(()=>{
        navigate('/dashboard');
      },2000)
      // Redirect to the dashboard or another page after successful login
       // Change this to your desired route
    } catch (err) {
      // Handle error if login fails
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center vh-100">
        {/* <Col xs={12} sm={10} md={8} lg={6} xl={4} className="login-form-container"> */}
          <div className="login-header text-center">
            <img src={LoginImg} alt="Waste Management Logo" className="login-logo" />
            <h2 className="mt-3">Welcome Back</h2>
            <p className="login-subtext">Log in to your account</p>
          </div>
          {error && <Alert  variant="danger">{error}</Alert>} {/* Display error message */}
          <Form className="login-form" onSubmit={handleLogin}> {/* Call handleLogin on form submit */}
            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email} // Controlled component
                onChange={(e) => setEmail(e.target.value)} // Update state on input change
                required
                className="login-input"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password} // Controlled component
                onChange={(e) => setPassword(e.target.value)} // Update state on input change
                required
                className="login-input"
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Check type="checkbox" label="Remember me" />
              <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
            </div>

            <Button variant="primary" type="submit" className="w-100 mb-3 login-button">
              Login
            </Button>

            <div className="text-center mt-3">
              <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
            </div>
          </Form>
        {/* </Col> */}
      </Row>
      <ToastContainer />
    </Container>
  );
}

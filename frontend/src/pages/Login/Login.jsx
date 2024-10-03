import React from 'react';
import { Form, Button, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginImg from '../../assets/ECOSORT.png';
import './login.css';  // Ensure to include the CSS file for custom styling

export default function Login() {
  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center vh-100">
        {/* <Col xs={12} sm={10} md={8} lg={6} xl={4} className="login-form-container"> */}
          <div className="login-header text-center">
            <img src={LoginImg} alt="Waste Management Logo" className="login-logo" />
            <h2 className="mt-3">Welcome Back</h2>
            <p className="login-subtext">Log in to your account</p>
          </div>
          <Form className="login-form w-100">
            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required className="login-input w-100" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required className="login-input w-100" />
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
    </Container>
  );
}

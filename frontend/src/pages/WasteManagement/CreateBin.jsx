// src/components/CreateBin.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'; // Import necessary components from Bootstrap
import axios from 'axios'; // Import axios for making HTTP requests
import './CreateBin.css'; // Import custom CSS for styling

function CreateBin() {
  const [binType, setBinType] = useState(''); // State for selected bin type
  
  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(''); // State for success messages

  // Retrieve user ID from local storage
  const userID = JSON.parse(localStorage.getItem('user'))._id; // Assuming user object has an _id property

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous error messages
    setSuccess(''); // Clear previous success messages

    try {
      // Send POST request to the API to create a new bin
      const response = await axios.post('http://localhost:8000/api/bins/', {
        user: userID, // Use 'user' as the key to match your model
        type: binType, // Use 'type' as the key to match your model
        
      });

      if (response.status === 201) {
        setSuccess('Bin created successfully!'); // Show success message
        setBinType(''); // Reset the bin type
        
      }
    } catch (err) {
      setError('Failed to create bin. Please try again.'); // Handle error
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <Container className="create-bin-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2>Create Bin</h2>
          {error && <div className="error-message">{error}</div>} {/* Display error message */}
          {success && <div className="success-message">{success}</div>} {/* Display success message */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBinType">
              <Form.Label>Bin Type</Form.Label>
              <Form.Control 
                as="select" 
                value={binType} 
                onChange={(e) => setBinType(e.target.value)} 
                required
              >
                <option value="">Select Bin Type</option>
                <option value="Organic">Organic</option>
                <option value="Paper">Paper</option>
                <option value="Plastic">Plastic</option>
                <option value="Electric">Electric</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
            
            <Button variant="primary" type="submit" className="mt-3">Create Bin</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateBin;

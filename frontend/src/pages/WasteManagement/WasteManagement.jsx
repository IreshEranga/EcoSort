// src/pages/WasteManagement.js
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavbarComponent from '../../components/NavbarComponent';
import { Button, Table } from 'react-bootstrap'; // Import Button and Table from Bootstrap
import axios from 'axios'; // Import axios for API calls

function WasteManagement() {
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [bins, setBins] = useState([]); // State to store bin details
  const userId = '670235f4dc8b25fe11b6a157'; // Replace with the actual user ID as needed

  // Fetch bins data when component mounts
  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/bins/user/${userId}`);
        setBins(response.data); // Set the bins state with the response data
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    };

    fetchBins();
  }, [userId]);

  // Function to navigate to CreateBin page
  const handleNavigateToCreateBin = () => {
    navigate('/createBin'); // Navigate to the CreateBin page
  };

  return (
    <div className="user-home">
      <NavbarComponent />

      <div className="user-header" style={{ backgroundColor: '#f4f4f4', padding: '20px' }}>
        <h1>Waste Management</h1>

        {/* Button to navigate to CreateBin page */}
        <Button variant="primary" onClick={handleNavigateToCreateBin} style={{ margin: '20px' }}>
          Add New Bin
        </Button>
      </div>

      {/* Table to display bins */}
      <div style={{ padding: '20px' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Bin ID</th>
              <th>Type</th>
              <th>Percentage</th>
              <th>QR Code</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr key={bin._id}>
                <td>{bin.binId}</td>
                <td>{bin.type}</td>
                <td>{bin.percentage}</td>
                <td>
                  <img src={bin.qrCode} alt={`QR Code for ${bin.binId}`} style={{ width: '50px', height: '50px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default WasteManagement;

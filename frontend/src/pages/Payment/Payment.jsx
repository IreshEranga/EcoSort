import React, { useEffect, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent'; 
import Footer from '../../components/Footer/Footer';

import './Payment.css';
import axios from 'axios'; // For making API requests
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function PaymentsPage() {
  const [payments, setpayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredpayments, setFilteredpayments] = useState([]);

  // Fetch payments from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/payments'); // Ensure this matches your backend route
        setpayments(response.data);
        setFilteredpayments(response.data); // Set filtered payments initially to all payments
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  // Function to handle map navigation
  const handleNavigateToMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank'); // Open in a new tab
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    // Filter payments based on search term
    const filtered = payments.filter(user => 
      user.firstName.toLowerCase().includes(value) ||
      user.lastName.toLowerCase().includes(value) ||
      user.city.toLowerCase().includes(value) ||
      user.type.toLowerCase().includes(value)
    );

    setFilteredpayments(filtered);
  };

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set Title
    doc.setFontSize(18);
    doc.text('User Report', 14, 20);

    // Set Column Titles
    const headers = ['User ID', 'First Name', 'Last Name', 'Email', 'Mobile', 'Address', 'City', 'Type'];
    const data = filteredpayments.map(user => [
      user.userId,
      user.firstName,
      user.lastName,
      user.email,
      user.mobile,
      user.address,
      user.city,
      user.type
    ]);

    // Add headers
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    // Save the PDF
    doc.save('user_report.pdf');
  };

  return (
 
      
      <div className="user-home">
      <NavbarComponent />
      {/* Main Content */}
      <div className="main-content">
        <h1 className="topic" style={{ color: 'black' }}>payments</h1>
        
        <div style={{display:'flex', flexDirection:'row'}}>
          {/* Search Bar */}
            <input 
              type="text" 
              placeholder="Search by name, city, or type..." 
              value={searchTerm} 
              onChange={handleSearchChange} 
              className="search-input"
            />
            {/* Report Generation Button */}
            {filteredpayments.length > 0 && (
              <div className="report-section">
                <button className="btn btn-primary" onClick={generatePDF}>
                  Download PDF Report
                </button>
              </div>
            )}
        </div>

        {/* payments Table */}
        <table className="payments-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>City</th>
              <th>Type</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredpayments.length > 0 ? (
              filteredpayments.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.type}</td>
                  <td>
                    {user.location.latitude && user.location.longitude ? (
                      <button 
                        className="map-button" 
                        onClick={() => handleNavigateToMap(user.location.latitude, user.location.longitude)}
                      >
                        View on Map
                      </button>
                    ) : (
                      'Location not available'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>

        
      </div>
      <Footer />

    </div>
  );
}

export default PaymentsPage;

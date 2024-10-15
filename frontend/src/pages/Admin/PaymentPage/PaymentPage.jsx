import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import './PaymentPage.css';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  // const [payments, setPayments] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [paymentData, setPaymentData] = useState({
      requestId: '',
      distance: '',
      transportationCharge: '',
      weight: '',
      additionalCharges: ''
      // chargingModel: ''
  });

  useEffect(() => {
    // Fetch existing payments
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/payment/allpayments');
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };


  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    // Filter payments based on search term (can be expanded based on requirement)
    const filtered = payments.filter(payment => 
      payment.requestId.toLowerCase().includes(value) ||
      payment.status.toLowerCase().includes(value)
    );
    setFilteredPayments(filtered);
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert the necessary fields to integers before sending
    const dataToSubmit = {
        requestId: paymentData.requestId, // Convert requestId to an integer
        distance: parseInt(paymentData.distance),   // Convert distance to an integer
        transportationCharge: parseInt(paymentData.transportationCharge), // Convert transportation charge to an integer
        weight: parseInt(paymentData.weight),       // Convert weight to an integer
        additionalCharges: parseInt(paymentData.additionalCharges), // Convert additional charges to an integer
        chargingModel: paymentData.chargingModel    // Leave chargingModel as is (string or another format)
    };

    try {
        await axios.post('http://localhost:8000/api/payment/payments', dataToSubmit);
        fetchPayments(); // Refresh the payments list
        setPaymentData({
            requestId: '',
            distance: '',
            transportationCharge: '',
            weight: '',
            additionalCharges: '',
            chargingModel: ''
        });
        setIsFormVisible(false); // Hide the form after submission
    } catch (error) {
        console.error('Error adding payment:', error);
    }
};

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if(name=="distance"){
        const charge= value*100;
        setPaymentData((prevData)=>
        ({
            ...prevData,
            distance:value,
            transportationCharge:charge
        })

    )
    }

    else{
        setPaymentData((prevData)=>({
            ...prevData,
            [name]:value
        }))
    }
    
};

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Payment Report', 14, 20);
    const headers = ['Request ID', 'Distance', 'Transport Charge', 'Weight', 'Additional Charges', 'Status'];
    const data = filteredPayments.map(payment => [
      payment.requestId,
      payment.distance,
      payment.transportationCharge,
      payment.weight,
      payment.additionalCharges,
      payment.status,
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    doc.save('payment_report.pdf');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}


      {isFormVisible && (
                <div className="modal-overlay">
                    <div className="modal-content-payment">
                        <span className="close-modal" onClick={() => setIsFormVisible(false)}>&times;</span>
                        <form onSubmit={handleSubmit} className="payment-form">
                            <h3>Make a Payment</h3>
                            <div>
                                <label>Request ID:</label>
                                <input 
                                    type="text" 
                                    name="requestId"
                                    value={paymentData.requestId} 
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div>
                                <label>Distance (km):</label>
                                <input 
                                    type="number" 
                                    name="distance"
                                    value={paymentData.distance}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Transportation Charge:</label>
                                <input 
                                    type="number" 
                                    name="transportationCharge"
                                    value={paymentData.transportationCharge}
                                    onChange={handleInputChange}
                                    readOnly 
                                />
                            </div>
                            <div>
                                <label>Weight (kg):</label>
                                <input 
                                    type="number" 
                                    name="weight"
                                    value={paymentData.weight}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Additional Charges:</label>
                                <input 
                                    type="number" 
                                    name="additionalCharges"
                                    value={paymentData.additionalCharges}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit">Submit Amount</button>
                        </form>
                    </div>
                </div>
            )}

      <div className="main-content" style={{ backgroundColor: '#ffffff' }}>
        <h1 className="topic" style={{ color: 'black' }}>Payments</h1>

        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by request ID or status..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="buttons-section">
            {filteredPayments.length > 0 && (
              <button className="btn btn-primary" onClick={generatePDF}>
                Download PDF Report
              </button>
            )}
          </div>
          <div className="add-payment-btn-wrapper-top">
            <button className="add-payment-btn" onClick={() => setIsFormVisible(!isFormVisible)}>
                {isFormVisible ? 'Close Payment Form' : 'Add Payment'}
            </button>
        </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Owner</th>
              <th>Distance (km)</th>
              <th>Transport Charge</th>
              <th>Weight (kg)</th>
              <th>Additional Charges</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.requestId}</td>
                  <td>{payment.ownername}</td>
                  <td>{payment.distance}</td>
                  <td>{payment.transportationCharge}</td>
                  <td>{payment.weight}</td>
                  <td>{payment.additionalCharges || 'N/A'}</td>
                  <td>{payment.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;

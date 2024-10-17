import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './PaymentPage.css';
import { ToastContainer, toast } from 'react-toastify';


const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [paymentData, setPaymentData] = useState({
    requestId: '',
    distance: '',
    transportationCharge: '',
    weight: '',
    additionalCharges: ''
  });

  const location = useLocation();

  useEffect(() => {
    fetchPayments();

    const searchParams = new URLSearchParams(location.search);
    const requestId = searchParams.get('requestId');
    if (requestId) {
      setPaymentData(prevData => ({ ...prevData, requestId }));
      setIsFormVisible(true);
    }
  }, [location]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/payment/allpayments');
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };


  const handleClosePaymentForm = () => {
    setIsFormVisible(false);
    setPaymentData({
      requestId: '',
      distance: '',
      transportationCharge: '',
      weight: '',
      additionalCharges: ''
    });
  };


  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = payments.filter(payment => {
      const requestId = payment.requestId ? payment.requestId.toLowerCase() : '';
      const status = payment.status ? payment.status.toLowerCase() : '';
      return requestId.includes(value) || status.includes(value);
    });
  
    setFilteredPayments(filtered);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      requestId: paymentData.requestId,
      distance: parseInt(paymentData.distance),
      transportationCharge: parseInt(paymentData.transportationCharge),
      weight: parseInt(paymentData.weight),
      additionalCharges: parseInt(paymentData.additionalCharges),
      chargingModel: paymentData.chargingModel
    };

    try {
      await axios.post('http://localhost:8000/api/payment/payments', dataToSubmit);
      fetchPayments();
      setPaymentData({
        requestId: '',
        distance: '',
        transportationCharge: '',
        weight: '',
        additionalCharges: '',
        chargingModel: ''
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "distance") {
      const charge = value * 100;
      setPaymentData(prevData => ({
        ...prevData,
        distance: value,
        transportationCharge: charge
      }));
    } else {
      setPaymentData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

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

  const handleReviewReceipt = async (paymentId) => {
    try {
      setIsReviewModalVisible(true);
      setSelectedPayment(paymentId);
      const response = await axios.get(`http://localhost:8000/api/payment/payments/${paymentId}/receipt`);
      setReceiptData(response.data.receiptFile);
    } catch (error) {
      console.error('Error fetching receipt:', error);
    }
  };

  const handleApproveReceipt = async () => {
    try {
      await axios.post(`http://localhost:8000/api/payment/payments/${selectedPayment}/review`, { status: "Approved" });
      alert('Receipt approved');
      setIsReviewModalVisible(false);
      fetchPayments();
    } catch (error) {
      console.error('Error approving receipt:', error);
      alert('Error approving receipt');
    }
  };
  
  const handleDeclineReceipt = async () => {
    try {
      await axios.post(`http://localhost:8000/api/payment/payments/${selectedPayment}/review`, { status: "Declined" });
      alert('Receipt declined');
      setIsReviewModalVisible(false);
      fetchPayments();
    } catch (error) {
      console.error('Error declining receipt:', error);
      alert('Error declining receipt');
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />


      
      <div className="main-content" style={{ backgroundColor: '#ffffff' }}>
        <h1 className="topic" style={{ color: 'black' }}>Payments</h1>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by name, city, or type..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="buttons-section">
            {filteredPayments.length > 0 && (
              <>
                <button className="btn btn-primary" onClick={generatePDF}>
                  Download PDF Report
                </button>
                <button className="add-payment-btn" onClick={() => setIsFormVisible(!isFormVisible)}>
                  {isFormVisible ? 'Close Payment Form' : 'Add Payment'}
                </button>
              </>
            )}
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
                <th>Action</th>
              </tr>
          </thead>
          <tbody>
          {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                  <td >{payment.requestId}</td>
                  <td >{payment.ownername}</td>
                  <td >{payment.distance}</td>
                  <td >{payment.transportationCharge}</td>
                  <td >{payment.weight}</td>
                  <td >{payment.additionalCharges || 'N/A'}</td>
                  <td >{payment.status}</td>
                  <td >
                    {payment.status === 'To Be Reviewed' && (
                      <button onClick={() => handleReviewReceipt(payment._id)}>
                        Review Receipt
                      </button>
                    )}
                    {payment.status === 'Approved' && (
                      <h4>Done</h4>
                    )}
                     {payment.status === 'Declined' && (
                      <h4>Waiting</h4>
                    )}
                     {payment.status === 'Pending' 
&& (
                      <h4>Waiting</h4>
                    )}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
          <td colSpan="8">No payments found</td>
              </tr>
            )}
          </tbody>
          </table> 



        {/* Add/Update Driver Modal */}
         {/* {showModal && (
          <div className="modal-overlayDriver" style={{marginLeft:'400px', marginTop:'50px', marginBottom:'20px'}}>
            <div className="modal-contentDriver" style={{marginTop:'-220px', backgroundColor:'white', padding:'20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <h2>{isUpdate ? 'Update Driver' : 'Add Driver'}</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newDriver.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newDriver.email}
                    onChange={handleInputChange}
                    required
                    disabled={isUpdate} // Disable email field during update
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile:</label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={newDriver.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newDriver.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City:</label>
                  <select
                    id="city"
                    name="city"
                    value={newDriver.city}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={newDriver.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {isUpdate ? 'Update Driver' : 'Add Driver'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}  */}




{isFormVisible && (
          <div className="payment-form-container">
            <div className="payment-form">
              <button className="close-modal" onClick={handleClosePaymentForm}>&times;</button>
              <h3>Make a Payment</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="requestId">Request ID:</label>
                  <input 
                    type="text" 
                    id="requestId"
                    name="requestId"
                    value={paymentData.requestId} 
                    onChange={handleInputChange}
                    required 
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="distance">Distance (km):</label>
                  <input 
                    type="number" 
                    id="distance"
                    name="distance"
                    value={paymentData.distance}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="transportationCharge">Transportation Charge:</label>
                  <input 
                    type="number" 
                    id="transportationCharge"
                    name="transportationCharge"
                    value={paymentData.transportationCharge}
                    onChange={handleInputChange}
                    readOnly 
                  />
                </div>
                <div>
                  <label htmlFor="weight">Weight (kg):</label>
                  <input 
                    type="number" 
                    id="weight"
                    name="weight"
                    value={paymentData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="additionalCharges">Additional Charges:</label>
                  <input 
                    type="number" 
                    id="additionalCharges"
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

        {isReviewModalVisible && receiptData && (
          <div className="modal-overlay">
            <div className="modal-content-payment">
              <button className="close-modal" onClick={() => setIsReviewModalVisible(false)}>&times;</button>
              <h3>Review Receipt</h3>
              {receiptData && (
                <img src={receiptData} alt="Receipt" />
              )}
              <div className="button-container">
                <button onClick={handleApproveReceipt}>Approve</button>
                <button onClick={handleDeclineReceipt}>Decline</button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
export default PaymentPage;
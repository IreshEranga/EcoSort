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

  useEffect(() => {
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
    const filtered = payments.filter(payment => 
      payment.requestId.toLowerCase().includes(value) ||
      payment.status.toLowerCase().includes(value)
    );
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
      const response = await axios.get(`http://localhost:8000/api/payment/payments/${paymentId}/receipt`);
      setSelectedPayment(paymentId);
      setReceiptData(response.data);
      setIsReviewModalVisible(true);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      alert('Error fetching receipt');
    }
  };

  const handleApproveReceipt = async () => {
    try {
      await axios.post(`http://localhost:8000/api/payment/payments/${selectedPayment}/approve-receipt`);
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
      await axios.post(`http://localhost:8000/api/payment/payments/${selectedPayment}/decline-receipt`);
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

      {isFormVisible && (
        <div className="modal-overlay">
          <div className="modal-content-payment">
            <span className="close-modal" onClick={() => setIsFormVisible(false)}>&times;</span>
            <form onSubmit={handleSubmit} className="payment-form">
              {/* Form fields... */}
            </form>
          </div>
        </div>
      )}

{isReviewModalVisible && receiptData && (
        <div className="modal-overlay">
          <div className="modal-content-payment">
            <span className="close-modal" onClick={() => setIsReviewModalVisible(false)}>&times;</span>
            <h3>Review Receipt</h3>
            {receiptData.receiptFile ? (
              <div>
                <p>Receipt File: {receiptData.receiptFile}</p>
                 <img src={`data:image/jpeg;base64,${receiptData.receiptFile}`} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '400px' }} /> 
              </div>
            ) : (
              <p>No receipt file available</p>
            )}
            <div>
              <button onClick={handleApproveReceipt}>Approve</button>
              <button onClick={handleDeclineReceipt}>Decline</button>
            </div>
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
              <th>Action</th>
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
                  <td>
                    {payment.status === 'To Be Reviewed' && (
                      <button onClick={() => handleReviewReceipt(payment._id)}>
                        Review Receipt
                      </button>
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
      </div>
    </div>
  );
};

export default PaymentPage;
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarComponent from '../../components/NavbarComponent';
import Footer from '../../components/Footer/Footer';
import './Payment.css';
import axios from 'axios';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (user?._id) {
          const response = await axios.get(`http://localhost:8000/api/payment/payments/${user._id}`);
          setPayments(response.data);
        }
      } catch (error) {
        toast.error('Failed to fetch payments');
        console.error('Error fetching payments:', error);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      try {
        const base64 = await convertToBase64(file);
        setReceiptFile(base64);
        setPreviewUrl(URL.createObjectURL(file));
      } catch (error) {
        toast.error('Error processing file');
        console.error('Error processing file:', error);
      }
    }
  };

  const handleReceiptSubmit = async () => {
    if (!receiptFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/payment/payments/${selectedPaymentId}/receipt`,
        { receiptFile },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      toast.success('Receipt uploaded successfully');
      setIsModalOpen(false);
      setReceiptFile(null);
      setPreviewUrl(null);
      
      const updatedPayments = await axios.get(
        `http://localhost:8000/api/payment/payments/${user._id}`
      );
      setPayments(updatedPayments.data);
    } catch (error) {
      toast.error('Failed to upload receipt');
      console.error('Error uploading receipt:', error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const MobileCard = ({ payment }) => (
    <div className="payment-card">
      <div className="payment-row">
        <div className="payment-label">Request ID</div>
        <div className="payment-value">{payment.requestId}</div>
      </div>
      <div className="payment-row">
        <div className="payment-label">Owner</div>
        <div className="payment-value">{payment.ownername}</div>
      </div>
      <div className="payment-row">
        <div className="payment-label">Distance (km)</div>
        <div className="payment-value">{payment.distance}</div>
      </div>
      <div className="payment-row">
        <div className="payment-label">Transport Charge</div>
        <div className="payment-value">LKR {payment.transportationCharge}</div>
      </div>
      <div className="payment-row">
        <div className="payment-label">Weight (kg)</div>
        <div className="payment-value">{payment.weight}</div>
      </div>
      <div className="payment-row">
        <div className="payment-label">Status</div>
        <div className="payment-value">
          <span className={`status-badge status-${payment.status.toLowerCase()}`}>
            {payment.status}
          </span>
        </div>
      </div>
      <div className="payment-row">
        <div className="payment-label">Action</div>
        <div className="payment-value">
          {(payment.status === 'Pending' || payment.status === 'Declined') ? (
            <button
              className="upload-btn"
              onClick={() => {
                setSelectedPaymentId(payment._id);
                setIsModalOpen(true);
              }}
            >
              Submit Receipt
            </button>
          ) : (
            <span className="no-actions">No actions</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="payments-page">
      <NavbarComponent />
      <ToastContainer position="top-right" />
      
      <div className="payments-container">
        <h2 className="payments-title">Your Payments</h2>
        
        {isMobile ? (
          <div className="mobile-payments">
            {payments.map((payment) => (
              <MobileCard key={payment._id} payment={payment} />
            ))}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Owner</th>
                  <th>Distance</th>
                  <th>Charge</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.requestId}</td>
                    <td>{payment.ownername}</td>
                    <td>{payment.distance} km</td>
                    <td>LKR {payment.transportationCharge}</td>
                    <td>{payment.weight} kg</td>
                    <td>
                      <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {(payment.status === 'Pending' || payment.status === 'Declined') ? (
                        <button
                          className="upload-btn"
                          onClick={() => {
                            setSelectedPaymentId(payment._id);
                            setIsModalOpen(true);
                          }}
                        >
                          Submit Receipt
                        </button>
                      ) : (
                        <span className="no-actions">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{backgroundColor: "white"}}>
            <div className="modal-header">
              <h3>Upload Payment Receipt</h3>
              <button className="close-btn" onClick={() => {
                setIsModalOpen(false);
                setReceiptFile(null);
                setPreviewUrl(null);
              }}>×</button>
            </div>
            
            <div className="upload-area">
              <label className="file-upload-label">
                <div className="upload-icon-large">↑</div>
                <p>Click to upload or drag and drop</p>
                <p className="file-types">PNG, JPG or PDF (MAX. 5MB)</p>
                <input
                  type="file"
                  className="file-input"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {previewUrl && (
              <div className="preview-area">
                <p className="preview-title">Preview:</p>
                {previewUrl.endsWith('.pdf') ? (
                  <p className="pdf-preview">PDF file selected</p>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Receipt preview"
                    className="image-preview"
                  />
                )}
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setIsModalOpen(false);
                  setReceiptFile(null);
                  setPreviewUrl(null);
                }}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleReceiptSubmit}
                disabled={!receiptFile}
              >
                Upload Receipt
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default PaymentsPage;
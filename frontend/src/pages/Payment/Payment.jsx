import React, { useEffect, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent'; 
import Footer from '../../components/Footer/Footer';
import './Payment.css';
import axios from 'axios'; // For making API requests
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [user, setUser] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [receiptFile, setReceiptFile] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const[postimage,setpostimage]= useState({myFile:""})
  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Fetch payments from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(`http://localhost:8000/api/payment/payments/${user._id}`);
          setPayments(response.data);
          setFilteredPayments(response.data);
        } else {
          console.error('No user _id found');
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  // Handle file change
  const handleFileChange = async (event) => {
    const file =event.target.files[0];
    const base64 = await convertTobase64(file) 
    console.log(base64);
    
    setReceiptFile(base64);
  };

  // Submit the receipt
    const handleReceiptSubmit = async (paymentId) => {
      try {
        const response = await axios.post(`http://localhost:8000/api/payment/payments/${paymentId}/receipt`, {
          receiptFile: receiptFile  // base64 string
        }, {
          headers: {
            'Content-Type': 'application/json',  // Set content type as JSON
          },
        });
        console.log(response.data);
        // Optionally refetch payments or update the state to reflect the changes
      } catch (error) {
        console.error('Error uploading receipt:', error);
      }
    };
    

  return (
    <div className="user-home">
      <NavbarComponent />
      <div>
        <hr />
        <h2 style={{ paddingLeft: '40px' }}>Your Payments</h2>
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Distance (km)</th>
              <th>Transportation Charge (LKR)</th>
              <th>Status</th>
              <th>Owner Name</th>
              <th>Weight (kg)</th>
              <th>Payment ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.requestId}</td>
                <td>{payment.distance}</td>
                <td>{payment.transportationCharge}</td>
                <td>{payment.status}</td>
                <td>{payment.ownername}</td>
                <td>{payment.weight}</td>
                <td>{payment.paymentId}</td>
                <td>
                  {payment.status === 'Pending' && (
                    <>
                      <input type="file" onChange={handleFileChange} />
                      <button onClick={() => handleReceiptSubmit(payment._id)}>Submit Receipt</button>
                    </>
                  )}
                  {payment.status === 'Declined' && (
                    <>
                      <input type="file" onChange={handleFileChange} />
                      <button onClick={() => handleReceiptSubmit(payment._id)}>RE-Submit Receipt</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}

export default PaymentsPage;


function convertTobase64(file){
  return new Promise((resolve, reject)=>{
    const fileReader= new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      resolve(fileReader.result)
    };
    fileReader.onerror= (error)=>{
      reject(error)
    }
  })
}
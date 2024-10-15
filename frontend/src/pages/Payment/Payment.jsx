import React, { useState, useEffect } from 'react';
import NavbarComponent from '../../components/NavbarComponent'; 
import Footer from '../../components/Footer/Footer';
import axios from 'axios';


const UserPayments = () => {
    const [payments, setPayments] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchUserPayments(storedUser._id); // Fetch the user's payments on component mount
        }
    }, []);

    const fetchUserPayments = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/payments/user/${userId}`);
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching user payments:', error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadReceipt = async (paymentId) => {
        if (!selectedFile) {
            setMessage('Please select a file to upload.');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('receipt', selectedFile);

        try {
            const response = await axios.post(`http://localhost:8000/api/payments/upload-receipt/${paymentId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message || 'Receipt uploaded successfully!');
            fetchUserPayments(user._id); // Refetch payments after uploading receipt
            setSelectedFile(null);
        } catch (error) {
            setMessage('Error uploading receipt. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
            {/* Navbar */}
            <NavbarComponent />

            <div style={{
                width: '100%',
                maxWidth: '600px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                margin: 'auto',
            }}>
                <h3 style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    color: 'black',
                    fontSize: '36px',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    letterSpacing: '1.56px',
                    wordWrap: 'break-word'
                }}>Your Payments</h3>

                <div>
                    <table style={{ width: '100%', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment._id}>
                                    <td>{payment.requestId}</td>
                                    <td>{payment.status}</td>
                                    <td>
                                        {payment.status === 'Pending' && (
                                            <div>
                                                <input type="file" onChange={handleFileChange} />
                                                <button
                                                    onClick={() => handleUploadReceipt(payment._id)}
                                                    disabled={isUploading}
                                                    style={{
                                                        padding: '10px',
                                                        fontSize: '14px',
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        marginTop: '10px'
                                                    }}
                                                >
                                                    {isUploading ? 'Uploading...' : 'Upload Receipt'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {message && <p style={{ marginTop: '15px', fontSize: '14px', color: '#28a745' }}>{message}</p>}
            </div>

            <Footer />
        </div>
    );
};

export default UserPayments;

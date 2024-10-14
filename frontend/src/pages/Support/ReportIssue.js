import React, { useState, useEffect } from 'react';
//import SupportTicketForm from '../../components/User/SupportTicketForm';
import NavbarComponent from '../../components/NavbarComponent'; 
import Footer from '../../components/Footer/Footer';
import '../Support/reportIssue.css';
import axios from 'axios';

const ReportIssue = () => {

    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchUserTickets(storedUser._id); // Fetch the user's tickets on component mount
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/api/support/create-ticket', {
                userId: user._id, // Use the logged-in user's ID
                issueType,
                description,
            });
            setMessage(response.data.message || 'Ticket submitted successfully!');
            setIssueType('');
            setDescription('');
            // Refetch tickets after submitting
            fetchUserTickets(user._id);
        } catch (error) {
            setMessage('Error submitting ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchUserTickets = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/support/user-tickets/${userId}`);
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching user tickets:', error);
        }
    };

    // Delete ticket function
    const deleteTicket = async (ticketId) => {
        try {
            await axios.delete(`http://localhost:8000/api/support/delete-tickets/${ticketId}`);
            setTickets(tickets.filter(ticket => ticket._id !== ticketId)); // Remove ticket from state
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            margin: 0,
            padding: 0
        }}>
            {/* Navbar */}
            <NavbarComponent />

            <div style={{
                width: '100%',
                maxWidth: '500px',
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
                    fontSize: '64px', 
                    
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    letterSpacing: '2.56px',
                    wordWrap: 'break-word'
                }}>Report Your Issue</h3>

                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div>
                        <label style={{
                            fontSize: '16px',
                            marginBottom: '8px',
                            color: '#555'
                        }}>Issue Type:</label>

                        <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required style={{
                            padding: '10px',
                            fontSize: '14px',
                            marginBottom: '15px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <option value="">Select an issue type</option>
                            <option value="Collection">Collection Issue</option>
                            <option value="Technical">Technical Issue</option>
                            <option value="Routine">Routine Issue</option>
                        </select>
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea style={{
                            padding: '10px',
                            fontSize: '14px',
                            marginBottom: '15px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }} 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required />
                    </div>
                    
                    <button style={{
                        padding: '10px',
                        fontSize: '16px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }} 
                    type="submit" 
                    disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </form>
                {message && <p style={{marginTop: '15px',textAlign: 'center',fontSize: '14px',color: '#1db667'}} >{message}</p>}
            </div>

        <div>
            <hr />
        <h2 style={{paddingLeft: '40px'}}>Your Submitted Tickets</h2>
            <table>
                <thead>
                    <tr>
                        <th>Support ID</th>
                        <th>Issue Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Special Note</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket._id}>
                            <td>{ticket._id}</td>
                            <td>{ticket.issueType}</td>
                            <td>{ticket.description}</td>
                            <td>{ticket.status}</td>
                            <td>
                                {ticket.status === 'Received' && (
                                    <button onClick={() => deleteTicket(ticket._id)}>Delete</button>
                                )}
                            </td>
                            <td>{ticket.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

            <Footer/>
        </div>
    );
};

export default ReportIssue;
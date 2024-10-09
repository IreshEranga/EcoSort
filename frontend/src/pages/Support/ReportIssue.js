import React, { useState, useEffect } from 'react';
//import SupportTicketForm from '../../components/User/SupportTicketForm';
import NavbarComponent from '../UserHome/NavbarComponent'; 
import Footer from '../../components/Footer/Footer';
import './reportIssue.css';
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
        <div className='support-home'>
            {/* Navbar */}
            <NavbarComponent />

            <div className='support-ticket-container'>
                <h2>Report Your Issue</h2>
                <form onSubmit={handleSubmit} className='support-ticket-form'>
                    <div>
                        <label>Issue Type:</label>
                        <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                            <option value="">Select an issue type</option>
                            <option value="Collection">Collection Issue</option>
                            <option value="Technical">Technical Issue</option>
                            <option value="Routine">Routine Issue</option>
                        </select>
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </form>
                {message && <p className="support-ticket-message">{message}</p>}
            </div>

        <div>
            <hr />
        <h2>Your Submitted Tickets</h2>
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
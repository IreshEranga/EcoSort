import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import './reportIssue.css';
import DriverNavBar from './DriverNavBar';

import axios from 'axios';

const ReportIssue = () => {

    const navigate = useNavigate();

    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [isEmergency, setIsEmergency] = useState(false); // New state for emergency
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('driver'));
        console.log('Stored User from localStorage:', storedUser); // Check if this contains _id
        if (storedUser) {
            setUser(storedUser);
            fetchUserTickets(storedUser.id); // Fetch the user's tickets
            console.log('user id: ', storedUser.id)
        }

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('User not found. Please log in again.');
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('User ID being sent:', user.id);
            const response = await axios.post('http://localhost:8000/api/driverSupport/create-driver-ticket', {
                userId: user.id, // Ensure this is passed
                issueType,
                description,
                isEmergency,
                role: "Driver",
            });
            setMessage(response.data.message || 'Ticket submitted successfully!');
            setIssueType('');
            setDescription('');
            fetchUserTickets(user.id);
            setIsEmergency(false);
        } catch (error) {
            console.error('Error submitting ticket:', error);
            setMessage(error.response?.data?.message || 'Error submitting ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchUserTickets = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/driverSupport/driver-tickets/${userId}`);
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching user tickets:', error);
        }
    };

    // Delete ticket function
    const deleteTicket = async (ticketId) => {
        console.log(`Attempting to delete ticket with ID: ${ticketId}`); // Log the ticket ID
        try {
            const response = await axios.delete(`http://localhost:8000/api/driverSupport/delete-driver-tickets/${ticketId}`);
            console.log('Delete Response:', response);
            setTickets(tickets.filter(ticket => ticket._id !== ticketId)); // Remove ticket from state
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };
    

    return (
        <div className='support-home'>
            {/* Navbar */}
            <DriverNavBar />

            <div class="row" style={{paddingTop:'85px'}}>
			    <h1>Report Issue</h1>
	        </div>

            <div class="row">
			    <h4 style={{textAlign: 'center'}}>We're here to help you!</h4>
	        </div>

            <div className="support-ticket-container">
                <form onSubmit={handleSubmit} className="support-ticket-form">
                <div>
                    <label>Issue Type:</label>
                    <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                        <option value="">Select an issue type</option>
                    <option value="Collection">Waste Collection Issue</option>
                    <option value="Bin">Bin Issue</option>
                    <option value="Disposal">Improper Disposal</option>
                    <option value="Technical">Technical Issue</option>
                    </select>
                </div>
                <div>
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="emergency-container">
                    <input 
                        type="checkbox" 
                        checked={isEmergency} 
                        onChange={(e) => setIsEmergency(e.target.checked)} 
                    />
                    <label>Mark as Emergency</label>
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
                        <th style={{color: 'red'}}>Emergency</th>
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
                            <td style={{ color: ticket.isEmergency ? 'red' : 'black' }}>
                                {ticket.isEmergency ? 'Yes' : 'No'}
                            </td>
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
            <p style={{marginLeft:50}}>**Completed support tickets will be removed by the admin</p>
        </div>

            <Footer/>
        </div>
    );
};

export default ReportIssue;
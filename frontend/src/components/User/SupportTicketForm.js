import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ticket.css';

const SupportTicketForm = () => {
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('You must be logged in to raise a support ticket.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/api/support/create-ticket', {
                userId: user.id,
                issueType,
                description,
            });
            setMessage(response.data.message || 'Ticket submitted successfully!');
            setIssueType('');
            setDescription('');
        } catch (error) {
            setMessage('Error submitting ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
    );
};

export default SupportTicketForm;

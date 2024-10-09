import React, { useState } from 'react';
import axios from 'axios';

const SupportTicketForm = () => {
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/api/support/create-ticket', {
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
        <div>
            <h2>Raise a Support Ticket</h2>
            <form onSubmit={handleSubmit}>
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
            {message && <p>{message}</p>}
        </div>
    );
};

export default SupportTicketForm;

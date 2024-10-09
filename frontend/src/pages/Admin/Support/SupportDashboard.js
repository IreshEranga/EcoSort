import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './dashboard.css';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/tickets');
            setTickets(response.data);
        } catch (error) {
            setErrorMessage('Error fetching tickets');
        }
    };

    const handleStatusChange = async (id, status, note) => {
        try {
            await axios.put(`http://localhost:8000/api/admin/tickets/${id}`, { status, note });
            fetchTickets();  // Refresh the list
        } catch (error) {
            setErrorMessage('Error updating ticket');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/tickets/${id}`);
            fetchTickets();  // Refresh the list
        } catch (error) {
            setErrorMessage('Error deleting ticket');
        }
    };

    return (
        <div className='admin-dashboard'>
            <AdminSidebar />

            <div className="main-content">
                <h1 style={{ fontStyle: 'italic' }}>Support Dashboard</h1>
                {errorMessage && <p>{errorMessage}</p>}
                
                <hr />
            <table>
                <thead>
                    <tr>
                        <th>Support ID</th>
                        <th>Issue Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Note</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket._id}>
                            <td>{ticket._id}</td>
                            <td>{ticket.issueType}</td>
                            <td>{ticket.description}</td>
                            <td>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket._id, e.target.value, ticket.note)}
                                >
                                    <option value="Received">Received</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ticket.note || ''}
                                    onChange={(e) => handleStatusChange(ticket._id, ticket.status, e.target.value)}
                                />
                            </td>
                            <td>
                                {ticket.status === 'Completed' && (
                                    <button onClick={() => handleDelete(ticket._id)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
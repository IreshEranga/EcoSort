import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './dashboard.css';

const AdminDashboard = () => {
    const [citizenTickets, setCitizenTickets] = useState([]);
    const [driverTickets, setDriverTickets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchCitizenTickets();
        fetchDriverTickets();
    }, []);

    const fetchCitizenTickets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/citizen-tickets');
            setCitizenTickets(response.data);
        } catch (error) {
            setErrorMessage('Error fetching citizen tickets');
        }
    };

    const fetchDriverTickets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/driver-tickets');
            setDriverTickets(response.data);
        } catch (error) {
            setErrorMessage('Error fetching driver tickets');
        }
    };

    const handleStatusChange = async (id, status, note, type) => {
        try {
            await axios.put(`http://localhost:8000/api/admin/tickets/${id}`, { status, note });
            if (type === 'citizen') {
                fetchCitizenTickets();
            } else {
                fetchDriverTickets();
            }
        } catch (error) {
            setErrorMessage('Error updating ticket');
        }
    };

    const handleDelete = async (id, type) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/tickets/${id}`);
            if (type === 'citizen') {
                fetchCitizenTickets();
            } else {
                fetchDriverTickets();
            }
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
            {/* Citizen Tickets Table */}
            <h2>Citizen Support Tickets</h2>
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
                        {citizenTickets.map(ticket => (
                            <tr key={ticket._id}>
                                <td>{ticket._id}</td>
                                <td>{ticket.issueType}</td>
                                <td>{ticket.description}</td>
                                <td>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value, ticket.note, 'citizen')}
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
                                        onChange={(e) => handleStatusChange(ticket._id, ticket.status, e.target.value, 'citizen')}
                                    />
                                </td>
                                <td>
                                    {ticket.status === 'Completed' && (
                                        <button onClick={() => handleDelete(ticket._id, 'citizen')}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr />

                {/* Driver Tickets Table */}
                <h2>Driver Support Tickets</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Support ID</th>
                            <th>Issue Type</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Emergency</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driverTickets.map(ticket => (
                            <tr key={ticket._id}>
                                <td>{ticket._id}</td>
                                <td>{ticket.issueType}</td>
                                <td>{ticket.description}</td>
                                <td>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value, ticket.note, 'driver')}
                                    >
                                        <option value="Received">Received</option>
                                        <option value="Reviewed">Reviewed</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td style={{ color: ticket.isEmergency ? 'red' : 'black' }}>
                                    {ticket.isEmergency ? 'Yes' : 'No'}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={ticket.note || ''}
                                        onChange={(e) => handleStatusChange(ticket._id, ticket.status, e.target.value, 'driver')}
                                    />
                                </td>
                                <td>
                                    {ticket.status === 'Completed' && (
                                        <button onClick={() => handleDelete(ticket._id, 'driver')}>Delete</button>
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
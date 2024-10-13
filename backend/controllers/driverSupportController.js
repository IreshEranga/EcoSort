const SupportTicket = require('../models/supportModel');
const Driver = require("../models/Driver");

// Create a new driver support ticket
const createDriverTicket = async (req, res) => {
    try {
        const { userId, issueType, description } = req.body;
        console.log('Request Body:', req.body);
        console.log('Received User ID:', userId);
        console.log('Attempting to save ticket with the following data:', { userId, issueType, description });
        // Assuming you have a SupportTicket model
        const savedTicket = await SupportTicket.create({
            userId: userId,
            issueType: issueType,
            description: description,
            status: "Received",
        });

        console.log('Saved Ticket:', savedTicket);

        res.status(201).json({ message: 'Ticket created successfully',savedTicket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create ticket', error: error.message });
    }
};

// Get all tickets
const getDriverTickets = async (req, res) => {
    try {
        const userId = req.params.userId;
        const tickets = await SupportTicket.find({ userId: userId });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
};

const deleteDriverTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        console.log('Ticket ID received in request:', req.params.ticketId);
        const deletedTicket = await SupportTicket.findByIdAndDelete(ticketId);
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error: error.message });
    }
};

module.exports = { createDriverTicket, getDriverTickets,  deleteDriverTicket };
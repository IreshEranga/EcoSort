const SupportTicket = require('../models/supportModel');
const User = require("../models/user");

// Create a new support ticket
const createTicket = async (req, res) => {
    try {
        const { userId, issueType, description } = req.body;

        //const newTicket = new SupportTicket({ userId, issueType, description });
        const savedTicket = await SupportTicket.create({
            userId: userId,
            issueType: issueType,
            description: description,
            status: "Received",
        });

        console.log('Saved Ticket:', savedTicket); // Log the saved ticket
        res.status(201).json({ message: 'Ticket created successfully',savedTicket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create ticket', error: error.message });
    }
};

// Get all tickets
const getUserTickets = async (req, res) => {
    try {
        const userId = req.params.userId;
        const tickets = await SupportTicket.find({ userId: userId });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const deletedTicket = await SupportTicket.findByIdAndDelete(ticketId);
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete ticket', error: error.message });
    }
};

module.exports = { createTicket, getUserTickets,  deleteTicket};

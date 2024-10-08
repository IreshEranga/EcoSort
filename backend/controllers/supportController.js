const SupportTicket = require('../models/supportModel');
const User = require("../models/user");

// Create a new support ticket
const createTicket = async (req, res) => {
    try {
        const { issueType, description } = req.body;

        //const newTicket = new SupportTicket({ userId, issueType, description });
        const savedTicket = await SupportTicket.create({
            issueType: issueType,
            description: description,
            status: "Received",
        });
        res.status(201).json({ message: 'Ticket created successfully',savedTicket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create ticket', error: error.message });
    }
};

// Get all tickets
const getTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
};

module.exports = { createTicket, getTickets };

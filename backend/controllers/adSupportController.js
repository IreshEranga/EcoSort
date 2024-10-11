const SupportTicket = require('../models/supportModel');

const getAllTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
};

const updateTicketStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const ticketId = req.params.id;

        const updatedTicket = await SupportTicket.findByIdAndUpdate(
            ticketId,
            { status: status, note: note || "" },
            { new: true }
        );

        res.status(200).json({ message: 'Ticket status updated', updatedTicket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update ticket', error: error.message });
    }
};

const updateTicketNote = async (req, res) => {
    try {
        const { note } = req.body;
        const ticketId = req.params.ticketId;

        // Find the ticket by ID and update the note
        const updatedTicket = await SupportTicket.findByIdAndUpdate(
            ticketId, 
            { note: note }, 
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Note added/updated successfully', updatedTicket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note', error: error.message });
    }
};

const deleteCompletedTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;

        const ticket = await SupportTicket.findById(ticketId);
        if (ticket.status !== 'Completed') {
            return res.status(400).json({ message: 'Only completed tickets can be deleted' });
        }

        await SupportTicket.findByIdAndDelete(ticketId);
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete ticket', error: error.message });
    }
};

module.exports = { getAllTickets, updateTicketStatus, updateTicketNote, deleteCompletedTicket };
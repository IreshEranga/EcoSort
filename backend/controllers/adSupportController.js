const SupportTicket = require('../models/supportModel');

// Fetch citizen support tickets
const getCitizenTickets = async (req, res) => {
    try {
        const citizenTickets = await SupportTicket.find({ role: "User" });
        res.status(200).json(citizenTickets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching citizen tickets", error });
    }
};

/*const getAllTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
};*/

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

/*const updateTicketNote = async (req, res) => {
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
};*/

// Delete citizen support ticket
const deleteCitizenTicket = async (req, res) => {
    const { id } = req.params; // Get ticket ID from URL

    try {
        const ticket = await SupportTicket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.role !== "User") {
            return res.status(400).json({ message: "This ticket is not a citizen ticket" });
        }

        // Only allow deletion if the ticket is in 'Completed' status
        if (ticket.status !== "Completed") {
            return res.status(400).json({ message: "Only completed tickets can be deleted" });
        }

        await ticket.remove();
        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting citizen ticket", error });
    }
};

/*const deleteCompletedTicket = async (req, res) => {
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
};*/

// Fetch driver support tickets
const getDriverTickets = async (req, res) => {
    try {
        const driverTickets = await SupportTicket.find({ role: "Driver" });
        res.status(200).json(driverTickets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching driver tickets", error });
    }
};

// Delete citizen support ticket
const deleteDriverTicket = async (req, res) => {
    const { id } = req.params; // Get ticket ID from URL

    try {
        const ticket = await SupportTicket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.role !== "Driver") {
            return res.status(400).json({ message: "This ticket is not a driver ticket" });
        }

        // Only allow deletion if the ticket is in 'Completed' status
        if (ticket.status !== "Completed") {
            return res.status(400).json({ message: "Only completed tickets can be deleted" });
        }

        await ticket.remove();
        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting driver ticket", error });
    }
};

module.exports = { getCitizenTickets, updateTicketStatus, deleteCitizenTicket, getDriverTickets, deleteDriverTicket };
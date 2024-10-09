const express = require('express');
const { getAllTickets, updateTicketStatus, deleteCompletedTicket, updateTicketNote } = require('../controllers/adSupportController');
const router = express.Router();

router.get('/tickets', getAllTickets);
router.put('/tickets/:id', updateTicketStatus);
router.delete('/tickets/:id', deleteCompletedTicket);
router.put('/tickets/:ticketId/note', updateTicketNote);

module.exports = router;

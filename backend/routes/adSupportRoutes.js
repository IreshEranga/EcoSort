const express = require('express');
const { getCitizenTickets, updateTicketStatus, deleteCitizenTicket, getDriverTickets, deleteDriverTicket } = require('../controllers/adSupportController');
const router = express.Router();

// Routes for Citizen Support Tickets
router.get('/citizen-tickets', getCitizenTickets);
router.delete('/citizen-tickets/:id', deleteCitizenTicket);

// Routes for Driver Support Tickets
router.get('/driver-tickets', getDriverTickets);
router.delete('/driver-tickets/:id', deleteDriverTicket);

router.put('/tickets/:id', updateTicketStatus);

module.exports = router;

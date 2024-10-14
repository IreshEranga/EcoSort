// backend/routes/driverSuportRoutes.js
const express = require('express');
const router = express.Router();
const { createDriverTicket, getDriverTickets,  deleteDriverTicket } = require('../controllers/driverSupportController');

// Route to create a new driver support ticket
router.post('/create-driver-ticket', createDriverTicket);

// Route to get all tickets for a specific driver
router.get('/driver-tickets/:userId', getDriverTickets);

// Route to delete a specific driver support ticket
router.delete('/delete-driver-tickets/:ticketId', deleteDriverTicket);

module.exports = router;

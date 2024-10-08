const express = require('express');
const router = express.Router();
const { createTicket, getTickets } = require('../controllers/supportController');

router.post('/create-ticket', createTicket);
router.get('/tickets', getTickets);

module.exports = router;

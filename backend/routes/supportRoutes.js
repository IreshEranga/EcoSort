const express = require('express');
const router = express.Router();
const { createTicket, getUserTickets, deleteTicket } = require('../controllers/supportController');

router.post('/create-ticket', createTicket);
router.get('/user-tickets/:userId', getUserTickets);
router.delete('/delete-tickets/:id', deleteTicket);

module.exports = router;

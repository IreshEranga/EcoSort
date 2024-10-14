const express = require('express');
const router = express.Router();
const specialRequestController = require('../controllers/specialRequestController');

// Create a new special request
router.post('/', specialRequestController.createSpecialRequest);

// Get all special requests
router.get('/', specialRequestController.getAllSpecialRequests);

// Get all special requests by user ID
router.get('/user/:userId', specialRequestController.getSpecialRequestsByUserId);

// Update special request by ID (e.g., for admin to update status or amount)
router.put('/:id', specialRequestController.updateSpecialRequest);

// Delete special request by ID
router.delete('/:id', specialRequestController.deleteSpecialRequest);

// Admin calculates the amount for a special request
router.put('/:id/calculate', specialRequestController.calculateAmount);

module.exports = router;
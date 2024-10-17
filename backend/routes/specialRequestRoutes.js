const express = require('express');
const router = express.Router();
const specialRequestController = require('../controllers/specialRequestController');

// Create a new special request
router.post('/', specialRequestController.createSpecialRequest);

// Get all special requests
router.get('/', specialRequestController.getAllSpecialRequests);

// Route to get past special requests
router.get('/past', specialRequestController.getPastSpecialRequests);

// Get all special requests by user ID
router.get('/user/:userId', specialRequestController.getSpecialRequestsByUserId);

// Update special request by ID (e.g., for admin to update status or amount)
router.put('/:id', specialRequestController.updateSpecialRequestStatus);

// Update special request collect status
router.patch('/:id', specialRequestController.updateSpecialRequest);

// Delete special request by ID
router.delete('/:id', specialRequestController.deleteSpecialRequest);

// Admin calculates the amount for a special request
router.put('/:id/calculate', specialRequestController.calculateAmount);

// Route to count all special requests
router.get('/count', specialRequestController.countAllSpecialRequests);

// Route for deleting completed special requests
router.delete('/special-requests/delete-completed', specialRequestController.deleteCompletedSpecialRequests);

module.exports = router;
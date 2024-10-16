// routes/binRoutes.js

const express = require('express');
const router = express.Router();
const binController = require('../controllers/binController');

// Create a new bin
router.post('/', binController.createBin);

// Get all bins
router.get('/', binController.getAllBins);

// Get a bin by ID
router.get('/:id', binController.getBinById);

// Update a bin by ID
router.put('/:id', binController.updateBin);

router.put('/bins/:binId', binController.updateBinByBinId);

// Delete a bin by ID
router.delete('/:id', binController.deleteBin);

// Get all bins by User ID
router.get('/user/:userId', binController.getBinsByUserId);

// Get bins for all users
router.get('/bins/all', binController.getBinsForAllUsers);

module.exports = router;

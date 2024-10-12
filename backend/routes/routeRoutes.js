const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Create a new route
router.post('/routes', routeController.createRoute);

// Get all routes
router.get('/routes', routeController.getRoutes);

// Get a single route by ID
router.get('/routes/:id', routeController.getRouteById);

// Update a route by ID
router.put('/routes/:id', routeController.updateRoute);

// Delete a route by ID
router.delete('/routes/:id', routeController.deleteRoute);

module.exports = router;

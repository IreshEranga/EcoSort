const express = require('express');
const driverController = require('../controllers/driverController');

const router = express.Router();

router.post('/drivers', driverController.createDriver);
router.post('/assignDriver', driverController.assignDriverToRoute);
router.get('/drivers', driverController.getAllDrivers);
router.get('/drivers/:id', driverController.getDriverById);
router.put('/drivers/:id', driverController.updateDriver);
router.delete('/drivers/:id', driverController.deleteDriver);
router.get('/drivers/available/:city', driverController.getAvailableDriversByCity);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Collection = require('../models/Collection');
const User = require('../models/user');

// Signup
router.post('/signup', userController.signup);

// Login
router.post('/login', userController.login);

// Get all users
router.get('/users', userController.getAllUsers);

// Get user by ID
router.get('/users/:id', userController.getUserById);

// Update user
router.put('/users/:id', userController.updateUser);

// Delete user
router.delete('/users/:id', userController.deleteUser);


router.get('/users/count', userController.getUserCount);

// 
router.get('/users/city/:city', userController.getUsersByCity);

// 
router.get('/users/city/:city/door-to-door', userController.getUsersDoorToDoor);

router.put('/users/:id/waste-collection-date', userController.updateWasteCollectionDate);




// Schedule collection
router.post('/schedule', async (req, res) => {
    const { userId, wasteType, scheduledDate } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const newCollection = new Collection({
        user: userId,
        wasteType,
        scheduledDate,
        status: 'pending',
      });
  
      await newCollection.save();
      res.status(201).json({ message: 'Collection scheduled successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling collection', error });
    }
  });

module.exports = router;

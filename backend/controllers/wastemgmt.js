// controllers/paymentController.js
const WasteManagement = require('../models/WasteManagement');
const Receipt = require('../models/Receipt');
const User = require('../models/user');
const Waste = require('../models/WasteManagement'); // Ensure that you have this import if not already present
const mongoose = require('mongoose');

// Create payment for requestId (Admin)
exports.createwaste = async (req, res) => {
    try {
        const { requestId, owner, details } = req.body;
        console.log("Request Body:", req.body); // Log the entire request body for clarity

        // Validate owner format
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        // Find owner from User using owner (which is the User ID)
        const user = await User.findById(owner);
        console.log("User found:", user); // Log the found user object

        if (!user) {
            return res.status(404).json({ message: 'User ID not found.' });
        }

        const newWaste = new Waste({
            requestId,
            owner,
            details
        });

        await newWaste.save();
        res.status(201).json(newWaste);
    } catch (error) {
        console.error("Error creating new Waste:", error); // Log the error object for debugging
        res.status(500).json({ message: 'Error creating new Waste.', error: error.message }); // Include error message in the response
    }
};

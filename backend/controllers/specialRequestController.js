const SpecialRequest = require('../models/SpecialRequest');

// Create a special request
exports.createSpecialRequest = async (req, res) => {
  try {
    const newRequest = new SpecialRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all special requests
exports.getAllSpecialRequests = async (req, res) => {
  try {
    const requests = await SpecialRequest.find().populate('user', 'firstName lastName email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all special requests by user ID
exports.getSpecialRequestsByUserId = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.userId; // Assuming userId is passed as a URL parameter

    // Find all special requests that belong to the user
    const requests = await SpecialRequest.find({ user: userId }).populate('user', 'firstName lastName email');

    if (requests.length === 0) {
      return res.status(404).json({ message: 'No special requests found for this user' });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update special request by ID (e.g., for updating status or amount by admin)
exports.updateSpecialRequest = async (req, res) => {
  try {
    const updatedRequest = await SpecialRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRequest) return res.status(404).json({ message: 'Special request not found' });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete special request by ID
exports.deleteSpecialRequest = async (req, res) => {
  try {
    const deletedRequest = await SpecialRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ message: 'Special request not found' });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin calculates the amount for a special request (this will be shown to the user later)
exports.calculateAmount = async (req, res) => {
  try {
    const request = await SpecialRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Special request not found' });

    // Assume a simple formula for amount calculation (e.g., quantity * some rate)
    const rate = 5; // Example rate per unit of waste
    request.amount = request.quantity * rate;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
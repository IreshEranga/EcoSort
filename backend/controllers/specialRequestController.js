const SpecialRequest = require('../models/SpecialRequest');

// Create a special waste request
exports.createRequest = async (req, res) => {
  try {
    const { userId, description, wasteType } = req.body;
    const newRequest = new SpecialRequest({
      userId,
      description,
      wasteType
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all special waste requests for the logged-in user
exports.getRequests = async (req, res) => {
  try {
    const requests = await SpecialRequest.find({ userId: req.user._id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
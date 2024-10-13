// controllers/binController.js

const Bin = require('../models/bin'); // Adjust the path as needed

// Create a new bin
exports.createBin = async (req, res) => {
  try {
    const newBin = new Bin(req.body);
    await newBin.save();
    res.status(201).json(newBin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bins
exports.getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().populate('user', 'name email'); // Adjust fields as necessary
    res.status(200).json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a bin by ID
exports.getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id).populate('user', 'name email');
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.status(200).json(bin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a bin by ID
exports.updateBin = async (req, res) => {
  try {
    const updatedBin = await Bin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBin) return res.status(404).json({ message: 'Bin not found' });
    res.status(200).json(updatedBin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a bin by ID
exports.deleteBin = async (req, res) => {
  try {
    const deletedBin = await Bin.findByIdAndDelete(req.params.id);
    if (!deletedBin) return res.status(404).json({ message: 'Bin not found' });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all bins by user ID
exports.getBinsByUserId = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.userId; // Assuming userId is passed as a URL parameter

    // Find all bins that belong to the user
    const bins = await Bin.find({ user: userId }).populate('user', 'name email'); // Populate user fields as needed

    if (bins.length === 0) {
      return res.status(404).json({ message: 'No bins found for this user' });
    }

    res.status(200).json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

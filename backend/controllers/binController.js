// controllers/binController.js
const Bin = require('../models/Bin');

// Create a new bin
const createBin = async (req, res) => {
  try {
    const bin = new Bin(req.body);
    await bin.save();
    res.status(201).json(bin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bins
const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().populate('user'); // Populate user reference
    res.json(bins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a bin by ID
const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id).populate('user');
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json(bin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a bin
const updateBin = async (req, res) => {
  try {
    const bin = await Bin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json(bin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a bin
const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json({ message: 'Bin deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBin,
  getAllBins,
  getBinById,
  updateBin,
  deleteBin,
};
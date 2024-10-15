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
    const bins = await Bin.find().populate('user', 'name email location'); // Adjust fields as necessary
    res.status(200).json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a bin by ID
exports.getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id).populate('user', 'name email location');
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
    const userId = req.params.userId;
    const bins = await Bin.find({ user: userId }).populate('user', 'name email location');
    if (bins.length === 0) {
      return res.status(404).json({ message: 'No bins found for this user' });
    }
    res.status(200).json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get bins for all users
/*
exports.getBinsForAllUsers = async (req, res) => {
  try {
    const bins = await Bin.find()
      .populate('user', 'userId firstName lastName') // Adjust fields as necessary
      .select('binId qrCode percentage user'); // Select only the fields you need

    // Map the bins to include userId, name (full name), binId, qr, and percentage
    const result = bins.map(bin => ({
      userId: bin.user.userId,
      name: `${bin.user.firstName} ${bin.user.lastName}`, // Combine first and last name
      binId: bin.binId,
      qr: bin.qrCode,
      percentage: bin.percentage
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

*/

exports.getBinsForAllUsers = async (req, res) => {
  try {
    const bins = await Bin.find()
      .populate('user', 'userId firstName lastName location address city wasteCollectionDate') // Adjust fields as necessary
      .select('binId qrCode percentage user type status'); // Select binType in addition to other fields

    // Create an object to group bins by user
    const groupedBins = {};

    bins.forEach(bin => {
      const userId = bin.user.userId;
      const userName = `${bin.user.firstName} ${bin.user.lastName}`;
      const location = bin.user.location;
      const address = bin.user.address;
      const city = bin.user.city;
      const wasteCollectionDate = bin.user.wasteCollectionDate;
      const binInfo = {
        binId: bin.binId,
        qr: bin.qrCode,
        percentage: bin.percentage,
        type: bin.type ,
        status: bin.status
      };

      // Check if the user already exists in the groupedBins
      if (!groupedBins[userId]) {
        groupedBins[userId] = {
          userId,
          name: userName,
          location,
          address,
          city,
          wasteCollectionDate,
          bins: [] // Initialize bins array
        };
      }

      // Push the bin information to the user's bins array
      groupedBins[userId].bins.push(binInfo);
    });

    // Convert groupedBins object to an array
    const result = Object.values(groupedBins);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


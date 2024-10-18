const SpecialRequest = require('../models/SpecialRequest');
const sendEmailToDriver = require('../util/sendEmailToDriver');
const Driver = require('../models/Driver');


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
    const requests = await SpecialRequest.find()
      .populate('user', 'firstName lastName email userId location city')
      .populate('assignedDriver');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get past special requests (date is earlier than today)
exports.getPastSpecialRequests = async (req, res) => {
  try {
    const today = new Date();
    const pastRequests = await SpecialRequest.find({ date: { $lt: today } })
      .populate('user', 'firstName lastName email userId location');
      
    if (pastRequests.length === 0) {
      return res.status(404).json({ message: 'No past special requests found' });
    }
    
    res.status(200).json(pastRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get special requests by user ID
exports.getSpecialRequestsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await SpecialRequest.find({ user: userId })
      .populate('user', 'firstName lastName email');
    
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No special requests found for this user' });
    }
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update special request collect status
exports.updateSpecialRequest = async (req, res) => {
  const { collectStatus } = req.body;

  try {
    const updatedRequest = await SpecialRequest.findByIdAndUpdate(
      req.params.id,
      { collectStatus },
      { new: true } // Return the updated document
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Calculate the amount for a special request
exports.calculateAmount = async (req, res) => {
  try {
    const request = await SpecialRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Special request not found' });

    const rate = 5; // Example rate per unit of waste
    request.amount = request.quantity * rate;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update special request status by ID
exports.updateSpecialRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // Get the new status from the request body
    const updatedRequest = await SpecialRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) return res.status(404).json({ message: 'Special request not found' });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Count all special requests
exports.countAllSpecialRequests = async (req, res) => {
  try {
    const count = await SpecialRequest.countDocuments();
    res.status(200).json({ totalRequests: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete completed special requests
exports.deleteCompletedSpecialRequests = async (req, res) => {
  try {
    const result = await SpecialRequest.deleteMany({ collectStatus: 'Complete' });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No completed special requests found to delete' });
    }

    res.status(200).json({ message: `${result.deletedCount} completed special requests deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Assign a driver to a special request
exports.assignDriverToSpecialRequest = async (req, res) => {
  const { driverId } = req.body; // Get the driver ID from the request body

  try {
    // Find the special request by ID
    const updatedRequest = await SpecialRequest.findByIdAndUpdate(
      req.params.id, // Get the special request ID from the request parameters
      { assignedDriver: driverId ,
        collectStatus:'Assigned'
      }, // Update the assignedDriver field
      { new: true, runValidators: true } // Return the updated document with validation
    );

    // Check if the request was found and updated
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Special request not found' });
    }
// Send email notification to driver
    const driver = await Driver.findById(driverId); // Fetch driver details
    await sendEmailToDriver(driver.email, updatedRequest.requestId, driver.name);
    // Respond with the updated request
    res.status(200).json(updatedRequest);
  } catch (error) {
    // Handle errors, including validation errors
    res.status(400).json({ message: error.message });
  }
};


exports.assignDriverSpecialRequest = async (req, res) => {
  try {
    const { specialRequestId, driverId } = req.body;

    // Find the special request by ID
    const specialRequest = await SpecialRequest.findById(specialRequestId).populate('user');
    if (!specialRequest) {
      return res.status(404).json({ message: 'Special Request not found' });
    }

    // Find the driver by ID
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Assign the driver to the special request
    specialRequest.assignedDriver = driverId;
    specialRequest.status = 'Assigned'; // Optionally update request status
    await specialRequest.save();

    // Update the driver's status and assign route (user location)
    driver.status = 'onRide';
    driver.assignedRoutes.push(specialRequest.user._id); // Assuming the user location acts as the assigned route
    await driver.save();

    // Send email notification to the driver
    //await sendAssignmentEmail(driver.email, driver.name, specialRequest.description);

    res.status(200).json({ message: 'Driver assigned to the special request successfully!' });
  } catch (error) {
    console.error('Error assigning driver to special request:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};



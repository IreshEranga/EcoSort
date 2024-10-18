const nodemailer = require('nodemailer');
const Driver = require('../models/Driver');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const crypto = require('crypto');
const sendEmail =  require('../util/sendEmail');
const sendAssignmentEmail = require('../util/DriverAssignEmail');
const Route = require('../models/routeModel');
const APP_PASSWORD = process.env.APP_PASSWORD;
const EMAIL = process.env.EMAIL;


console.log('Environment Variables:', process.env.APP_PASSWORD);


// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service provider
  auth: {
    user: EMAIL, // Use environment variables
    pass: process.env.APP_PASSWORD  // Use environment variables
  }
});

// Generate a random password
function generatePassword() {
  return crypto.randomBytes(6).toString('hex'); // Generates a 12-character password
}

// Create a driver
exports.createDriver = async (req, res) => {
  try {
    const { name, address, mobile, email, city, status } = req.body;

    // Check for existing driver
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(409).json({
        success: false,
        message: "Driver already exists",
      });
    }

    // Generate and hash the password
    const generatedPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create a new driver with the generated password
    const driver = new Driver({
      name,
      address,
      mobile,
      email,
      password: hashedPassword, // Save the hashed password
      city,
      status,
    });

    // Save the driver to the database
    await driver.save();

    // Send an email with the generated password
    const mailOptions = {
      from:`"ECO SORT" <${EMAIL}>`, // Sender address
      to: driver.email,              // Receiver address (driver's email)
      subject: 'Your Driver Account Password',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Hello ${driver.name},</h2>
          <p>Your driver account has been created successfully for <strong>Eco SORT</strong>.</p>
          <p>Your login password is: <strong style="color: #FF5722;">${generatedPassword}</strong></p>
          <p>Please change your password after logging in.</p>
          <p>Best Regards,<br>The Eco SORT Team</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Email sent:', info.response);
      res.status(201).json({
        success: true,
        driver: {
          _id: driver._id,
          name: driver.name,
          email: driver.email,
          city: driver.city,
          status: driver.status,
        },
        message: "Driver created successfully",
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal server error",
    });
  }
};

// Other driver-related functions (getAllDrivers, getDriverById, updateDriver, deleteDriver, getAvailableDriversByCity) remain unchanged.


// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update driver by ID
exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete driver by ID
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get available drivers by city
exports.getAvailableDriversByCity = async (req, res) => {
  try {
    const availableDrivers = await Driver.find({ city: req.params.city, status: 'available' });
    res.status(200).json(availableDrivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get available drivers by city and date
exports.getAvailableDriversByCityAndDate = async (req, res) => {
  try {
    const { city, date } = req.params;
    const availableDrivers = await Driver.find({
      city,
      status: 'available',
      // Add any additional date filtering logic here if needed
    });
    res.status(200).json(availableDrivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle driver assignment to a route (this can be a new function)
exports.assignDriverToRoute = async (req, res) => {
  try {
    const { routeId, driverId } = req.body;

    // Find the route by ID and assign the driver
    const route = await Route.findById(routeId); // Assuming you have a Route model
    const driver = await Driver.findById(driverId);

    if (!route || !driver) {
      return res.status(404).json({ message: 'Route or Driver not found' });
    }

    // Assign driver to the route
    route.assignedDriver = driverId;
    await route.save();

    // Update driver's status
    driver.status = 'onRide';
    await driver.save();

    // Send email to the driver
    await sendAssignmentEmail(driver.email, driver.name, route.routeName);

    res.status(200).json({ message: 'Driver assigned successfully and email sent!' });
  } catch (error) {
    console.error('Error assigning driver:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};




// Driver login without JWT
exports.driverLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the driver exists
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Send response with driver details (no token)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        city: driver.city,
        status: driver.status,
        role: driver.role,
      },
    });

  } catch (error) {
    console.error('Error during driver login:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

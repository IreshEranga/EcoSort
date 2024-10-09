const User = require('../models/user');
const bcrypt = require('bcrypt');

// Signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, address, city, type, password, latitude, longitude, role } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      address,
      city,
      type,
      password: hashedPassword,
      location: { latitude, longitude },
      role
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};


// Get user count
// Get user count
exports.getUserCount = async (req, res) => {
  try {
    console.log("Fetching user count..."); // Log for debugging
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching user count:', error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching user count', error });
  }
};

// Get users by city and display in alphabetical order
exports.getUsersByCity = async (req, res) => {
  try {
    const { city } = req.params;

    // Find users by city and sort by firstName in alphabetical order
    const users = await User.find({ city }).sort({ firstName: 1 });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: `No users found in city: ${city}` });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by city', error });
  }
};


// Get users by city and sort in a "door-to-door" sequence based on location
exports.getUsersDoorToDoor = async (req, res) => {
  try {
    const { city } = req.params;

    // Find users by city and sort by latitude first, then by longitude
    const users = await User.find({ city }).sort({
      'location.latitude': -1,  // Sort by latitude
      'location.longitude': -1  // Then by longitude
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: `No users found in city: ${city}` });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users by door-to-door location', error });
  }
};

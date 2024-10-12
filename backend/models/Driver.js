const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['available', 'unavailable', 'onRide'], default: 'available' },
  assignedRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  city: { type: String, required: true },
  role:{type: String, default:'Driver'}
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;

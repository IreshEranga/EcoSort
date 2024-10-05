const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  assignedRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;

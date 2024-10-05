const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledDate: Date,
  wasteType: String, // Example: 'general', 'recyclable', 'hazardous'
  status: { type: String, enum: ['pending', 'collected'], default: 'pending' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;

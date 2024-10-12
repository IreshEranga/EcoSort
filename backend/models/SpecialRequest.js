const mongoose = require('mongoose');

const specialRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  wasteType: { type: String, enum: ['Organic', 'Recycle', 'Other'], required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

const SpecialRequest = mongoose.model('SpecialRequest', specialRequestSchema);
module.exports = SpecialRequest;
const mongoose = require('mongoose');

const specialRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteType: {
    type: String,
    enum: ['Organic', 'Paper', 'Plastic', 'Electric', 'Other'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String, // e.g. '08:00 AM'
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  amount: {
    type: Number,
    default: 0  // Admin can calculate and update this field later
  }
}, { timestamps: true });

const SpecialRequest = mongoose.model('SpecialRequest', specialRequestSchema);
module.exports = SpecialRequest;
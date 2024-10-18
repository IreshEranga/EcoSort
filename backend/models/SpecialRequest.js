const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
  status:{
    type:String, default:'Pending', 
    enum: ['Pending', 'Accepted']
  },
  amount: {
    type: Number,
    default: 0  // Admin can calculate and update this field later
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Done'],
    default: 'Pending'
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver'
  },
  collectStatus:{
    type:String, default:'Not Complete', 
    enum: ['Completed', 'Assigned', 'Not Complete'],
  }
}, { timestamps: true });

// Auto-increment user ID
specialRequestSchema.plugin(AutoIncrement, { inc_field: 'requestId' });

const SpecialRequest = mongoose.model('SpecialRequest', specialRequestSchema);
module.exports = SpecialRequest;
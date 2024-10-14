const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  routes: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  ],
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver'
  },
  date:{type : String},
  city:{type : String},
  status:{type:String, default:'Not Complete', enum: ['Completed', 'Not Complete'],}
}, { timestamps: true });

module.exports = mongoose.model('Route', RouteSchema);

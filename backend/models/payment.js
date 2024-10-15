// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    distance: { type: Number, required: true },
    transportationCharge: { type: Number, required: true },
    weight: { type: Number, required: true },
    additionalCharges: { type: Number },
    chargingModel: { type: String },
    status: { type: String, enum: ['Pending', 'To Be Reviewed', 'Approved', 'Declined'], default: 'Pending' },
    receipt: { type: String },  // Link to uploaded receipt file
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Payment', paymentSchema);




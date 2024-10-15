// models/Receipt.js
const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    receiptFile: { type: String, required: true },
    status: { type: String, enum: ['Reviewed', 'Pending'], default: 'Pending' }
});

module.exports = mongoose.model('Receipt', receiptSchema);

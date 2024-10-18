const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const paymentSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    distance: { type: Number, required: true },
    transportationCharge: { type: Number, required: true },
    weight: { type: Number, required: true },
    additionalCharges: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownername: { type:String, ref: 'User', required: true },

    status: { type: String, default: 'Pending' },  // Add default status
    receiptFile: { type: String },  // For storing the receipt path
    paymentId: { type: Number, unique: true },  // Auto-incrementing paymentId
    createdAt: { type: Date, default: Date.now }
});

// Add auto-increment plugin to paymentSchema
paymentSchema.plugin(AutoIncrement, { inc_field: 'paymentId' });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

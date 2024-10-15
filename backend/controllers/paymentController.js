// controllers/paymentController.js
const Payment = require('../models/payment');
const WasteManagement = require('../models/WasteManagement');
const Receipt = require('../models/Receipt');

// Create payment for requestId (Admin)
exports.createPayment = async (req, res) => {
    try {
        const { requestId, distance, transportationCharge, weight, additionalCharges, chargingModel } = req.body;

        // Find owner from WasteManagement using requestId
        const waste = await WasteManagement.findOne({ requestId });
        if (!waste) {
            return res.status(404).json({ message: 'Request ID not found.' });
        }

        const newPayment = new Payment({
            requestId,
            distance,
            transportationCharge,
            weight,
            additionalCharges,
            chargingModel,
            owner: waste.owner
        });

        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment.', error });
    }
};

// Get all payments for a user
exports.getPaymentsForUser = async (req, res) => {
    try {
        const payments = await Payment.find({ owner: req.user._id });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments.', error });
    }
};


// Get all payments
exports.getPayments = async (req, res) => {
  try {
      const payments = await Payment.find()
      res.status(200).json(payments);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching payments.', error });
  }
};
// Upload receipt for a payment (User)
exports.uploadReceipt = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const receiptFile = req.file.path;  // Assume the receipt is uploaded via multer
        
        const receipt = new Receipt({
            paymentId,
            receiptFile
        });

        await receipt.save();

        // Update payment status
        await Payment.findByIdAndUpdate(paymentId, { status: 'To Be Reviewed' });

        res.status(200).json({ message: 'Receipt uploaded successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading receipt.', error });
    }
};

// Review and update payment status (Admin)
exports.reviewPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        if (!['Approved', 'Declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        await Payment.findByIdAndUpdate(paymentId, { status });
        res.status(200).json({ message: 'Payment status updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error reviewing payment.', error });
    }
};

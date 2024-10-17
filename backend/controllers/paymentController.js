// controllers/paymentController.js
const Payment = require('../models/payment');
const WasteManagement = require('../models/WasteManagement');
const SpecialRequest = require('../models/SpecialRequest');
const Receipt = require('../models/Receipt');
const User= require('../models/user')

// Create payment for requestId (Admin)
exports.createPayment = async (req, res) => {
    try {
        const { requestId, distance, transportationCharge, weight, additionalCharges, chargingModel } = req.body;

        // Find the special request and populate the user details
        const specialReq = await SpecialRequest.findOne({ requestId }).populate('user');
        if (!specialReq) {
            return res.status(404).json({ message: 'Request ID not found.' });
        }

        const ownerDetails = specialReq.user;
        console.log(ownerDetails);
        
        const ownerName = `${ownerDetails.firstName} ${ownerDetails.lastName}`;
        console.log(ownerName);

        const newPayment = new Payment({
            requestId,
            distance,
            transportationCharge,
            weight,
            additionalCharges,
            owner: ownerDetails._id,
            ownername: ownerName
        });

        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment.', error: error.message });
    }
};
// Get all payments for a user
exports.getPaymentsForUser = async (req, res) => {
  try {
    // Extract 'id' from req.params (since the route uses :id, not userId)
    const { id } = req.params;
    console.log("userId", id); // This will now log the correct user _id

    // Assuming you are querying the database using the user's _id
    const payments = await Payment.find({ owner: id }); // Assuming user field references the user in Payment model
    
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


// Get all recipt
// exports.getRecipt = async (req, res) => {
//   try {
//     const { id } = req.params;
//       const recipt = await Receipt.find(id)
//       res.status(200).json(recipt);
//   } catch (error) {
//       res.status(500).json({ message: 'Error fetching payments.', error });
//   }
// };

// exports.getReceipt = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const receipt = await Receipt.findOne({ paymentId });
//     if (!receipt) {
//       return res.status(404).json({ message: 'Receipt not found' });
//     }
    
//     // Since the receipt file is stored in MongoDB, we can send it directly
//     res.status(200).json({
//       _id: receipt._id,
//       paymentId: receipt.paymentId,
//       receiptFile: receipt.receiptFile,
//       status: receipt.status
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching receipt', error });
//   }
// };

exports.getReceipt = async (req, res) => {
  try {
      const { paymentId } = req.params;
      const receipt = await Receipt.findOne({ paymentId });
      if (!receipt) {
          return res.status(404).json({ message: 'Receipt not found' });
      }

      // Send the base64 string to the frontend
      res.status(200).json({
          _id: receipt._id,
          paymentId: receipt.paymentId,
          receiptFile: receipt.receiptFile,  // Base64 string
          status: receipt.status
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching receipt', error });
  }
};


// Upload receipt for a payment (User)
  exports.uploadReceipt = async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { receiptFile } = req.body;  // Base64-encoded file
  
      if (!receiptFile) {
        return res.status(400).json({ message: 'No receipt file provided.' });
      }
  
      // Store the base64 string in the database
      const receipt = new Receipt({
        paymentId,
        receiptFile  // Store the base64 string directly
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
      console.log('Received status:', status);

      if (!['Approved', 'Declined'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status.' });
      }

      await Payment.findByIdAndUpdate(paymentId, { status });

      if (status === 'Declined') {
          const receipt = await Receipt.findOneAndDelete({ paymentId });
          if (!receipt) {
              return res.status(404).json({ message: 'Receipt not found' });
          }
      }

      res.status(200).json({ message: 'Payment status updated successfully.' });
  } catch (error) {
      console.error('Error reviewing payment:', error);
      res.status(500).json({ message: 'Error reviewing payment.', error: error.message });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
      const { paymentId } = req.params;
      const receipt = await Receipt.findOneAndDelete({ paymentId });
      if (!receipt) {
          return res.status(404).json({ message: 'Receipt not found' });
      }

      // Optionally, you can also update the payment status
      await Payment.findByIdAndUpdate(paymentId, { status: 'Pending' });

      res.status(200).json({ message: 'Receipt deleted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting receipt.', error });
  }
};


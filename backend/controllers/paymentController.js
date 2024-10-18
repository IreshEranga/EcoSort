// controllers/paymentController.js
const Payment = require('../models/payment');
const WasteManagement = require('../models/WasteManagement');
const nodemailer = require('nodemailer');

const SpecialRequest = require('../models/SpecialRequest');
const Receipt = require('../models/Receipt');
const User= require('../models/user')
const APP_PASSWORD = process.env.APP_PASSWORD;
const EMAIL = process.env.EMAIL;


// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service provider
  auth: {
    user: EMAIL, // Use environment variables
    pass: process.env.APP_PASSWORD  // Use environment variables
  }
});


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


        // const totalAmount = transportationCharge + (additionalCharges || 0);
                // Update the amount in SpecialRequest
                specialReq.amount =  transportationCharge + (additionalCharges || 0);
                specialReq.paymentStatus = 'Pending';  // Optionally set or modify the payment status here
                await specialReq.save();


        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment.', error: error.message });
    }
};


// Create payment for requestId (Admin)
// exports.createPayment = async (req, res) => {
//   try {
//       const { requestId, distance, transportationCharge, weight, additionalCharges, chargingModel } = req.body;

//       // Find the special request and populate the user details
//       const specialReq = await SpecialRequest.findOne({ requestId }).populate('user');
//       if (!specialReq) {
//           return res.status(404).json({ message: 'Request ID not found.' });
//       }

//       const ownerDetails = specialReq.user;
//       console.log(ownerDetails);
      
//       const ownerName = `${ownerDetails.firstName} ${ownerDetails.lastName}`;
//       console.log(ownerName);

//       // Calculate total amount (for example purposes, adjust calculation as needed)
//       const totalAmount = transportationCharge + additionalCharges + (weight * chargingModel);

//       // Create new payment
//       const newPayment = new Payment({
//           requestId,
//           distance,
//           transportationCharge,
//           weight,
//           additionalCharges,
//           owner: ownerDetails._id,
//           ownername: ownerName
//       });

//       await newPayment.save();

//       // Update the amount in SpecialRequest
//       specialReq.amount = totalAmount;
//       specialReq.paymentStatus = 'Pending';  // Optionally set or modify the payment status here
//       await specialReq.save();

//       res.status(201).json({ newPayment, specialReq });
//   } catch (error) {
//       res.status(500).json({ message: 'Error creating payment.', error: error.message });
//   }
// };


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
  

// // Review and update payment status (Admin)
// exports.reviewPayment = async (req, res) => {
//   try {
//       const { paymentId } = req.params;
//       const { status } = req.body;
//       console.log('Received status:', status);

//       if (!['Approved', 'Declined'].includes(status)) {
//           return res.status(400).json({ message: 'Invalid status.' });
//       }

//       await Payment.findByIdAndUpdate(paymentId, { status });

//       if (status === 'Declined') {
//           const receipt = await Receipt.findOneAndDelete({ paymentId });
//           if (!receipt) {
//               return res.status(404).json({ message: 'Receipt not found' });
//           }
//       }



      


//           // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error sending email:', error);
//         return res.status(500).json({ message: 'Error sending email' });
//       }
//       console.log('Email sent:', info.response);
//       res.status(201).json({
//         success: true,
//         driver: {
//           _id: driver._id,
//           name: driver.name,
//           email: driver.email,
//           city: driver.city,
//           status: driver.status,
//         },
//         message: "Driver created successfully",
//       });
//     });

      

//       res.status(200).json({ message: 'Payment status updated successfully.' });
//   } catch (error) {
//       console.error('Error reviewing payment:', error);
//       res.status(500).json({ message: 'Error reviewing payment.', error: error.message });
//   }
// };




// Review and update payment status (Admin)
// exports.reviewPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const { status } = req.body;
//     console.log('Received status:', status);

//     if (!['Approved', 'Declined'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status.' });
//     }

//     // Find the payment and its associated owner
//     const payment = await Payment.findById(paymentId).populate('owner');
//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found.' });
//     }

//     const owner = payment.owner; // Owner is the user
//     if (!owner) {
//       return res.status(404).json({ message: 'Owner not found for the payment.' });
//     }

//     // Update the payment status
//     await Payment.findByIdAndUpdate(paymentId, { status });

//     // If status is 'Declined', delete the associated receipt
//     if (status === 'Declined') {
//       const receipt = await Receipt.findOneAndDelete({ paymentId });
//       if (!receipt) {
//         return res.status(404).json({ message: 'Receipt not found' });
//       }
//     }

//     // Prepare email content for the owner
//     const mailOptions = {
//       from: `"ECO SORT" <${EMAIL}>`, // Sender address
//       to: owner.email,               // Receiver address (owner's email)
//       subject: `Payment ${status}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
//           <h2 style="color: #4CAF50;">Hello ${owner.firstName} ${owner.lastName},</h2>
//           <p>Your payment with ID <strong>${paymentId}</strong> has been <strong>${status}</strong>.</p>
//           <p>Please check your account for more details.</p>
//           <p>Best Regards,<br>The Eco SORT Team</p>
//         </div>
//       `,
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error sending email:', error);
//         // Log the error but still respond with a successful status update
//         return res.status(200).json({
//           message: 'Payment status updated, but failed to send email notification.',
//           error: error.message,
//         });
//       }

//       console.log('Email sent:', info.response);
//       res.status(200).json({
//         message: 'Payment status updated and email sent successfully.',
//         emailResponse: info.response,
//       });
//     });

//   } catch (error) {
//     console.error('Error reviewing payment:', error);
//     res.status(500).json({ message: 'Error reviewing payment.', error: error.message });
//   }
// };

// Review and update payment status (Admin)
exports.reviewPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    console.log('Received status:', status);

    if (!['Approved', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    // Find the payment and its associated owner
    const payment = await Payment.findById(paymentId).populate('owner');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    const owner = payment.owner; // Owner is the user
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found for the payment.' });
    }

    // Update the payment status
    await Payment.findByIdAndUpdate(paymentId, { status });

    // Find the associated SpecialRequest by requestId
    const specialReq = await SpecialRequest.findOne({ requestId: payment.requestId });
    if (!specialReq) {
      return res.status(404).json({ message: 'Special Request not found.' });
    }

    // Update the paymentStatus in SpecialRequest based on the payment status
    if (status === 'Approved') {
      specialReq.paymentStatus = 'Done';  // Mark payment as done
    } else if (status === 'Declined') {
      specialReq.paymentStatus = 'Pending';  // Revert to pending if payment declined
    }

    await specialReq.save();

    // If status is 'Declined', delete the associated receipt
    if (status === 'Declined') {
      const receipt = await Receipt.findOneAndDelete({ paymentId });
      if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
      }
    }

    // Prepare email content for the owner
    const mailOptions = {
      from: `"ECO SORT" <${EMAIL}>`, // Sender address
      to: owner.email,               // Receiver address (owner's email)
      subject: `Payment ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Hello ${owner.firstName} ${owner.lastName},</h2>
          <p>Your payment with ID <strong>${paymentId}</strong> has been <strong>${status}</strong>.</p>
          <p>Please check your account for more details.</p>
          <p>Best Regards,<br>The Eco SORT Team</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        // Log the error but still respond with a successful status update
        return res.status(200).json({
          message: 'Payment status updated, but failed to send email notification.',
          error: error.message,
        });
      }

      console.log('Email sent:', info.response);
      res.status(200).json({
        message: 'Payment status updated and email sent successfully.',
        emailResponse: info.response,
      });
    });

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





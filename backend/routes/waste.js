// routes/paymentRoutes.js
const express = require('express');
const multer = require('multer');
const { createwaste } = require('../controllers/wastemgmt');

const router = express.Router();
const upload = multer({ dest: 'uploads/receipts/' });  // Multer configuration for file upload

// Admin creates a payment for a request
router.post('/waste', createwaste);

// // Get payments for a specific user
// router.get('/payments/user', getPaymentsForUser);
// router.get('/allpayments', getPayments);



// // User uploads a receipt for a payment
// router.post('/payments/:paymentId/receipt', upload.single('receiptFile'), uploadReceipt);

// // Admin reviews a payment receipt
// router.post('/payments/:paymentId/review', reviewPayment);

module.exports = router;

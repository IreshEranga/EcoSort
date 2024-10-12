// models/Bin.js
const mongoose = require('mongoose');
const QRCode = require('qrcode'); // For generating QR codes

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Organic', 'Recycle', 'Other'],
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  qrCode: {
    type: String, // Store the QR code as a string (URL or base64)
  },
});

// Middleware to generate QR code before saving
binSchema.pre('save', async function (next) {
  try {
    const qrCodeUrl = await QRCode.toDataURL(this.binId); // Generate QR code based on binId
    this.qrCode = qrCodeUrl;
    next();
  } catch (error) {
    next(error);
  }
});

const Bin = mongoose.model('Bin', binSchema);

module.exports = Bin;
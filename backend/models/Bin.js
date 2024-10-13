const mongoose = require('mongoose');
const QRCode = require('qrcode');

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Organic', 'Paper', 'Plastic', 'Electric', 'Other'],
    required: true,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  qrCode: {
    type: String, // Store QR code as a base64 string
  },
});

/// Middleware to auto-generate binId before saving
binSchema.pre('save', async function (next) {
  const bin = this;

  try {
    console.log('Middleware triggered'); // Add this line for debugging

    // Only generate a binId if it doesn't already exist
    if (!bin.binId) {
      // Find the latest bin based on the binId field
      const lastBin = await mongoose.model('Bin').findOne().sort({ binId: -1 }).exec();

      if (lastBin) {
        // Extract the numeric part of the last binId and increment it
        const lastBinIdNum = parseInt(lastBin.binId.replace('BIN', ''), 10);
        const newBinIdNum = lastBinIdNum + 1;
        bin.binId = `BIN${newBinIdNum.toString().padStart(3, '0')}`; // Pad with leading zeros
      } else {
        // If no bins exist, start with BIN001
        bin.binId = 'BIN001';
      }
    }

    // Generate QR code based on binId
    const qrCodeUrl = await QRCode.toDataURL(bin.binId);
    bin.qrCode = qrCodeUrl;

    next();
  } catch (error) {
    next(error);
  }
});


const Bin = mongoose.model('Bin', binSchema);
module.exports = Bin;
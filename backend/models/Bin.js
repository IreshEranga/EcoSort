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
    enum: ['Organic', 'Paper', 'Plastic', 'Electronic', 'Other'],
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
  status:{
    type: String,
    default:'Not Collected',
  },
  Driver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  }
});

// Middleware to auto-generate binId before saving
binSchema.pre('save', async function (next) {
  const bin = this;

  try {
    console.log('Middleware triggered'); // Add this line for debugging

    // Only generate a binId if it doesn't already exist
    if (!bin.binId) {
      // Get the userId from the user reference
      const user = await mongoose.model('User').findById(bin.user);
      if (!user) {
        return next(new Error('User not found'));
      }

      // Find the latest bin for this user based on the binId field
      const lastBin = await mongoose.model('Bin').findOne({ user: bin.user }).sort({ binId: -1 }).exec();

      // Create the new binId based on the user's auto-incremented userId
      let userIdStr = user.userId.toString(); // Get userId as a string
      let binCount = 1; // Default bin count
      
      if (lastBin) {
        // Extract the numeric part of the last binId
        const lastBinIdNum = parseInt(lastBin.binId.replace(userIdStr, ''), 10);
        binCount = lastBinIdNum + 1; // Increment the bin count
      }

      bin.binId = `${userIdStr}${binCount}`; // Create new binId in the format of userId + bin count
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
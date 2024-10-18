// models/WasteManagement.js
const mongoose = require('mongoose');

const wasteManagementSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String },
    // Other relevant fields...
});

module.exports = mongoose.model('WasteManagement', wasteManagementSchema);

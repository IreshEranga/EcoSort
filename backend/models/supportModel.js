const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    issueType: {
        type: String,
        enum: ['Collection', 'Technical', 'Routine'], // Restrict to specific issue types
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Received', 'Pending', 'Denied', 'Completed'], // Status options
        default: 'Received' // Default status when a ticket is created
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SupportTicket', supportSchema);
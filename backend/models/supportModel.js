const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model 
        required: true // Ensure user is always present
    },
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

const SupportTicket = mongoose.model('SupportTicket', supportSchema);
module.exports = SupportTicket;
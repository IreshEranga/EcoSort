const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['business', 'individual'],
    required: true
  }
}, { timestamps: true });

// Auto-increment user ID
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Manager', 'Cook'], default: 'Cook' }
});

module.exports = mongoose.model('User', userSchema);

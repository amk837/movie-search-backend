const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: {type: String, default: '', trim: true},
  email: {type: String, default: '', trim: true, unique: true},
  password: {type: String, default: ''},
  favorites: {type: Array, default: []},
  refreshToken: {type: String, default: ''},
  token: {type: String, default: ''},
})

module.exports = mongoose.model('User', User);

const mongoose = require('mongoose');

const Genre = new mongoose.Schema({
  name: {type: String, default: '', trim: true},
  id: {type: String, default: '', trim: true, unique: true},
})

module.exports = mongoose.model('Genre', Genre);

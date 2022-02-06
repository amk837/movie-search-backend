const mongoose = require('mongoose');

const Movie = new mongoose.Schema({
  title: {type: String, default: '', trim: true},
  id: {type: String, default: '', trim: true, unique: true},
  release_date: {type: String, default: ''},
  runtime: {type: String, default: ''},
  poster_path: {type: String, default: ''},
  vote_average: {type: String, default: ''},
  popularity: {type: Number, default: ''},
  overview: {type: String, default: ''},
  genres: {type: Array, default: []},
})

module.exports = mongoose.model('Movie', Movie);

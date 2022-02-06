const express = require('express');
const { port } = require('./config');
const auth = require('./routes/auth');
const movies = require('./routes/movies');
const mongoose = require('mongoose');
const { updateMovies } = require( './controllers/movies' );

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, SEARCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', auth);
app.use('/movies', movies);
app.use('**', (req, res, next) => {
  res.send('<h1>404 Page Not Found</h1>')
});

mongoose.connect(`mongodb+srv://amk:5757231@movie-search.btnwv.mongodb.net/movie-search?retryWrites=true&w=majority`);

app.listen(port, () => {
  console.log('server running on localhost:' + port);
  // updateMovies();
});

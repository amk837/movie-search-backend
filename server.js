const express = require('express');
const { port, mongoDbUrl } = require('./config');
const auth = require('./routes/auth');
const movies = require('./routes/movies');
const { updateMovies } = require('./controllers/movies');
const mongoose = require('mongoose');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, SEARCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', auth);
app.use('/movies', movies);
app.use('**', (req, res) => {
  res.send('<h1>404 Page Not Found</h1>')
});

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const initialize = async () => {
  console.log('server running on localhost:' + port);
  if (mongoDbUrl) {
    await mongoose.connect(mongoDbUrl, clientOptions);
    updateMovies();
  }
};
app.listen(port, () => {
  initialize();
});

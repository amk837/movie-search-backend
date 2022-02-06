const express = require('express');
const { authenticateToken } = require( '../controllers/auth' );
const movies = require('../controllers/movies');

const router = express.Router();

router.post('/addToFavorites', authenticateToken, movies.addToFav);

router.delete('/removeFromFavorites', authenticateToken, movies.removeFromFav);

router.get('/getFavorites', authenticateToken, movies.getFav);

router.search('/', movies.getMovies);

// router.post('/', movies.getMovies);

router.get('/genres', movies.getGenres);
module.exports = router;

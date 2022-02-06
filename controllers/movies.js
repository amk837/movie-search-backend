const axios = require('axios').default;
const Movie = require('../models/movie');
const Genre = require('../models/genre');
const User = require('../models/user');

const { BASE_URL_MOVIES, API_KEY } = process.env;

exports.addToFav = async (req, res) => {
  const movie = req.body.movie;
  try {
    const { favorites, email } = req.user;
    if (!favorites.includes(movie)) favorites.push(movie);
    const updated = await User.updateOne({ email }, { favorites });
    console.log(updated);
    return res.status(200).json({ message: 'Movie added to favorites', status: 200 });
  } catch (error) {
    return res.status(400).json({
      message: 'Please try again and ensure email and movie are correct',
    });
  }
};

exports.removeFromFav = async (req, res) => {
  const movieId = req.body.movieId;
  try {
    let { favorites, email } = req.user;
    favorites = favorites.filter((fav) => fav.id != movieId);
    const updated = await User.updateOne({ email }, { favorites });
    console.log(updated);
    return res.status(200).json({ message: 'Movie removed from favorites', status: 200 });
  } catch (error) {
    return res.status(400).json({
      message: 'Please try again and ensure email and movie are correct',
      status: 400
    });
  }
};

exports.getFav = async (req, res) => {
  try {
    const { favorites } = req.user;
    return res.status(200).json({ favorites, status: 200});
  } catch (error) {
    return res.status(400).json({
      message: 'Please try again',
      status: 400,
    });
  }
};

exports.updateMovies = async () => {
  const genresList = await (
    await axios.get(`${BASE_URL_MOVIES}/genre/movie/list?api_key=${API_KEY}`)
  ).data.genres;
  const genres = {};
  genresList.forEach(({ id }, index) => {
    genres[id] = index;
  });
  for (let i = 1; i <= 500; i++) {
    const api = `${BASE_URL_MOVIES}/movie/popular?api_key=${API_KEY}&page=${i}`;
    const data = (await (await axios.get(api)).data).results;
    data.forEach(
      async ({
        title,
        genre_ids,
        poster_path,
        runtime,
        vote_average,
        popularity,
        overview,
        release_date,
        id,
      }) => {
        const movie = {
          title,
          poster_path,
          runtime,
          vote_average,
          popularity: parseInt(popularity),
          id,
          release_date,
          overview,
          genres: genre_ids.map((id) => genresList[genres[id]]),
        };
        await Movie.create(movie);
      }
    );
  }
};

exports.getMovies = async (req, res) => {
  const {
    title,
    sortBy,
    asc,
    release_date,
    rating,
    popularity,
    genres,
    page,
  } = req.body;

  const { from, to } = release_date || {};

  const popularityRanges = Array.from(Array(10)).map((value, index) => [index*1000, (index+1)*1000]);
  popularityRanges.push([0, 5000]);
  popularityRanges.push([5000, 10000]);
  popularityRanges.push([0, 10000]);

  const ratingRanges = Array.from(Array(10)).map((value, index) => [index, (index === 9 ? 9.9: index+1)]);
  ratingRanges.push([0, 5]);
  ratingRanges.push([5, 9.9]);
  ratingRanges.push([0, 9.9]);

  const [minPopularity, maxPopularity] = popularityRanges[parseInt(popularity) || 12];

  const [minRating, maxRating] = ratingRanges[parseInt(rating) <= 12 ? parseInt(rating) : 12];
  const filters = {
    title: new RegExp(`.*${title || ''}.*`, 'i'),
    release_date: {
      $gte: `${from || '1900'}-00-00`,
      $lte: `${to || '2100'}-99-99`,
    },
    vote_average: { $gte: `${minRating}`, $lte: `${maxRating}` },
    popularity: { $gte: minPopularity, $lte: maxPopularity},
    'genres.name': genres && genres.length > 0 ? { $all: genres.map((genre) => new RegExp(`${genre}`, 'i')) } : /.*/,
  };
  console.log(filters);
  const sortFilter = { [sortBy]: asc || -1 };
  console.log(sortFilter);
  let data = await Movie.find(filters).sort(sortFilter);

  const currentPage = page > Math.ceil(data.length/20) ? 1 : page || 1;

  return res.status(200).json({ 
    results: data.slice((currentPage-1)*20, (currentPage*20)), 
    total_pages: Math.ceil(data.length/20), 
    page: currentPage
  });
};

exports.getGenres = async (req, res) => {
  const genres = await Genre.find({});
  return res.status(200).json(genres);
};

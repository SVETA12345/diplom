const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const {
  createMovieValidation,
  deleteMovieValidation,
} = require('../validation');

router.get('/', getMovies);

router.delete('/:_id', deleteMovieValidation, deleteMovie);
router.post('/', createMovieValidation, createMovie);
module.exports = router;

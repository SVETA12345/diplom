const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:cardId', deleteMovie);
router.post('/', createMovie);
module.exports = router;

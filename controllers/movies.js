const Movie = require('../models/movie');
const httpConstants = require('http2').constants;
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized');

const getMovies = (req, res, next) => Movie.find({})
  .then((movie) => res.status(httpConstants.HTTP_STATUS_OK).send(movie))
  .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('фильм или пользователь не найден'));
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('переданы некорректные данные в методы создания фильма или пользователя'));
    } else {
      next(err);
    }
  });

const createMovie = (req, res, next) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  return Movie.create(newCardData)
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('фильм или пользователь не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('переданы некорректные данные в методы создания фильма или пользователя'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  if (req.user._id === req.body.owner) {
    Movie.findByIdAndRemove(req.params.cardId)
      .orFail()
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          next(new NotFoundError('фильм или пользователь не найден'));
        } else if (err.name === 'ValidationError' || err.name === 'CastError') {
          next(new BadRequestError('переданы некорректные данные в методы создания фильма или пользователя'));
        }
      });
  } else { throw new UnauthorizedError('Недостаточно прав'); }
};
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};

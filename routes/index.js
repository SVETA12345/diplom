const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./movies');
const httpConstants = require('http2').constants;

router.use('/users', userRoutes);
router.use('/movies', cardRoutes);
module.exports = router;
router.use('*', (req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'карточка или пользователь не найден' });
});

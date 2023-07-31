const userRoutes = require('./users');
const cardRoutes = require('./movies');
const httpConstants = require('http2').constants;
const { auth } = require('../middlewares/auth');
const {
  createUserValidate,
  loginValidate,
} = require('../validation');
const { login, createUser } = require('../controllers/users');

module.exports = function (app) {
  app.post('/signin', loginValidate, login);
  app.post('/signup', createUserValidate, createUser);
  app.use(auth);
  app.use('/users', userRoutes);
  app.use('/movies', cardRoutes);
  app.use('*', (req, res) => {
    res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'карточка или пользователь не найден' });
  });
  app.post('/signout', (req, res) => {
    res.status(200).clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }).send({ message: 'exit' });
    res.end();
  });
};

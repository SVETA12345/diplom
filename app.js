const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');
const {
  getUserById, updateUserById, login, createUser,
} = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://127.0.0.1/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => { console.log('connected db'); });
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(requestLogger);
app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(errorLogger);
app.use(auth);
app.use(routes);
app.use((err, req, res, next) => {
  console.log(err);
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
app.listen(3003, (req, res) => {
  console.log('server is running');
});

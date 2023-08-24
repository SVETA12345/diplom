const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./limiter');
const { errorHandler } = require('./errors/errorHandler');

const app = express();
require('dotenv').config();

app.use(
  cors({
      origin: [
        'http://api.movies-explorer.nomoreparties.co',
        'https://api.movies-explorer.nomoreparties.co',
        'http://localhost:3003',
        'https://localhost:3003'
      ],
      credentials: true, // Если используются куки.
  }),
);

const { NODE_ENV, JWT_SECRET, BASE_URL } = process.env;
console.log(NODE_ENV, JWT_SECRET, BASE_URL);
mongoose.connect(BASE_URL, {
  useNewUrlParser: true,
}).then(() => { console.log('connected db'); });

app.use(cookieParser());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);

routes(app);
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(3003, () => {
  console.log('server is running');
});

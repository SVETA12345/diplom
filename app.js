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

app.use(function(req, res, next) {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  res.header('Access-Control-Allow-Origin', origin);
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
const requestHeaders = req.headers['access-control-request-headers'];
// Если это предварительный запрос, добавляем нужные заголовки
if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
}

  next();
});
const { NODE_ENV, JWT_SECRET, BASE_URL } = process.env;
console.log(NODE_ENV, JWT_SECRET, BASE_URL);
mongoose.connect(BASE_URL, {
  useNewUrlParser: true,
}).then(() => { console.log('connected db'); });
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
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

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate'); // https://www.npmjs.com/package/celebrate
const cookies = require('cookie-parser');

const router = require('./routes');
const errorHandler = require('./widdlewares/error');
const { requestLogger, errorLogger } = require('./widdlewares/logger');

// const bodyParser = require('body-parser');
const app = express();

// подключаемся к серверу mongo

const { PORT = 3000, DATA_BASE = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.use(cors());
// app.use(cors({
//   origin: [
//     'https://mmm.nomoredomainsrocks.ru',
//     'http://mmm.nomoredomainsrocks.ru',
//     'http://localhost:3000',
//   ],
//   credentials: true,
//   // maxAge: 60, // sec
// }));

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookies());

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // for celebrate

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('listen port 3000');
});

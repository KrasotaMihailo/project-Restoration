// Тут нужно заимпортить наше подключение к базе данных, описать схема, и экспортировать модель
const mongoose = require('mongoose');

// схема для базы данных для коллекции "users"
const SchemaUser = mongoose.Schema({ // Схема для формирования базы данных
  email: String,
  password: String,
  id: Number,
  token: String,
});
const model = mongoose.model('users', SchemaUser); // для связи с MongoDB

module.exports = model;

// Тут нужно заимпортить наше подключение к базе данных, описать схема, и экспортировать модель
const mongoose = require('mongoose');

// схема для базы данных для коллекции "users"
const SchemaBook = mongoose.Schema({ // Схема для формирования базы данных
  title: String,
  description: String,
  image: String,
});
const modelBook = mongoose.model('books', SchemaBook); // для связи с MongoDB

module.exports = modelBook;

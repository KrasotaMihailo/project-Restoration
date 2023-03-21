// Тут создаем подключение к базе данных

const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGO_URL);

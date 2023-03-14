// Тут описываются схемы валидации
const Joi = require('joi');

// Если нам нужно валидировать обработчик findAll, то мы создаем схему валидации для него (с таким же названием)


//Схема валидации при создании книги
const creatBook = Joi.object({ // схема для валидации с помощью бибилиотеки Joi
  authorId: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  image: Joi.string().uri(),
});



// и экспортируем ее
module.exports = {
  creatBook,
};

// Тут описываются схемы валидации
const Joi = require('joi');

// Если нам нужно валидировать обработчик findAll, то мы создаем схему валидации для него (с таким же названием)
function findAll() {
  return Joi.object({
    // ...
  });
}

// и экспортируем ее
module.exports = {
  findAll,
};

// Тут описываются схемы валидации
const Joi = require('joi');

// Если нам нужно валидировать обработчик findAll, то мы создаем схему валидации для него (с таким же названием)
// postUsers

// Схемы валидации для проверки приходящих параметров с применением Joi
const creatUser = Joi.object({ // схема 1 для валидации с помощью бибилиотеки Joi
  password: Joi.string().min(4), // правила для ключей ожидаемого объекта
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

const patchUser = Joi.object({ // схема 4 для валидации с помощью бибилиотеки Joi
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

const deleteUser = Joi.object({ // схема 3 для валидации с помощью бибилиотеки Joi
  id: Joi.string(),
});

// и экспортируем ее
module.exports = {
  creatUser, patchUser, deleteUser,
};

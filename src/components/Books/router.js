// Тут создаем роутер, объявляем роуты, вешаем обработчики и экспортируем роутер.
// Тут же можно вешать middleware для конкретных роутов и описывать swagger документацию для роутов.
const router = require('express').Router();
const controller = require('./index');

const authorization = require('../../middlewares/authorization');

console.log(authorization);

// Получение данных всех пользователей
router.get('/', controller.getBooks);

// POST
// создаем книгу
router.post('/', controller.creatBook);

module.exports = router;

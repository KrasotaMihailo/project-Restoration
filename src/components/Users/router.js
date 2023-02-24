// Тут создаем роутер, объявляем роуты, вешаем обработчики и экспортируем роутер.
// Тут же можно вешать middleware для конкретных роутов и описывать swagger документацию для роутов.
const router = require('express').Router();
const controller = require('./index');

router.get('/', controller.findAll);

module.exports = router;

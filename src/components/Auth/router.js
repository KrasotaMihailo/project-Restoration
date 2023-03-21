// Тут создаем роутер, объявляем роуты, вешаем обработчики и экспортируем роутер.
// Тут же можно вешать middleware для конкретных роутов и описывать swagger документацию для роутов.
const router = require('express').Router();
const controller = require('./index');

const authorization = require('../../middlewares/authorization');

// POST
// авторизация пользователя существующего в базе
router.post('/sign-in', controller.authUser);
router.post('/refresh', controller.refreshTokenUser);

// DELETE
router.delete('/logout', authorization, controller.logoutUser);

module.exports = router;

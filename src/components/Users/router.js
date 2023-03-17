// Тут создаем роутер, объявляем роуты, вешаем обработчики и экспортируем роутер.
// Тут же можно вешать middleware для конкретных роутов и описывать swagger документацию для роутов.
const router = require('express').Router();
const controller = require('./index');

const authorization = require('../../middlewares/authorization');

console.log(authorization);

// Получение данных всех пользователей
router.get('/', controller.getUsers);

// получение данных авторизованого пользователя
router.get('/me', authorization, controller.getAuthUser);

// POST
// создаем пользователя
router.post('/', controller.creatUser);

// PATCH
// Изменение данных пользователя
router.patch('/', authorization, controller.patchUser);

// DELETE
// Удаление пользователя
router.delete('/', controller.deleteUser);

module.exports = router;

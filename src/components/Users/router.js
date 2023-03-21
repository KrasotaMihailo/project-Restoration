// Тут создаем роутер, объявляем роуты, вешаем обработчики и экспортируем роутер.
// Тут же можно вешать middleware для конкретных роутов и описывать swagger документацию для роутов.
const router = require('express').Router();
const controller = require('./index');

const authorization = require('../../middlewares/authorization');

// Получение данных всех пользователей
// документация запросов и ответов
/**
    * @swagger
    * /users:
    *   get:
    *     summary: получение списка пользователей
    *     description: работа с учебным сервером,получение списка пользователей        *
    *     responses:
    *       200:
    *         description: A list of users.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                        email:
    *                           type: string
    *                           description: почта пользователя.
    *                           example: 55@ukr.net
    *                        password:
    *                            type: string
    *                            description: пароль пользователя.
    *                            example: 3333
    *                        id:
    *                         type: string
    *                         description:  ID пользователя, который запрашивается.
    *                         example: 123
    */
router.get('/', controller.getUsers);

// получение данных авторизованого пользователя
router.get('/me', authorization, controller.getAuthUser);

// POST

/**
    * @swagger
    * /users:
    *   post:
    *     summary: добавление пользователя
    *     description: работа с учебным сервером,создание пользователя в базе
    *     parameters:
    *       - in: body
    *         name: email
    *         description: почта пользователя
    *         type: string
    *       - in: body
    *         name: password
    *         description: пароль
    *         type: string
    *     responses:
    *       200:
    *         description: A list of users.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                        email:
    *                           type: string
    *                           description: почта пользователя.
    *                           example: 55@ukr.net
    *                        password:
    *                            type: string
    *                            description: пароль пользователя.
    *                            example: 3333
    *                        id:
    *                         type: string
    *                         description:  ID пользователя, который запрашивается.
    *                         example: 123
    */
// создаем пользователя
router.post('/', controller.creatUser);

// PATCH
/**
    * @swagger
    * /users:
    *   patch:
    *     summary: изменение данных пользователя
    *     description: работа с учебным сервером, изменение данных пользователя
    *     parameters:
    *       - in: body
    *         name: email
    *         description: почта пользователя
    *         type: string
    *       - in: body
    *         name: id
    *         description: индивидуальный номер пользователя
    *         type: number
    *     responses:
    *       200:
    *         description: new user.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                        email:
    *                           type: string
    *                           description: новая почта пользователя.
    *                           example: 55@ukr.net
    *                        password:
    *                           type: string
    *                           description: пароль пользователя.
    *                           example: 3333
    *                        id:
    *                           type: string
    *                           description:  ID пользователя.
    *                           example: 123ghgj3455
    */

router.patch('/', authorization, controller.patchUser);

// DELETE
// Удаление пользователя

/**
    * @swagger
    * /users:
    *   delete:
    *     summary: удаление пользователя
    *     description: работа с учебным сервером, удаление пользователя из базы
    *     parameters:
    *       - in: body
    *         name: id
    *         description: индивидуальный номер пользователя
    *         type: number
    *     responses:
    *       200:
    *         description: new user.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                        message:
    *                           type: string
    *                           description: "Пользователь удален"
    */

router.delete('/', controller.deleteUser);

module.exports = router;

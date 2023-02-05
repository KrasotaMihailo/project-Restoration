const express = require('express'); // подключаем модуль express
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // подключение body parser для передачи
const Joi = require('joi'); // подключение библиотеки Joi для валидации
const dotenv = require('dotenv').config(); // прячет данные
const swaggerJSDoc = require('swagger-jsdoc');// SWAGGER
const swaggerUi = require('swagger-ui-express');

const SchemaUser = mongoose.Schema({ // Схема для формирования базы данных
  email: String,
  password: String,
  id: Number,
  token: String,
});
const model = mongoose.model('users', SchemaUser); // для связи с MongoDB

// Token (функция для создания токена)
function token(sumString) { // создание токена
  const symbolArr = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  let randomString = '';
  for (let i = 0; i < sumString; i++) {
    const index = Math.floor(Math.random() * symbolArr.length);
    randomString += symbolArr[index];
  }
  return randomString;
}

// Middleware
async function authorization(req, res, next) {
  console.log(req.headers);
  const userToken = await model.findOne({ token: req.headers.authorization });
  console.log(userToken);
  if (userToken !== null && req.headers.authorization) { // (не равно)
    req.user = userToken;
    next();
  } else {
    res.end('Не авторизировано');
  }
}

// Process.on - определение ошибок при выполении кода
process.on('uncaughtException', (error) => {
  console.log('uncaughtException', error);
});

// Body parser для передачи парметров через body
const urlencodedParser = bodyParser.urlencoded({ // для передачи параметров через body
  extended: false,
});

// Схемы валидации для проверки приходящих параметров с применением Joi
const schemaValid1 = Joi.object({ // схема 1 для валидации с помощью бибилиотеки Joi
  password: Joi.string().min(4),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

const schemaValid2 = Joi.object({ // схема 2 для валидации с помощью бибилиотеки Joi
  id: Joi.number().min(3),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

const schemaValid3 = Joi.object({ // схема 3 для валидации с помощью бибилиотеки Joi
  id: Joi.number().min(3),
});

const schemaValid4 = Joi.object({ // схема 4 для валидации с помощью бибилиотеки Joi
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

// SWAGGER

const swaggerDefinition = { // общее описание сервера Swagger
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
  },
};

const options = { // Это для Swagger
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./*.js'], // тут прописывается общий путь к файлам
};

const swaggerSpec = swaggerJSDoc(options);

// РОУТЫ
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    const app = express(); // вызываем express

    app.use(urlencodedParser);// подключение bodyParser сразу на все роуты

    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));// Создаем страницу Swagger

    app.set('view engine', 'ejs'); // подключение модуля ejs в качестве движка для рендера

    // GET
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
        *                         type: integer
        *                         description:  ID пользователя, который запрашивается.
        *                         example: 123
        */

    app.get('/users', async (req, res) => {
      try {
        const users = await model.find({});
        res.send(users);// ответ
      } catch (error) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });

//authorization
    app.get('/users/me', authorization, async (req, res) => {
      try {
        res.send(req.user);// берем токен из  req.user при прохождении мидлвейр
      } catch (error) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });
    //SSR
    app.get('/profile/:id', async (req, res) => {//Роут для ejs 
      try {
        const user = await model.findOne({ id: req.params.id });
        res.render('index', { email: `${user.email}`, id: `${user.id}` });
      } catch (error) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });

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
        *                         type: integer
        *                         description:  ID пользователя, который запрашивается.
        *                         example: 123
        */

    app.post('/users', async (req, res) => {
      const { error } = schemaValid1.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,
      if (error) {
        return res.status(400).json({ message: error.details }); // если валидация не проходит то код дальше не выполняется
      }

      try {
        const user = model({
          email: req.body.email,
          password: req.body.password,
          id: Math.round(Math.random() * 1000),
        });

        await user.save();
        res.send(user);// ответ
      } catch (error1) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });

    app.post('/auth/sign-in', async (req, res) => {
      const { error } = schemaValid1.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,

      if (error) {
        return res.status(400).json({ message: error.details }); // если валидация не проходит то код дальше не выполняется
      }
      try {
        const tokenValues = token(8);// получаем значение 8-розрядного токена
        const user = model({
          email: req.body.email,
          password: req.body.password,
          id: Math.round(Math.random() * 1000),
          token: tokenValues,
        });

        await user.save();
        res.send(user);// ответ
      } catch (error1) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });

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
        *                           type: integer
        *                           description:  ID пользователя.
        *                           example: 123
        */

    app.patch('/users', authorization, async (req, res) => {
      const { error } = schemaValid4.validate(req.body);// Это блок валидации t
      if (error) {
        return res.status(400).json({ message: error.details });
      }
      try {
        const userPatch = await model.findOne({ id: req.user.id });
        userPatch.email = req.body.email;
        await userPatch.save();
        res.send(userPatch);// ответ
      } catch (error1) {
        console.log(error1);
        res.send('Что-то пошло не так');
      }
    });

    // DELETE

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

    app.delete('/users', async (req, res) => {
      const { error } = schemaValid3.validate(req.body);// Это блок валидации
      if (error) {
        return res.status(400).json({ message: error.details });
      }
      try {
        await model.deleteOne({ id: req.body.id });
        res.send('пользователь удален');// ответ
      } catch (error) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });

    app.delete('/auth/logout', authorization, async (req, res) => {
      try {
        req.user.token = 0;
        await req.user.save();
        res.send('пользователь разлогинен');// ответ
      } catch (error1) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });

    app.listen(process.env.PORT, () => {
      console.log('Server has started!');
    });
  });

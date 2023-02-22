const express = require('express'); // подключаем модуль express
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // подключение body parser для передачи
const Joi = require('joi'); // подключение библиотеки Joi для валидации
const dotenv = require('dotenv').config(); // прячет данные
const swaggerJSDoc = require('swagger-jsdoc');// SWAGGER
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');

// схема для базы данных для коллекции "users"
const SchemaUser = mongoose.Schema({ // Схема для формирования базы данных
  email: String,
  password: String,
  id: Number,
  token: String,
});
const model = mongoose.model('users', SchemaUser); // для связи с MongoDB

// схема для базы данных для коллекции "books"
const SchemaBook = mongoose.Schema({ // Схема для формирования базы данных
  title: String,
  description: String,
  image: String,
});
const modelBook = mongoose.model('books', SchemaBook); // для связи с MongoDB

// Token (функция для создания токена)
function token(sumString) { // создание токена
  const symbolArr = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  let randomString = '';
  for (let i = 0; i < sumString; i += 1) {
    const index = Math.floor(Math.random() * symbolArr.length);
    randomString += symbolArr[index];
  }
  return randomString;
}

// Функция для создания рефреш Токена
function accessTok(pas, em, idUser) {
  const accesTk = jwt.sign(
    { // написание refreshToken
      password: pas,
      email: em,
      _id: idUser,
    },
    'secret', // секрет, хранится в .env
    {
      expiresIn: '1d', // истекает через 7 дней
    },
  );
  return accesTk;
}

// Middleware
async function authorization(req, res, next) {
  try {
    // eslint-disable-next-line max-len
    const decoded = jwt.verify(req.headers.authorization, 'secret');// приним. AccessToken расшифр. пользов. и провер. время токена и запис. в req.user
    console.log(decoded);
    if (decoded !== null && req.headers.authorization) { // (не равно)
      req.user = decoded;// user - поле обекта req
      console.log(decoded);
      next();
    } else {
      res.end('Не авторизировано');
    }
  } catch {
    res.end('не авторизовано');
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
  password: Joi.string().min(4), // правила для ключей ожидаемого объекта
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

const schemaValid3 = Joi.object({ // схема 3 для валидации с помощью бибилиотеки Joi
  id: Joi.string(),
});

const schemaValid4 = Joi.object({ // схема 4 для валидации с помощью бибилиотеки Joi
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

const schemaValid5 = Joi.object({ // схема 5 для валидации с помощью бибилиотеки Joi
  authorId: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
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
        *                         type: string
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

    // Получение всего списка книг
    app.get('/books', async (req, res) => {
      try {
        const books = await modelBook.find({});
        res.send(books);// ответ
      } catch (error) {
        console.log(error);
        res.send('Что-то пошло не так');
      }
    });

    // задание по authorization
    app.get('/users/me', authorization, async (req, res) => {
      try {
        res.send(req.user);// берем токен из  req.user при прохождении мидлвейр
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
        *                         type: string
        *                         description:  ID пользователя, который запрашивается.
        *                         example: 123
        */
    // создаем пользователя
    app.post('/users', async (req, res) => {
      const { error } = schemaValid1.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,
      if (error) {
        return res.status(400).json({ message: error.details }); // если валидация не проходит то код дальше не выполняется
      }

      try {
        const user = model({
          email: req.body.email,
          password: req.body.password,
        });

        await user.save();
        res.send(user);// ответ
      } catch (error1) {
        console.log('catch');
        res.send('Что-то пошло не так');
      }
    });

    // работа с JWT
    // авторизация пользователя, существующего в базе
    app.post('/auth/sign-in', async (req, res) => {
      const { error } = schemaValid1.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,

      if (error) {
        return res.status(400).json({ message: error.details }); // если валидация не проходит то код дальше не выполняется
      }
      try {
        const user = await model.findOne({ email: req.body.email, password: req.body.password });
        if (!user) {
          return res.send('пользователя не существует');// return остановит дальнейшее выполнение
        }

        const accessToken = accessTok(req.body.password, req.body.email, user._id);
        const refreshToken = jwt.sign(
          { // написание refreshToken
            password: req.body.password,
            email: req.body.email,
          },
          'secret', // секрет, хранится в .env
          {
            expiresIn: '2h', // истекает через 2 час
          },

        );
        user.token = refreshToken;
        await user.save();
        const tokens = { accessToken, refreshToken };
        res.send(tokens);// ответ
      } catch (error1) {
        console.log(error1);
        res.send('Что-то пошло не так');
      }
    });

    // обновление токена refreshToken
    app.post('/auth/refresh', async (req, res) => {
      try {
        const { refreshToken } = req.body;
        const decoded = jwt.verify(refreshToken, 'secret');
        console.log(decoded);
        console.log(refreshToken);
        const user = await model.findOne({ token: refreshToken });
        if (user) { // если юзер существует
          const accesToken = accessTok(user.password, user.email, user._id);
          console.log(accesToken);

          return res.send(accesToken);// ответ
        }
        res.send('Неправильный токен');
      } catch (error1) {
        console.log(error1);
        res.send('Что-то пошло не так');
      }
    });
    // POST - создание книги

    app.post('/books', async (req, res) => {
      const { error } = schemaValid5.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,
      if (error) {
        return res.status(400).json({ message: error.details }); // если валидация не проходит то код дальше не выполняется
      }

      try {
        const authorBook = await model.findOne({ _id: req.body.authorId });
        if (!authorBook) { // если юзер существует
          return res.send('Такого автора нет');// ответ
        }
        console.log(req.body);
        const book = modelBook({
          title: req.body.title,
          description: req.body.description,
          image: req.body.image,
          authorId: req.body.authorId,
        });

        await book.save();
        res.send(book);// ответ
      } catch (error2) {
        console.log(error2);
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
        *                           type: string
        *                           description:  ID пользователя.
        *                           example: 123ghgj3455
        */

    app.patch('/users', authorization, async (req, res) => {
      const { error } = schemaValid4.validate(req.body);// Это блок валидации t
      if (error) {
        return res.status(400).json({ message: error.details });
      }
      try {
        const userPatch = await model.findOne({ _id: req.user._id });
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
        await model.deleteOne({ _id: req.body.id });
        res.send('пользователь удален');// ответ
      } catch (error2) {
        console.log(error2);
        res.send('Что-то пошло не так');
      }
    });

    app.delete('/auth/logout', authorization, async (req, res) => {
      try {
        await model.updateOne({ _id: req.user._id }, { $set: { token: 0 } });// первый объект - то по чем ищем, второй обект - то что меняем
        console.log(req.user);
        res.send('пользователь разлогинен');// ответ
      } catch (error1) {
        console.log(error1);
        res.send('Что-то пошло не так');
      }
    });

    app.listen(process.env.PORT, () => {
      console.log('Server has started!');
    });
  });

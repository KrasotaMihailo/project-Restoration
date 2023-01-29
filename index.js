const express = require("express") //подключаем модуль express
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Joi = require('joi');
const dotenv = require('dotenv').config()
const swaggerJSDoc = require("swagger-jsdoc")// SWAGGER
const swaggerUi = require("swagger-ui-express"); // SWAGGER

const urlencodedParser = bodyParser.urlencoded({ // для передачи параметров через body
    extended: false,
})

const schemaValid1 = Joi.object({ // схема 1 для валидации с помощью бибилиотеки Joi
    password: Joi.string().min(4),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

const schemaValid2 = Joi.object({ // схема 2 для валидации с помощью бибилиотеки Joi
    id: Joi.number().min(3),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

const schemaValid3 = Joi.object({ // схема 3 для валидации с помощью бибилиотеки Joi
    id: Joi.number().min(3)
})

// SWAGGER

const swaggerDefinition = {//общее описание сервера
    openapi: '3.0.0',
    info: {
        title: 'Express API for JSONPlaceholder',
        version: '1.0.0',
    },
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./*.js'], // тут прописывается общий путь к файлам 
};

const swaggerSpec = swaggerJSDoc(options);


mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => {
        const app = express() //вызываем express

        const SchemaUser = mongoose.Schema({// Схема для формирования базы данных 
            email: String,
            password: String,
            id: Number,
        });
        const model = mongoose.model('restoration', SchemaUser); //для связи с MongoDB
        app.use(urlencodedParser)// подключение bodyParser сразу на все роуты
        
        
        app.use('/users', swaggerUi.serve, swaggerUi.setup(swaggerSpec));//Создаем страницу Swagger
      
        
                // GET
                //документация запросов и ответов
        /**
        * @swagger
        * /users:
        *   get:
        *     summary: получение списка пользователей
        *     description: работа с учебным сервером,получение списка пользователей
        *     parameters:
        *              - in: path
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
       
       app.get("/users", async (req, res) => {
           const users = await model.find({});
           res.send(users)// ответ 
        })


        // POST
        /**
        * @swagger
        * /users:
        *   post:
        *     summary: получение списка пользователей
        *     description: работа с учебным сервером,создание пользователя в базе        
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

        app.post("/users", async (req, res) => {
            const { error } = schemaValid1.validate(req.body)// Это блок валидации, валидация идет раньше чем действия по роуту, 
            if (error) {
                return res.status(400).json({ message: error.details }); //если валидация не проходит то код дальше не выполняется
            }
            const user = model({
                email: req.body.email,
                password: req.body.password,
                id: Math.round(Math.random() * 1000),
            });

            await user.save()
            res.send(user)//ответ
        })
        
        // PATCH
        /**
        * @swagger
        * /users:
        *   patch:
        *     summary: изменение данных пользователя
        *     description: работа с учебным сервером, изменение данных пользователя
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

        app.patch("/users", async (req, res) => {
            const { error } = schemaValid2.validate(req.body)// Это блок валидации
            if (error) {
                return res.status(400).json({ message: error.details });
            }
            const userPatch = await model.findOne({ id: req.body.id })
            userPatch.email = req.body.email
            await userPatch.save()
            res.send(userPatch)// ответ
        })
        
        
        //DELETE

        /**
        * @swagger
        * /users:
        *   delete:
        *     summary: удаление пользователя
        *     description: работа с учебным сервером, удаление пользователя из базы
        *     parameters:
        *         name: id
        *         description: номер пользователя, который удаляется.
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

        app.delete("/users", async (req, res) => {
            const { error } = schemaValid3.validate(req.body)// Это блок валидации
            if (error) {
                return res.status(400).json({ message: error.details });
            }
            await model.deleteOne({ id: req.body.id })
            res.send("пользователь удален")// ответ
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server has started!`);
        });
    });












   
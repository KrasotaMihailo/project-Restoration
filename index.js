const express = require("express") //подключаем модуль express
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Joi = require('joi');

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





mongoose
    .connect('mongodb+srv://MihailKrasota:xegfrf,hf567@33333.xo3esxv.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        const app = express() //вызываем express

        const SchemaUser = mongoose.Schema({// Схема для формирования базы данных 
            email: String,
            password: String,
            id: Number,
        });
        const model = mongoose.model('restoration', SchemaUser); //для связи с MongoDB

        // GET
        app.get("/users", async (req, res) => {
            const users = await model.find({});
            res.send(users)// ответ 
        })

        // POST
        app.post("/users", urlencodedParser, async (req, res) => {
            const user = model({
                email: req.body.email,
                password: req.body.password,
                id: Math.round(Math.random() * 1000),
            });
            const { error } = schemaValid1.validate(req.body)// Это блок валидации
            if (error) {
                return res.status(400).json({ message: error.details });
            }
            await user.save()
            res.send(user)//ответ
        })

        // PATCH
        app.patch("/users", urlencodedParser, async (req, res) => {
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
        app.delete("/users", urlencodedParser, async (req, res) => {
            const { error } = schemaValid3.validate(req.body)// Это блок валидации
            if (error) {
                return res.status(400).json({ message: error.details });
            }
            await model.deleteOne({ id: req.body.id })
            res.send("пользователь удален")// ответ
        })

        app.listen(3000, () => {
            console.log('Server has started!');
        });
    });











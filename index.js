const express = require("express") //подключаем модуль express
const app = express() //вызываем express
const usersData = require(`./usersData.js`)

app.get("/users", (req, res) => {

    res.send(usersData)// ответ 
})

app.post("/users", (req, res) => {
    let newUser = {}
    newUser.email = req.query.email
    newUser.password = req.query.password
    newUser.id = Math.round(Math.random() * 1000)
    usersData.push(newUser)
    res.send(newUser)//ответ
})

app.patch("/users", (req, res) => {
    let userPatch = usersData.find(user => { return user.id == req.query.id })
    userPatch.email = req.query.email
    let userPatchIndex = usersData.findIndex(user => { return user.id == req.query.id })
    usersData.splice(userPatchIndex, 1, userPatch)
    res.send(userPatch)// ответ
})

app.delete("/users", (req, res) => {
    let userDeleteIndex = usersData.findIndex(function (user) { return user.id == req.query.id })
    usersData.splice(userDeleteIndex, 1)
    res.send("пользователь удален")// ответ
})

app.listen(3000)










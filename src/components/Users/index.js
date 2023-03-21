// Тут мы описываем обработчики для роутов
const validation = require('./validation');
const model = require('./model');

// Получение всех пользователей
async function getUsers(req, res) {
  try {
    const users = await model.find({});
    res.send(users);// ответ
  } catch (error) {
    console.log('catch');
    res.send('Что-то пошло не так');
  }
}
// Получение данных авторизованого пользователя
async function getAuthUser(req, res) {
  try {
    res.send(req.user);// берем токен из  req.user при прохождении мидлвейр
  } catch (error) {
    console.log('catch');
    res.send('Что-то пошло не так');
  }
}

// Создание пользователя
async function creatUser(req, res) {
  const { error } = validation.creatUser.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,
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
}

// Изменение данных пользователя
async function patchUser(req, res) {
  const { error } = validation.patchUser.validate(req.body);// Это блок валидации
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
}

// Удаление пользователя
async function deleteUser(req, res) {
  const { error } = validation.deleteUser.validate(req.body);// Это блок валидации
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
}

// и тут же экспортируем их
module.exports = {
  getUsers, getAuthUser, creatUser, patchUser, deleteUser,
};

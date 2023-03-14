// Тут мы описываем обработчики для роутов
const jwt = require('jsonwebtoken');
const validation = require('./validation');
const model = require('../Users/model');
const accessTok = require('../../middlewares/accessTok');

// работа с JWT
// авторизация пользователя, существующего в базе

async function authUser(req, res) {
  const { error } = validation.authUser.validate(req.body);// Это блок валидации, валидация идет раньше чем действия по роуту,
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
}

// обновление токена refreshToken
async function refreshTokenUser(req, res) {
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
}

// Разлогинивание пользователя
async function logoutUser(req, res) {
  try {
    await model.updateOne({ _id: req.user._id }, { $set: { token: 0 } });// первый объект - то по чем ищем, второй обект - то что меняем
    console.log(req.user);
    res.send('пользователь разлогинен');// ответ
  } catch (error1) {
    console.log(error1);
    res.send('Что-то пошло не так');
  }
}

// и тут же экспортируем их
module.exports = {
  authUser, refreshTokenUser, logoutUser,
};

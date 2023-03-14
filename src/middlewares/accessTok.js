const jwt = require('jsonwebtoken');

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
module.exports = accessTok;

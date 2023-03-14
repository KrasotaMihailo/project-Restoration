const jwt = require('jsonwebtoken');

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
      res.end('не авторизировано');
    }
  } catch {
    res.end('не авторизовано');
  }
}
module.exports = authorization;

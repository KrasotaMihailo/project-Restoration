const UserRouter = require('../components/Users/router');

module.exports = {
  init: (app) => {
    // Тут подключаем все роутеры, указываем путь, на котором будет роут. Давай все пути указывать с префиксом /v1 (version 1)
    // чтобы обозначить версию роутера
    app.use('/v1/users', UserRouter);
  },
};

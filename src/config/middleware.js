const bodyParser = require('body-parser');
// подключение body parser для передачи
const urlencodedParser = bodyParser.urlencoded({ // для передачи параметров через body
  extended: false,
});

module.exports = {
  init: (app) => {
    // Тут подключаем все middleware, которые нужны для всех роутов
    // app.use(...)

    app.use(urlencodedParser);// подключение bodyParser сразу на все роуты
  },
};

// Тут мы описываем обработчики для роутов
const validation = require('./validation');

async function findAll(req, res) {
  const { error } = validation.findAll(req.body).validate(req.query);

  // ...

  res.send('Hello, World!');
}

// и тут же экспортируем их
module.exports = {
  findAll,
};

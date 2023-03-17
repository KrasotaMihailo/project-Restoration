// Тут мы запускаем сервер
require('dotenv').config();
const server = require('./server');
const connection = require('../config/connection');

const port = server.get('port');
connection.then(() => {
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});

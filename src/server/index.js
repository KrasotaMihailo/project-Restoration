// Тут мы запускаем сервер
const server = require('./server');
const port = server.get('port');

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

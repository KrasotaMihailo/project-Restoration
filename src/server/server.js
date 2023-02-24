// Тут мы создаем экземпляр приложения express и подключаем к нему все middleware, 
// которые нужно подключить сразу для всех роутов (например bodyParser) и все routes
const express = require('express');

const middleware = require('../config/middleware');
const routes = require('../config/router');

const app = express();

/**
 * @description express.Application Middleware
 */
middleware.init(app);

/**
 * @description express.Application Routes
 */
routes.init(app);

/**
 * @description sets port 3000 to default or unless otherwise specified in the environment
 */
app.set('port', process.env.PORT || 3000);

module.exports = app;

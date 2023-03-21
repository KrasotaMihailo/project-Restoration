const bodyParser = require('body-parser');
// подключение body parser для передачи
const urlencodedParser = bodyParser.urlencoded({ // для передачи параметров через body
  extended: false,
});

const swaggerJSDoc = require('swagger-jsdoc');// SWAGGER
const swaggerUi = require('swagger-ui-express');

// SWAGGER

const swaggerDefinition = { // общее описание сервера Swagger
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
  },
};

const options = { // Это для Swagger
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./../**/*.js'], // тут прописывается общий путь к файлам
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  init: (app) => {
    // Тут подключаем все middleware, которые нужны для всех роутов
    // app.use(...)

    app.use(urlencodedParser);// подключение bodyParser сразу на все роуты
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));// Создаем страницу Swagger
  },
};

const express = require('express');

const docRouter = express.Router();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOption = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Language Translator API',
      version: '1.0.0',
      description: 'This project contains APIs for Language Translator',
      contact: {
        name: 'Mohammed Azhar',
        email: 'muhammedazhu39@gmail.com',
      },
    },
  },
  apis: [
    './routes/*.js',
  ],
};
const swaggerDocs = swaggerJsDoc(swaggerOption);

docRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = docRouter;

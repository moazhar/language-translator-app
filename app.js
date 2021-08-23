/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const { logger } = require('./logging/winston-logger');

const translateRoute = require('./routes/translate-routes');
const swaggerDocs = require('./swaggerDocs');

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// Doc router
app.use('/api-docs', swaggerDocs);

// Register routes
app.use('/translate', translateRoute);

module.exports = app.listen(port, () => {
  console.log(`Server started at port ${port}............`);
  logger.info(`Server started at port ${port}............`);
});

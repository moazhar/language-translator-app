require('dotenv').config();
const { Translate } = require('@google-cloud/translate').v2;
const { logger } = require('../logging/winston-logger');

// Get Google Cloud Service Credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

const detectLanguage = async (text) => {
  try {
    const response = await translate.detect(text);
    return response[0].language;
  } catch (exception) {
    logger.error(`ERROR at detecting language ---> ${exception.message}`);
    throw new Error(exception.message);
  }
};

const translateLanguage = async (text, targetLanguage) => {
  try {
    const [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (exception) {
    logger.error(`ERROR at translating language ---> ${exception.message}`);

    const error = new Error();
    error.message = (exception.message && exception.message === 'Invalid Value'
      ? `Invalid language code: ${targetLanguage}` : exception.message);
    error.status = (exception.message && exception.message === 'Invalid Value'
      ? 400 : 500);
    throw error;
  }
};

module.exports = {
  detectLanguage,
  translateLanguage,
};

/* eslint-disable consistent-return */
const { getData } = require('../database/redis');
const { logger } = require('../logging/winston-logger');

async function cache(req, res, next) {
  const { text } = req.body;
  const languageCode = req.query.lan;

  try {
    const result = await getData(text);

    if (result.length !== 0) {
      let response = '';

      result.forEach((val) => {
        const code = val.split(':')[0];
        const translation = val.split(':')[1];
        if (code === languageCode) {
          response = translation;
        }
      });
      if (response) return res.status(200).send({ translation: response });
    }
    next();
  } catch (error) {
    logger.error('Failed to cache data: ', error.message);
    return res.status(500).send({
      errorCode: 500,
      errorMessage: `Internal Server Error: ${error.message}`,
    });
  }
}

module.exports = {
  cache,
};

/* eslint-disable consistent-return */
const express = require('express');

const translateRouter = express.Router();

const { detectLanguage, translateLanguage } = require('../utility/google_translate');
const { languages } = require('../utility/languages');
const { postData } = require('../database/redis');
const { cache } = require('../middlewares/cache');
const { languageMapper } = require('../utility/util');
const { logger } = require('../logging/winston-logger');

/**
 * @swagger
 * tags:
 *  - name: "Translate APIs"
 *    description: "APIs related to language translation"
 */

/**
 * @swagger
 * paths:
 *   /translate:
 *     get:
 *       summary: API to get language details
 *       tags:
 *       - "Translate APIs"
 *       security:
 *       - basic: []
 *       parameters:
 *       requestBody:
 *         required: true
 *         description: A JSON object containing text of any language
 *         content:
 *           application/json:
 *             schema:
 *               example: {"text": "हाय सब मेरा नाम पॉल है। मैं भारत से हूँ।"}
 *       responses:
 *         '200':
 *           description: Ok
 *           content:
 *             application/json:
 *               schema:
 *                 example: {"language": "Hindi","languageCode": "hi"}
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 example: {"errorCode": 400,"errorMessage": "Specified language is not supported"}
 *         '500':
 *           description: Exception
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: integer
 *                   exception:
 *                     type: string
 *                 example: {"errorCode":500,"errorMessage":"Internal server error"}
 *
 */
translateRouter.get('/', async (req, res) => {
  try {
    logger.info(`Request recieved for data [${req.body.text}]`);
    const languageCode = await detectLanguage(req.body.text);
    const language = languages[languageCode];

    res.setHeader('Content-Type', 'application/json');
    if (!language) {
      logger.error('Requested language is not supported by the system');
      return res.status(400).send({
        errorCode: 400,
        errorMessage: 'Specified language is not supported',
      });
    }
    return res.status(200).send({
      language,
      languageCode,
    });
  } catch (err) {
    logger.error(`Failed to detect the language due to: ${err.message}`);
    return res.status(500).send({
      errorCode: 500,
      errorMessage: `Internal Server Error: ${err.message}`,
    });
  }
});

/**
 * @swagger
 * paths:
 *   /translate:
 *     post:
 *       summary: API to translate specified text into targetted language
 *       tags:
 *       - "Translate APIs"
 *       security:
 *       - basic: []
 *       parameters:
 *         - in: query
 *           name: lan
 *           schema:
 *             type: string
 *           required: true
 *           description: Specifies language code to which the text needs to be converted
 *       requestBody:
 *         required: true
 *         description: A JSON object containing text of any language
 *         content:
 *           application/json:
 *             schema:
 *               example: {"text": "Hi Everyone my name is Pual. I'm from India."}
 *       responses:
 *         '200':
 *           description: Ok
 *           content:
 *             application/json:
 *               schema:
 *                 example: {"translation": "ಎಲ್ಲರಿಗೂ ನಮಸ್ಕಾರ ನನ್ನ ಹೆಸರು ಪ್ಯುಯಲ್. ನಾನು ಭಾರತದವನು."}
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 example: {"errorCode": 400,"errorMessage": "Invalid language code: cc"}
 *         '500':
 *           description: Exception
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: integer
 *                   exception:
 *                     type: string
 *                 example: {"errorCode":500,"errorMessage":"Internal server error"}
 *
 */
translateRouter.post('/', cache, async (req, res) => {
  try {
    const { text } = req.body;
    const targetLang = req.query.lan;
    const translateAsynCalls = [];
    const postAsyncCalls = [];
    logger.info(`Request recieved for data [${text} : ${targetLang}]`);

    res.setHeader('Content-Type', 'application/json');

    const result = await translateLanguage(text, targetLang);

    // cache the result in redis to be used in future
    Object.keys(languages).forEach((language) => {
      translateAsynCalls.push(translateLanguage(text, language));
    });

    // eslint-disable-next-line
    Promise.allSettled(translateAsynCalls).then((translatedResults) => {
      return languageMapper(translatedResults);
    }).then((mapper) => {
      mapper.forEach((map) => {
        postAsyncCalls.push(postData(text, `${map.code}:${map.value}`));
      });
      return Promise.allSettled(postAsyncCalls);
    }).then(() => {
      logger.info('Cached!');
    })
      .catch((err) => {
        logger.error(`Something went wrong: ${err}`);
      });

    return res.status(200).send({ translation: result });
  } catch (err) {
    logger.error(`Failed to translate due to: ${err.message}`);
    return res.status(err.status).send({
      errorCode: err.status,
      errorMessage: err.message,
    });
  }
});

module.exports = translateRouter;

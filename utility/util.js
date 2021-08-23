const { detectLanguage } = require('./google_translate');

async function languageMapper(translatedResults) {
  // eslint-disable-next-line
  const promises = translatedResults.map(async (result) => {
    if (result.status === 'fulfilled') {
      const lanCode = await detectLanguage(result.value);
      return { code: lanCode, value: result.value };
    }
  });

  const mapperResult = await Promise.all(promises);

  return mapperResult;
}

module.exports = {
  languageMapper,
};

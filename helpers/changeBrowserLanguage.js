const { languages } = require("../constants");

async function changeBrowserLanguage(page) {
  const language = languages[Math.floor(Math.random() * languages.length)];
  await page.setExtraHTTPHeaders({
    "Accept-Language": language,
  });
}

module.exports = { changeBrowserLanguage };

const { scrollPauseTime } = require("./constants");

const parsePageToGetUserData = async (page) => {
  try {
    let i = 0;

    while (true) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await page.waitForTimeout(scrollPauseTime);

      i += 1;
      if (i > 20) {
        break;
      }
    }

    const html = await page.content();

    const urls = html?.match(
      /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    );

    if (!urls) {
      return [];
    }

    const output = urls
      .filter(
        (u) => u.includes("linkedin.com/in/") && u.includes("miniProfileUrn")
      )
      .filter((u, i, arr) => arr.indexOf(u) === i);

    return output;
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = { parsePageToGetUserData };

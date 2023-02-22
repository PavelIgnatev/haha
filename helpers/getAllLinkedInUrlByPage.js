const getAllLinkedInUrlByPage = async (page) => {
  try {
    const html = await page.content();

    const urls = html?.match(
      /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    );

    if (!urls) {
      return [];
    }

    return urls
      .filter((u) => u.includes("linkedin.com/in/"))
      .map((u) => {
        const match = u.match(/\/in\/([\w-]+)[\/]?/);

        if (!match || !match[1]) {
          return null;
        }

        return match[1];
      })
      .filter((u, i, arr) => Boolean(u) && arr.indexOf(u) === i);
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = { getAllLinkedInUrlByPage };

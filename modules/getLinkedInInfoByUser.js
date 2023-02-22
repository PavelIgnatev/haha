const { remote } = require("webdriverio");

const {
  normalizeLinkedInInfoByUser,
} = require("./normalizeLinkedInInfoByUser");

const scriptTag = 'script[type="application/ld+json"]';

const getLinkedInInfoByUser = async (url) => {
  try {
    const browser = await remote({
      capabilities: {
        browserName: "chrome",
      },
    });

    await browser.url(url);

    await browser.waitUntil(async () => {
      const state = await browser.execute(() => document.readyState);

      return state === "complete";
    });

    const script = await browser.$(scriptTag);
    const scriptContent = await script.getHTML(false);

    return normalizeLinkedInInfoByUser(scriptContent.trim());
  } catch {
    return {};
  }
};

module.exports = { getLinkedInInfoByUser };

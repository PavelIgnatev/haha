const { chromium } = require("playwright-extra");
const userAgent = require("user-agents");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { changeBrowserLanguage } = require("./helpers/changeBrowserLanguage");
const { changeBrowserWindowSize } = require("./helpers/changeBrowserWindowSize");

const chromiumLaunch = async () => {
  chromium.use(StealthPlugin());

  const browser = await chromium.launch({
    headless: false,
    chromiumSandbox: false,
  });
  const context = await browser.newContext({
    userAgent: await userAgent.random().toString(),
    permissions: ["notifications", "microphone", "camera"],
    cursor: "default",
    // proxy: {
    //   server: "45.147.100.92:8000",
    //   username: "RMb8yX",
    //   password: "06r5Be",
    // },
  });

  const page = await context.newPage();

  // await changeBrowserLanguage(page);

  return page;
};

module.exports = { chromiumLaunch };

const { chromiumLaunch } = require("../chromiumLaunch");

(async () => {
  const page = await chromiumLaunch(false);

  await page.goto("https://web.telegram.org/");

  await page.waitForLoadState("networkidle");

  await browser.close();
})();

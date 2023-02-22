const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function runScript() {
  const options = new chrome.Options();
  options.addArguments("--disable-blink-features=AutomationControlled");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(
      "https://www.linkedin.com/login/ru?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin"
    );

    await driver
      .findElement(By.id("username"))
      .sendKeys("palllkaignatev@yandex.ru");
    await driver.findElement(By.id("password")).sendKeys("pikcelxxx");
    await driver.findElement(By.className("from__button--floating")).click();

    await driver.get("https://www.linkedin.com/groups/3044917/");

    const SCROLL_PAUSE_TIME = 500;

    let i = 0;
    while (true) {
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight);"
      );
      await driver.sleep(SCROLL_PAUSE_TIME);

      i += 1;

      if (i > 100) {
        break;
      }
    }

    const html = await driver.getPageSource();

    const urls = html.match(
      /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    );

    const output = urls
      .filter(
        (u) => u.includes("linkedin.com/in/") && u.includes("miniProfileUrn")
      )
      .filter((u, i, arr) => arr.indexOf(u) === i);

    console.log(output);
    fs.appendFileSync("output.txt", output.join("\n"));
  } finally {
    await driver.quit();
  }
}

runScript();

require("dotenv").config();
const { chromiumLaunch } = require("./chromiumLaunch");
const {
  getUserWithOutValue,
  updateUser,
  createUsers,
  deleteUser,
  getUserWithValue,
} = require("./db/db");
const {
  getAllLinkedInUrlByPage,
} = require("./helpers/getAllLinkedInUrlByPage");

const parser = async () => {
  const page = await chromiumLaunch();
  const result = await getUserWithOutValue(Number(process.env.SKIP ?? 0));
  const usernames = result.map((userData) => userData.username);

  console.log(
    "Пользователей в работе:",
    result.length,
    ", позиция начата с:",
    Number(process.env.SKIP ?? 0)
  );

  for (const username of usernames) {
    try {
      await page.goto(`https://www.linkedin.com/in/${username}`);

      await page.waitForSelector('[data-test-id="nav-logo"]');

      const isGoinLinkedin = await page.title();

      if (isGoinLinkedin === "Sign In | LinkedIn") {
        console.log(isGoinLinkedin)
        process.exit();
      }

      const publicResigter = await page.$(
        '[aria-labelledby="public_profile_contextual-sign-in-modal-header"]'
      );
      const publicResigter2 = await page.$(
        "#public_profile_contextual-sign-in"
      );

      await publicResigter?.evaluate((node) => {
        node.style.display = "none";
      });

      await publicResigter2?.evaluate((node) => {
        node.style.display = "none";
      });

      const showMore = await page.$('button:has-text("Show more profiles")');

      await showMore?.click();

      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      const script = await page.$('script[type="application/ld+json"]');
      const scriptContent = await page.evaluate(
        (script) => script?.textContent,
        script
      );

      const urls = await getAllLinkedInUrlByPage(page);

      if (!scriptContent) {
        throw new Error();
      }

      updateUser({ username, value: JSON.parse(scriptContent.trim()) });
      console.log("Пользователь", username, "успешно обновлен");
      createUsers(urls);
    } catch (error) {
      try {
        if (!page) {
          process.exit();
        }

        const isGoinLinkedin = await page.$('h1:has-text("Join linkedin")');

        if (isGoinLinkedin) {
          process.exit();
        } else {
          console.log("Пользователь", username, "удален из БД");
          deleteUser(username);
        }
      } catch (error) {
        process.exit();
      }
    }
  }

  process.exit();
};

parser();

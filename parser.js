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
    Number(process.env.SKIP ? Number(process.env.SKIP) * 100 : 0)
  );

  let isClosed = false;

  for (const username of usernames) {
    try {
      await page.goto(`https://www.linkedin.com/in/${username}`);

      await page.waitForLoadState("load");

      await page.waitForTimeout(1000);

      const publicRegister = await page.$(
        ".modal__overlay--full-page.modal__overlay.modal__overlay--visible"
      );
      const publicResigter2 = await page.$(
        '[aria-labelledby="public_profile_contextual-sign-in-modal-header"]'
      );

      if (publicRegister) {
        await publicRegister.evaluate((node) => {
          node.style.display = "none";
        });
      }
      if (publicResigter2) {
        await publicResigter2.evaluate((node) => {
          node.style.display = "none";
        });
      }

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
        console.log(error);
        process.exit();
      }
    }
  }

  process.exit();
};

parser();

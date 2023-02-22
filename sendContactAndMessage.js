const fs = require("fs");

const { chromiumLaunch } = require("./chromiumLaunch");
const {
  simulateNaturalMouseMovement,
} = require("./helpers/simulateNaturalMouseMovement");
const {
  getAllLinkedInUrlByPage,
} = require("./helpers/getAllLinkedInUrlByPage");

async function runScript() {
  try {
    const page = await chromiumLaunch();
    await page.goto(
      "https://www.linkedin.com/login/ru?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin"
    );

    const username = await page.$("[id='username']");
    const password = await page.$("[id='password']");

    await simulateNaturalMouseMovement(page, username);
    await page.fill("#username", "trasulortaches@gmx.com");

    await simulateNaturalMouseMovement(page, password);
    await page.fill("#password", "kr3n24kZhX");

    const buttonSend = await page.$(".from__button--floating");

    await simulateNaturalMouseMovement(page, buttonSend);
    await page.click(".from__button--floating");

    await page.waitForTimeout(15000);

    for (const url of data) {
      try {
        await page.goto(url);
        const config = await getAllLinkedInUrlByPage(page);

        console.log(config);

        await page.waitForTimeout(4000);

        const profileButtonsSection = await page.$(
          ".pvs-profile-actions:not(.pvs-profile-actions--rtl)"
        );
        const buttonSendContact = await profileButtonsSection?.$(
          "span:has-text('Connect')"
        );
        const buttonMore = await profileButtonsSection?.$(
          "span:has-text('More')"
        );
        const buttonSendMessage = await profileButtonsSection?.$(
          "a:has-text('Message')"
        );
        const buttonFollow = await profileButtonsSection?.$(
          "span:has-text('Follow')"
        );
        const buttonUnFollow = await profileButtonsSection?.$(
          "span:has-text('Unfollow')"
        );
        const buttonFollowing = await profileButtonsSection?.$(
          "span:has-text('Following')"
        );
        const buttonsShowMore = await page?.$$("span:has-text('Show more')");
        const buttonSendMessageSpan = await buttonSendMessage?.$("span");

        if (buttonsShowMore.length) {
          for (const button of buttonsShowMore) {
            await page.waitForTimeout(2000);
            await button?.click();
          }
        }

        if (buttonFollow && !buttonUnFollow && !buttonFollowing) {
          await simulateNaturalMouseMovement(page, buttonMore);
          await buttonMore.click();

          await simulateNaturalMouseMovement(page, buttonFollow);
          await buttonFollow.click();
        }

        if (buttonSendMessage && !buttonSendMessageSpan) {
          await simulateNaturalMouseMovement(page, buttonMore);
          await buttonMore.click();

          await simulateNaturalMouseMovement(page, buttonSendMessage);
          await buttonSendMessage.click();

          await page.waitForTimeout(1000);

          const input = await page.$("[name='subject']");
          const contenteditable = await page.$(".msg-form__contenteditable");

          if (input) {
            await simulateNaturalMouseMovement(page, input);
            await page.fill("[name='subject']", "Special offer");

            await simulateNaturalMouseMovement(page, contenteditable);
            await page.fill(
              ".msg-form__contenteditable",
              "I am a developer, visit my website growth-teams.ru/eng I think we will work"
            );

            const buttonSend = await page.$(".msg-form__send-button");

            await simulateNaturalMouseMovement(page, buttonSend);
            await buttonSend.click();
          }
          const closeButton = await page.$(
            ".msg-overlay-bubble-header__control > [type='close']"
          );

          await page.waitForTimeout(6000);

          await simulateNaturalMouseMovement(page, closeButton);
          await closeButton?.click();
        }

        if (buttonSendContact) {
          await simulateNaturalMouseMovement(page, buttonMore);
          await buttonMore.click();

          await simulateNaturalMouseMovement(page, buttonSendContact);
          await buttonSendContact?.click();

          const buttonPersonalMessage = await page.$(
            "span:has-text('Add a note')"
          );

          await simulateNaturalMouseMovement(page, buttonPersonalMessage);
          await buttonPersonalMessage?.click();

          const userFromEmail = await page.$('input[name="email"]');

          if (userFromEmail) {
            await simulateNaturalMouseMovement(page, userFromEmail);
            await page.fill("input[name='email']", "palllkaignatev@gmail.com");
          }

          const customMessage = await page.$("#custom-message");
          await simulateNaturalMouseMovement(page, customMessage);

          await page.fill(
            "#custom-message",
            "I am a developer, visit my website growth-teams.ru/eng I think we will work"
          );

          const buttonPersonalMessages = await page.$(
            ".artdeco-modal__actionbar"
          );

          const buttonSend = await buttonPersonalMessages.$(
            "span:has-text('Send')"
          );

          await simulateNaturalMouseMovement(page, buttonSend);
          await buttonSend.click();
        }
      } catch (error) {
        console.log(error);
      }
    }
  } finally {
    // await browser.close();
  }
}

runScript();

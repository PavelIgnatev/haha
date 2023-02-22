const { delay } = require("./delay");

const simulateNaturalMouseMovement = async (page, element) => {
  const x = await element.boundingBox().then((box) => box.x + box.width / 2);
  const y = await element.boundingBox().then((box) => box.y + box.height / 2);

  const mouse = page.mouse;
  await mouse.move(x, y, { steps: 5 });

  await delay(500 + Math.random() * 500);

  for (let i = 0; i < 10; i++) {
    await mouse.move(
      x + Math.sin(i / 2) * 15 + Math.random() * 5,
      y + Math.cos(i / 2) * 15 + Math.random() * 5
    );
    await delay(50 + Math.random() * 50);
  }
  await mouse.move(x, y, { steps: 5 });
  await delay(500 + Math.random() * 500);
};

module.exports = { simulateNaturalMouseMovement };

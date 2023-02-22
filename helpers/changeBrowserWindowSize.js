const changeBrowserWindowSize = async (page) => {
  const minSize = 1100;
  const maxSize = 1500;

  const width = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  const height = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

  await page.setViewportSize({ width, height });
};

module.exports = { changeBrowserWindowSize };

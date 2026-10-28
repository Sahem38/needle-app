// Рендер плакатов витрины в PNG.
// Запуск из папки posters/src (или откуда угодно — пути от этого файла):
//   node render.js
// Нужен Playwright с Chromium: npm i -D playwright && npx playwright install chromium
// Свой Chromium можно указать переменной CHROMIUM_PATH.
const path = require('path');
const { chromium } = require('playwright');

const SRC = __dirname;
const POSTERS = [
  ['01-main.html', '../01-main.png', 1600, 900],
  ['02-planner.html', '../02-planner.png', 1600, 900],
  ['03-notes.html', '../03-notes.png', 1600, 900],
  ['04-mobile.html', '../04-mobile.png', 1600, 900],
  ['05-how-made.html', '../05-how-made.png', 1600, 900],
  ['social-preview.html', '../../social-preview.png', 1280, 640],
];

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const [html, png, width, height] of POSTERS) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto('file://' + path.join(SRC, html));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SRC, png) });
    console.log('🖼 ', path.relative(path.join(SRC, '../..'), path.join(SRC, png)));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error('❌', e.message); process.exit(1); });

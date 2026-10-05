const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const { default: puppeteer } = await import('puppeteer');
  const browser = await puppeteer.launch({ headless: true });
  const url = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      await page.setViewport({ width, height: 900 });
      await page.goto(url, { waitUntil: 'load' });
      for (const language of ['id', 'en']) {
        if (language === 'en') await page.click('[data-language-toggle]');
        const result = await page.evaluate(() => ({
          language: document.documentElement.lang,
          overflow: document.documentElement.scrollWidth > innerWidth,
          smallBody: [...document.querySelectorAll('.experience-item>p,.expertise-list p,.work-list p,.education-column p')].filter(element => parseFloat(getComputedStyle(element).fontSize) < 16).length,
          clipped: [...document.querySelectorAll('h1,h2,h3,.hero-intro,.sales-fact>span')].filter(element => element.clientWidth && element.scrollWidth > element.clientWidth + 2).map(element => element.textContent.trim()),
          smallControls: ['.language-flag', ...(innerWidth <= 640 ? ['.menu-toggle'] : [])].filter(selector => { const rect = document.querySelector(selector).getBoundingClientRect(); return rect.width < 44 || rect.height < 44; }),
        }));
        assert.equal(result.language, language);
        assert.equal(result.overflow, false, `${width}px page overflow`);
        assert.equal(result.smallBody, 0, `${width}px body text below 16px`);
        assert.deepEqual(result.clipped, [], `${width}px clipped text: ${result.clipped.join(', ')}`);
        assert.deepEqual(result.smallControls, []);
      }
      await page.click('[data-language-toggle]');
      console.log(`Responsive ${width}px: ID/EN, readable text, no clipped content.`);
    }

    await page.setViewport({ width: 375, height: 812 });
    await page.goto(url);
    await page.click('.menu-toggle');
    await page.waitForFunction(() => document.activeElement === document.querySelector('nav a'));
    assert.equal(await page.$eval('.menu-toggle', element => element.getAttribute('aria-expanded')), 'true');
    assert.equal(await page.$eval('main', element => element.inert), true);
    assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('nav a')), true);
    for (let index = 0; index < 6; index++) await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('nav a')), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('main', element => element.inert), false);
    assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.menu-toggle')), true);
    await page.click('.earlier-work summary');
    assert.equal(await page.evaluate(() => document.querySelector('.earlier-work summary').getBoundingClientRect().top < document.querySelector('.earlier-list').getBoundingClientRect().top), true);

    await page.setViewport({ width: 1440, height: 1000 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.goto(url);
    await page.click('.capability-toggle');
    assert.equal(await page.$eval('.capability-toggle', element => element.getAttribute('aria-pressed')), 'true');
    const capability = await page.$eval('#rotating-capability', element => element.textContent);
    await new Promise(resolve => setTimeout(resolve, 2800));
    assert.equal(await page.$eval('#rotating-capability', element => element.textContent), capability);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    assert.equal(await page.$eval('.capability-toggle', element => element.disabled), true);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.community-banner .eyebrow')).opacity === '1');

    const contrast = await page.evaluate(() => {
      const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
      const luminance = color => rgb(color).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      return ['.featured-work p', '.community-banner p', '.expertise-list p'].map(selector => {
        const element = document.querySelector(selector);
        let surface = element;
        while (getComputedStyle(surface).backgroundColor === 'rgba(0, 0, 0, 0)') surface = surface.parentElement;
        const values = [luminance(getComputedStyle(element).color), luminance(getComputedStyle(surface).backgroundColor)].sort((a, b) => b - a);
        return { selector, ratio: (values[0] + .05) / (values[1] + .05), opacity: getComputedStyle(element).opacity };
      });
    });
    for (const item of contrast) { assert(item.ratio >= 4.5, `${item.selector} text contrast`); assert.equal(item.opacity, '1'); }

    const blocked = await browser.newPage();
    blocked.on('pageerror', error => errors.push(error.message));
    await blocked.evaluateOnNewDocument(() => {
      Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
      Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
    });
    await blocked.goto(url);
    await blocked.click('[data-language-toggle]');
    assert.equal(await blocked.$eval('html', element => element.lang), 'en');
    assert.equal(await blocked.$eval('#year', element => element.textContent), String(new Date().getFullYear()));
    assert.deepEqual(errors, []);
    const assets = await page.$$eval('a[download]', links => links.map(link => link.getAttribute('href')));
    for (const asset of assets) assert(fs.existsSync(path.resolve(__dirname, '..', asset)), `Missing ${asset}`);
    console.log('Keyboard menu, details order, pause/reduced motion, contrast, blocked storage, and CV links passed.');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

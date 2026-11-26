// Smoke test: loads the built single-file game in headless Chrome at several viewports,
// cycles 4 languages × 4 modes, performs real taps, and asserts no errors.
// Usage: node build.mjs && node tests/smoke.mjs
import { createRequire } from 'node:module';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let pw;
for (const p of ['playwright', 'playwright-core', '/mnt/bot/workspace/la-cf/node_modules/playwright', '/mnt/bot/workspace/la-cf/node_modules/playwright-core']) {
  try { pw = require(p); break; } catch { /* try next */ }
}
if (!pw) { console.error('playwright not found'); process.exit(2); }
const chromePath = ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'].find(existsSync);

const shots = join(root, 'screenshots');
mkdirSync(shots, { recursive: true });
const FILE = process.argv[2] || 'index.html';
const url = pathToFileURL(join(root, FILE)).href;

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'phone-landscape', width: 844, height: 390 }
];
const LANGS = ['he', 'el', 'th', 'es'];

// Mock speechSynthesis: voices for he/el/es, deliberately NO Thai voice to exercise the sound-out badge.
const speechMock = () => {
  const voices = [
    { name: 'Mock Hebrew', lang: 'he-IL', default: false, localService: true, voiceURI: 'he' },
    { name: 'Mock Greek', lang: 'el-GR', default: false, localService: true, voiceURI: 'el' },
    { name: 'Mock Spanish', lang: 'es-ES', default: false, localService: true, voiceURI: 'es' },
    { name: 'Mock English', lang: 'en-US', default: true, localService: true, voiceURI: 'en' }
  ];
  window.__spoken = [];
  const ss = {
    getVoices: () => voices, speak: (u) => window.__spoken.push({ text: u.text, lang: u.lang, voice: u.voice && u.voice.name }),
    cancel: () => {}, pause: () => {}, resume: () => {}, speaking: false, pending: false,
    addEventListener: () => {}, removeEventListener: () => {}, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: ss, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.voice = null; };
};

const failures = [];
function check(cond, msg) { if (!cond) { failures.push(msg); console.log('  ✗ ' + msg); } }

const browser = await pw.chromium.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
let shotCount = 0;
for (const vp of VIEWPORTS) {
  console.log(`\n=== ${vp.name} ${vp.width}x${vp.height} ===`);
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.name.startsWith('phone') });
  await ctx.addInitScript(speechMock);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('file:') && !u.startsWith('data:')) errors.push('network request: ' + u); });
  await page.goto(url);
  await page.waitForFunction(() => window.LPW && document.querySelector('.mode-btn'));
  const snap = async (n) => { await page.waitForTimeout(250); await page.screenshot({ path: join(shots, `${vp.name}-${n}.png`) }); shotCount++; };
  const noHScroll = async (where) => {
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
    check(o.sw <= o.w + 1, `${vp.name} ${where}: horizontal scroll (${o.sw} > ${o.w})`);
  };
  const stars = () => page.evaluate(() => window.LPW.state().stars);

  // Home + parent toggle
  check(await page.locator('#homeBtn').isVisible(), 'home button visible');
  const homeBox = await page.locator('#homeBtn').boundingBox();
  check(homeBox.width >= 64 && homeBox.height >= 64, `${vp.name}: home button >= 64px`);
  const pills = await page.locator('.pill').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [r.width, r.height]; }));
  check(pills.every(([w, h]) => w >= 64 && h >= 64), `${vp.name}: language pills >= 64px (${JSON.stringify(pills)})`);
  await page.click('#parentBtn');
  check(await page.evaluate(() => document.body.classList.contains('parent-on')), 'parent toggle on');

  for (const lang of LANGS) {
    await page.click(`.pill[data-lang="${lang}"]`);
    check((await page.evaluate(() => window.LPW.state().lang)) === lang, `setLang via pill ${lang}`);
    await page.click('#homeBtn');
    await noHScroll(`${lang} home`);
    if (lang === 'he') {
      check(await page.locator('.hello .big[dir="rtl"]').count() === 1, 'Hebrew greeting has dir=rtl');
      await snap(`he-home`);
    }

    // 1. Letter Factory
    await page.click('.mode-btn[data-mode="letters"]');
    let s0 = await stars();
    await page.locator('.lcard').nth(0).click();
    await page.locator('.lcard').nth(2).click();
    await page.waitForTimeout(950);
    check((await stars()) >= s0 + 2, `${vp.name} ${lang} letters: stars increase (${s0} -> ${await stars()})`);
    check(await page.locator('#spot svg.pic').count() === 1, `${lang} letters: picture pops`);
    if (lang === 'he') {
      check(await page.locator('.lcard .ch[dir="rtl"]').count() >= 12, 'Hebrew letter cards dir=rtl');
      check(await page.locator('#spot .word[dir="rtl"]').count() === 1, 'Hebrew word dir=rtl');
    }
    const lc = await page.locator('.lcard').count();
    check(lc >= 12, `${lang}: >= 12 letters (${lc})`);
    await noHScroll(`${lang} letters`);
    await snap(`${lang}-letters`);

    // 2. Word Builder
    await page.click('#homeBtn');
    await page.click('.mode-btn[data-mode="builder"]');
    const expected = await page.locator('#slots .slot').evaluateAll((els) => els.map((e) => e.dataset.t));
    if (lang === 'he') {
      check(await page.locator('#slots[dir="rtl"]').count() === 1, 'Hebrew slots dir=rtl');
      const xs = await page.locator('#slots .slot').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().left));
      check(xs[0] > xs[xs.length - 1], 'Hebrew word builder: first letter slot is right-most');
    }
    // wrong tap first (a tile that is not the first expected letter)
    const wrongIdx = await page.locator('#tray .tile').evaluateAll((els, t) => els.findIndex((e) => e.dataset.t !== t), expected[0]);
    if (wrongIdx >= 0) {
      await page.locator('#tray .tile').nth(wrongIdx).click({ force: true });
      check(await page.locator('#slots .slot.filled').count() === 0, `${lang} builder: wrong tile bounces back`);
    }
    s0 = await stars();
    for (let i = 0; i < expected.length; i++) {
      const idx = await page.locator('#tray .tile').evaluateAll((els, t) => els.findIndex((e) => e.dataset.t === t && !e.classList.contains('used')), expected[i]);
      const tile = page.locator('#tray .tile').nth(idx);
      if (i === 0 && vp.name === 'desktop') {
        // drag the first tile into its slot using pointer events
        const a = await tile.boundingBox(), b = await page.locator('#slots .slot').nth(0).boundingBox();
        await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
        await page.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2 - 20, { steps: 3 });
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 }); await page.mouse.up();
        check(await page.locator('#slots .slot').nth(0).evaluate((e) => e.classList.contains('filled')), `${lang} builder: drag into slot works`);
      } else {
        await tile.click({ force: true });
      }
    }
    await page.waitForTimeout(950);
    check(await page.locator('#builder[data-done="1"]').count() === 1, `${vp.name} ${lang} builder: word completed`);
    check((await stars()) > s0, `${lang} builder: stars increase`);
    await noHScroll(`${lang} builder`);
    await snap(`${lang}-builder`);
    await page.click('#nextWord');
    check(await page.locator('#slots .slot').count() >= 2, `${lang} builder: next word loads`);

    // 3. Bubble Hunt
    await page.click('#homeBtn');
    await page.click('.mode-btn[data-mode="bubbles"]');
    check(await page.locator('.bubble').count() >= 3, `${lang} bubbles: 3-4 bubbles`);
    const wrong = page.locator('.bubble:not([data-ok])');
    await wrong.nth(0).click({ force: true }); await wrong.nth(1).click({ force: true });
    await page.waitForTimeout(700);
    check(await page.locator('.bubble[data-ok].hint').count() === 1, `${lang} bubbles: hint glow after 2 wrong taps`);
    check(await page.locator('#listen[data-solved]').count() === 0, `${lang} bubbles: wrong taps do not solve`);
    s0 = await stars();
    await page.locator('.bubble[data-ok]').click({ force: true });
    await page.waitForTimeout(950);
    check((await stars()) > s0, `${vp.name} ${lang} bubbles: correct pop gives star`);
    await noHScroll(`${lang} bubbles`);
    await snap(`${lang}-bubbles`);

    // 4. Sound Stage
    await page.click('#homeBtn');
    await page.click('.mode-btn[data-mode="stage"]');
    if (await page.locator('.tab.on[data-tab="numbers"]').count() === 0) await page.click('.tab[data-tab="numbers"]');
    check(await page.locator('.bar').count() === 10, `${lang} stage: 10 xylophone bars`);
    for (const n of [0, 4, 9]) await page.locator('.bar').nth(n).click();
    check(await page.locator('#stageOut .w').count() === 1, `${lang} stage: number shown`);
    const barBox = await page.locator('.bar').nth(9).boundingBox();
    check(barBox.width >= 28 && barBox.height >= 64, `${vp.name} ${lang} stage: bar tap target (${Math.round(barBox.width)}x${Math.round(barBox.height)})`);
    await noHScroll(`${lang} stage numbers`);
    await snap(`${lang}-stage`);
    await page.click('.tab[data-tab="colors"]');
    check(await page.locator('.swatch').count() >= 6, `${lang} stage: >= 6 colors`);
    await page.locator('.swatch').nth(1).click();
    await page.click('.tab[data-tab="animals"]');
    await page.locator('.zoo button').nth(0).click();
    await noHScroll(`${lang} stage animals`);
    await page.click('.tab[data-tab="numbers"]');
  }

  // Speech: correct-language voices only; Thai has no voice -> badge shown
  const spoken = await page.evaluate(() => window.__spoken);
  check(spoken.length > 0, 'speech was used');
  check(spoken.every((u) => u.voice !== 'Mock English'), 'never spoke with a wrong-language voice');
  check(!spoken.some((u) => /[฀-๿]/.test(u.text)), 'Thai text not sent to a non-Thai voice');
  check(await page.locator('#badge[data-shown]').count() === 1, 'sound-out badge shown when voice missing');

  // Sticker book
  await page.click('#homeBtn');
  await page.click('.sticker-btn');
  const unlocked = await page.locator('.stk:not(.locked)').count();
  check(unlocked >= 4, `${vp.name}: stickers unlocked (${unlocked})`);
  await noHScroll('stickers');
  await snap('stickers');

  // LPW hook + persistence across reload
  const before = await stars();
  await page.reload();
  await page.waitForFunction(() => window.LPW);
  check((await stars()) === before, `stars persist after reload (${before})`);
  check((await page.evaluate(() => window.LPW.goMode('letters'))) === 'letters', 'LPW.goMode works');

  for (const e of errors) check(false, `${vp.name}: ${e}`);
  console.log(`  ${vp.name}: done, ${errors.length} console/page errors, stars=${await stars()}`);
  await ctx.close();
}

// Private-mode style: localStorage throws -> game must still work.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('SecurityError: blocked'); } });
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => window.LPW);
  await page.click('.mode-btn[data-mode="letters"]');
  await page.locator('.lcard').first().click();
  await page.waitForTimeout(400);
  check(await page.locator('#badge[data-shown]').count() === 1, 'no speech API -> sound-out badge');
  check((await page.evaluate(() => window.LPW.state().stars)) === 1, 'stars work without localStorage');
  check(errs.length === 0, 'no errors without localStorage/speech: ' + errs.join(' | '));
  await page.screenshot({ path: join(shots, 'no-storage-badge.png') }); shotCount++;
  await ctx.close();
}

await browser.close();
console.log(`\nScreenshots saved: ${shotCount} in screenshots/`);
if (failures.length) { console.log(`\nFAILED: ${failures.length} check(s)`); process.exit(1); }
console.log('\nALL SMOKE CHECKS PASSED');

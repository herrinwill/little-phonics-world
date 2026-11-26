// Smoke test: loads BOTH builds in headless Chrome at several viewports —
//   index.html over a local HTTP server (English clips from ./audio/en/*.mp3) and
//   Little-Phonics-World.html over file:// (clips embedded as data: URIs) —
// checks a fresh load starts in American English, cycles 5 languages × 4 modes, performs real taps,
// verifies the natural English voice clips load and never overlap, and asserts no errors.
// Usage: node build.mjs && node tests/smoke.mjs
import { createRequire } from 'node:module';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { serve, mediaTracker, requiredKeys, clipFiles, loadClips, rapidTap,
  NATIVE_LANGS, SITE, nativeManifest, requiredTexts, routeSite, loadNative, rapidTapLang } from './audio-checks.mjs';

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
const { origin, log: httpLog, server } = await serve(root);
const TARGETS = [
  { name: 'web', file: 'index.html', url: origin + '/index.html', http: true, shot: '' },
  { name: 'standalone', file: 'Little-Phonics-World.html', url: pathToFileURL(join(root, 'Little-Phonics-World.html')).href, http: false, shot: 'standalone-' }
];
let url = TARGETS[0].url, T = TARGETS[0];
// Standalone over file:// may only reach the game's own website for he/el/th/es clips (routed to local files in tests).
const okRequest = (u) => u.startsWith('data:') || (T.http ? u.startsWith(origin + '/') : (u.startsWith('file:') || u.startsWith(SITE)));

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'phone-landscape', width: 844, height: 390 }
];
const LANGS = ['en', 'he', 'el', 'th', 'es'];

// Mock speechSynthesis: voices for en-US/en-GB/he/el/es, deliberately NO Thai voice to exercise the sound-out badge.
const speechMock = () => {
  const voices = [
    { name: 'Mock Hebrew', lang: 'he-IL', default: false, localService: true, voiceURI: 'he' },
    { name: 'Mock Greek', lang: 'el-GR', default: false, localService: true, voiceURI: 'el' },
    { name: 'Mock Spanish', lang: 'es-ES', default: false, localService: true, voiceURI: 'es' },
    { name: 'Mock British', lang: 'en-GB', default: false, localService: true, voiceURI: 'en-gb' },
    { name: 'Mock English', lang: 'en-US', default: true, localService: true, voiceURI: 'en' }
  ];
  window.__spoken = [];
  const ss = {
    getVoices: () => voices, speak: (u) => window.__spoken.push({ text: u.text, lang: u.lang, voice: u.voice && u.voice.name, app: window.LPW ? window.LPW.state().lang : '?' }),
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
for (T of TARGETS) {
url = T.url;
console.log(`\n##### ${T.name}: ${T.file} via ${T.http ? 'HTTP' : 'file://'} #####`);
for (const vp of VIEWPORTS) {
  console.log(`\n=== ${T.name} ${vp.name} ${vp.width}x${vp.height} ===`);
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.name.startsWith('phone') });
  await ctx.addInitScript(speechMock);
  await ctx.addInitScript(mediaTracker);
  if (!T.http) await routeSite(ctx, root, 'serve');
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!okRequest(u)) errors.push('network request: ' + u); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
  await page.goto(url);
  await page.waitForFunction(() => window.LPW && document.querySelector('.mode-btn'));
  const snap = async (n, force) => {
    if (T.shot && !force) return;
    await page.waitForTimeout(250); await page.screenshot({ path: join(shots, `${T.shot}${vp.name}-${n}.png`) }); shotCount++;
  };
  const noHScroll = async (where) => {
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
    check(o.sw <= o.w + 1, `${vp.name} ${where}: horizontal scroll (${o.sw} > ${o.w})`);
  };
  const stars = () => page.evaluate(() => window.LPW.state().stars);

  // Fresh visitor (cleared storage) starts in American English
  const fresh = await page.evaluate(() => ({ lang: window.LPW.state().lang, first: document.querySelector('.pill').dataset.lang,
    order: [...document.querySelectorAll('.pill')].map((p) => p.dataset.lang), hello: document.querySelector('.hello .big').textContent,
    stored: (() => { try { return localStorage.getItem('littlePhonicsWorld.v1'); } catch { return 'ERR'; } })() }));
  check(fresh.lang === 'en', `${vp.name}: fresh load starts in English (${fresh.lang})`);
  check(fresh.first === 'en' && fresh.order.join() === 'en,he,el,th,es', `${vp.name}: pill order English first (${fresh.order})`);
  check(/^(Hi there!|Howdy!)$/.test(fresh.hello), `${vp.name}: English home greeting (${fresh.hello})`);
  check(await page.locator('.mean').count() === 0, `${vp.name}: no meaning captions on English home`);
  await homeLayout(page, vp);
  await snap('en-home', true);

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
    if (lang === 'en') {
      check((await page.locator('.lcard').count()) === 26, `en letters: all 26 A–Z`);
      check(await page.locator('.mean').count() === 0, 'en letters: no meaning captions in English');
      check((await page.locator('#spot .word').textContent()) === 'cat', 'en letters: C is for cat');
    } else {
      const m = await page.locator('#spot .mean').textContent().catch(() => '');
      check(m.length > 0, `${vp.name} ${lang} letters: spotlight shows English meaning (${m})`);
      check(await page.locator('#spot .mean').isVisible(), `${vp.name} ${lang} letters: meaning caption visible`);
    }
    const lc = await page.locator('.lcard').count();
    check(lc >= 12, `${lang}: >= 12 letters (${lc})`);
    await noHScroll(`${lang} letters`);
    await snap(`${lang}-letters`);

    // 2. Word Builder
    await page.click('#homeBtn');
    await page.click('.mode-btn[data-mode="builder"]');
    const expected = await page.locator('#slots .slot').evaluateAll((els) => els.map((e) => e.dataset.t));
    if (lang === 'en') check(expected.length >= 3 && expected.length <= 4, `en builder: 3–4 letter word (${expected.join('')})`);
    else check(await page.locator('#builder .mean').isVisible(), `${vp.name} ${lang} builder: English meaning visible`);
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
    if (lang !== 'en') {
      const nb = await page.locator('.bubble').count(), nm = await page.locator('.bubble .mean').count();
      check(nm === nb, `${vp.name} ${lang} bubbles: every bubble shows English meaning (${nm}/${nb})`);
      check(await page.locator('.ask .mean').isVisible(), `${lang} bubbles: target word shows English meaning`);
    } else check(await page.locator('.mean').count() === 0, 'en bubbles: no meaning captions');
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
    if (lang !== 'en') check(/ten/.test(await page.locator('#stageOut .mean').textContent().catch(() => '')), `${vp.name} ${lang} stage: number shows English meaning`);
    const barBox = await page.locator('.bar').nth(9).boundingBox();
    check(barBox.width >= 28 && barBox.height >= 64, `${vp.name} ${lang} stage: bar tap target (${Math.round(barBox.width)}x${Math.round(barBox.height)})`);
    await noHScroll(`${lang} stage numbers`);
    await snap(`${lang}-stage`);
    await page.click('.tab[data-tab="colors"]');
    check(await page.locator('.swatch').count() >= 6, `${lang} stage: >= 6 colors`);
    await page.locator('.swatch').nth(1).click();
    if (lang !== 'en') {
      check(await page.locator('.swatch .mean').count() === await page.locator('.swatch').count(), `${lang} stage: every color shows English meaning`);
      check(/orange/.test(await page.locator('#stageOut .mean').textContent().catch(() => '')), `${lang} stage: tapped color shows English meaning`);
    }
    await page.click('.tab[data-tab="animals"]');
    await page.locator('.zoo button').nth(0).click();
    check(await page.locator('.zoo button').count() === 8, `${lang} stage: 8 animals`);
    if (lang !== 'en') check(await page.locator('.zoo button .mean').count() === 8, `${lang} stage: every animal shows English meaning`);
    await noHScroll(`${lang} stage animals`);
    await page.click('.tab[data-tab="numbers"]');
  }

  // Speech: native clips for he/el/th/es; any device-voice use is correct-language only
  const spoken = await page.evaluate(() => window.__spoken);
  const used = await page.evaluate(() => ({ log: window.CLIPS.log(), missing: window.CLIPS.missing(), media: window.__media.errors, max: window.__media.max }));
  for (const k of ['letter-a', 'letter-c', 'spell-', 'tile-', 'word-', 'cheer-']) check(used.log.some((x) => x.startsWith(k)), `${T.name} ${vp.name}: English clip ${k}… played`);
  check(used.missing.length === 0, `${T.name} ${vp.name}: no missing English clips (${used.missing})`);
  check(used.media.length === 0, `${T.name} ${vp.name}: no media errors (${used.media})`);
  check(used.max <= 1, `${T.name} ${vp.name}: never more than one clip playing (${used.max})`);
  for (const l of NATIVE_LANGS) check(used.log.some((x) => x.startsWith(l + '/')), `${T.name} ${vp.name}: native ${l} voice clips played`);
  check(spoken.length === 0, `${T.name} ${vp.name}: no device-voice fallback needed while native clips work (${spoken.map((u) => u.app + ':' + u.text).slice(0, 4)})`);
  check(!spoken.some((u) => u.app === 'en'), `${T.name} ${vp.name}: English never fell back to the robotic device voice (${spoken.filter((u) => u.app === 'en').map((u) => u.text).slice(0, 4)})`);
  check(spoken.filter((u) => u.app !== 'en').every((u) => !/^en/i.test(u.lang || '')), 'never spoke a non-English language with an English voice');
  const vmap = { he: 'he-IL', el: 'el-GR', es: 'es-ES' };
  check(spoken.filter((u) => vmap[u.app]).every((u) => u.lang === vmap[u.app]), 'each language used its own voice');
  check(!spoken.some((u) => /[฀-๿]/.test(u.text)), 'Thai text not sent to a non-Thai voice');
  check(await page.locator('#badge[data-shown]').count() === 1, 'sound-out badge shown with native clips');

  // Sticker book
  await page.click('#homeBtn');
  await page.click('.sticker-btn');
  const unlocked = await page.locator('.stk:not(.locked)').count();
  check(unlocked >= 5, `${vp.name}: stickers unlocked (${unlocked})`);
  check(await page.locator('.stk').count() === 20, `${vp.name}: 20 stickers (5 languages × 4 modes)`);
  check(await page.locator('.stk[data-id^="en-"]').count() === 4, `${vp.name}: English stickers present`);
  await noHScroll('stickers');
  await snap('stickers');

  // LPW hook + persistence across reload
  const before = await stars();
  await page.reload();
  await page.waitForFunction(() => window.LPW);
  check((await stars()) === before, `stars persist after reload (${before})`);
  check((await page.evaluate(() => window.LPW.goMode('letters'))) === 'letters', 'LPW.goMode works');

  for (const e of errors) check(false, `${vp.name}: ${e}`);
  console.log(`  ${T.name} ${vp.name}: done, ${errors.length} console/page errors, stars=${await stars()}`);
  await ctx.close();
}
await audioSuite();
}
url = TARGETS[0].url; T = TARGETS[0];

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
  check((await page.evaluate(() => window.LPW.state().stars)) === 1, 'stars work without localStorage');
  check((await page.evaluate(() => window.LPW.audioState().key)) === 'letter-a', 'no speech API: English still plays its natural clip');
  await page.click('.pill[data-lang="he"]');
  await page.click('#homeBtn'); await page.click('.mode-btn[data-mode="letters"]');
  await page.locator('.lcard').first().click();
  await page.waitForTimeout(400);
  check(await page.locator('#badge[data-shown]').count() === 1, 'no speech API -> sound-out badge (Hebrew)');
  check(errs.length === 0, 'no errors without localStorage/speech: ' + errs.join(' | '));
  await page.screenshot({ path: join(shots, 'no-storage-badge.png') }); shotCount++;
  await ctx.close();
}

// Saved progress compatibility: invalid/missing saved language -> English; valid saved language kept.
for (const [label, saved, expectLang, expectStars] of [
  ['invalid lang', JSON.stringify({ stars: 7, lang: 'xx', parent: false, prog: {}, stickers: { 'he-letters': 1 } }), 'en', 7],
  ['missing lang', JSON.stringify({ stars: 3, prog: {}, stickers: {} }), 'en', 3],
  ['non-string lang', JSON.stringify({ stars: 2, lang: 42, prog: {}, stickers: {} }), 'en', 2],
  ['corrupt JSON', '{not json', 'en', 0],
  ['old Hebrew save', JSON.stringify({ stars: 12, lang: 'he', parent: false, prog: { he: { letters: ['א'] } }, stickers: { 'he-builder': 1 } }), 'he', 12]
]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(speechMock);
  await ctx.addInitScript((v) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('littlePhonicsWorld.v1', v); sessionStorage.setItem('seeded', '1'); } }, saved);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => window.LPW && document.querySelector('.mode-btn'));
  const st = await page.evaluate(() => window.LPW.state());
  check(st.lang === expectLang, `saved ${label}: starts in ${expectLang} (${st.lang})`);
  check(st.stars === expectStars, `saved ${label}: stars kept (${st.stars})`);
  await page.click('.mode-btn[data-mode="letters"]');
  await page.locator('.lcard').first().click();
  await page.click('#homeBtn'); await page.click('.sticker-btn');
  check(errs.length === 0, `saved ${label}: no errors ` + errs.join(' | '));
  await ctx.close();
}

// English letters screenshot with Parent Info off (what a kid sees)
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(speechMock);
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForFunction(() => window.LPW && document.querySelector('.mode-btn'));
  await page.click('.mode-btn[data-mode="letters"]');
  await page.locator('.lcard').nth(0).click();
  await page.waitForTimeout(1000);
  const said = await page.evaluate(() => ({ spoken: window.__spoken.map((u) => u.text), clips: window.CLIPS.log() }));
  check(said.clips.join('|') === 'letter-a' && said.spoken.length === 0, `en letter A plays one natural clip "A! A is for apple." (${said.clips} / ${said.spoken})`);
  await page.screenshot({ path: join(shots, 'desktop-en-letters.png') }); shotCount++;
  await page.click('#homeBtn'); await page.click('.mode-btn[data-mode="builder"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(shots, 'desktop-en-builder-kid.png') }); shotCount++;
  await page.click('.pill[data-lang="es"]');
  await page.click('#homeBtn'); await page.click('.mode-btn[data-mode="letters"]');
  await page.locator('.lcard').nth(6).click();
  await page.waitForTimeout(1000);
  check(await page.locator('#spot .mean').isVisible(), 'Spanish meaning visible with Parent Info off');
  await page.screenshot({ path: join(shots, 'desktop-es-letters-meaning.png') }); shotCount++;
  await ctx.close();
}

// Two builds from one source: web loads ./audio/en, standalone embeds every clip.
{
  const { readFileSync } = await import('node:fs');
  const a = readFileSync(join(root, 'index.html'), 'utf8'), b = readFileSync(join(root, 'Little-Phonics-World.html'), 'utf8');
  check(/window\.LPW_CLIPS = null;/.test(a) && !/"data:audio\/mpeg/.test(a), 'index.html loads clips from ./audio/en (no embedded audio)');
  const n = (b.match(/"data:audio\/mpeg;base64,/g) || []).length;
  check(n === clipFiles(root).size, `standalone embeds all ${clipFiles(root).size} clips (${n})`);
  check(Buffer.byteLength(b) < 2.5 * 1024 * 1024, `standalone < 2.5 MB (${(Buffer.byteLength(b) / 1048576).toFixed(2)} MB)`);
  check(a.replace(/window\.LPW_CLIPS = [\s\S]*?;\n\/\* ---- data-en/, '') === b.replace(/window\.LPW_CLIPS = [\s\S]*?;\n\/\* ---- data-en/, ''), 'both builds share identical game code');
  const bad = httpLog.filter(([, st]) => st !== 200);
  check(bad.length === 0, 'local HTTP server: every request 200 (' + JSON.stringify(bad.slice(0, 5)) + ')');
  console.log(`HTTP requests served: ${httpLog.length}, mp3: ${httpLog.filter(([u]) => u.endsWith('.mp3')).length}`);
}
server.close();

await browser.close();
console.log(`\nScreenshots saved: ${shotCount} in screenshots/`);
if (failures.length) { console.log(`\nFAILED: ${failures.length} check(s)`); process.exit(1); }
console.log('\nALL SMOKE CHECKS PASSED');

/* Home layout: Sticker Book label is clean (nothing on top of it), the hidden badge never peeks in,
   and on desktop/tablet the whole Sticker Book button fits on screen without scrolling. */
async function homeLayout(page, vp) {
  const r = await page.evaluate(() => {
    const b = document.querySelector('.sticker-btn'), lbl = b.querySelector('span'), badge = document.getElementById('badge');
    const vb = b.getBoundingClientRect(), bb = badge.getBoundingClientRect(), cs = getComputedStyle(badge);
    const fitsNoScroll = vb.bottom <= innerHeight && vb.top >= 0;
    lbl.scrollIntoView({ block: 'center' });
    const lr = lbl.getBoundingClientRect(), hits = [];
    for (const fx of [0.1, 0.3, 0.5, 0.7, 0.9]) for (const fy of [0.3, 0.5, 0.7]) {
      const e = document.elementFromPoint(lr.left + lr.width * fx, lr.top + lr.height * fy);
      if (!e || !b.contains(e)) hits.push(e ? (e.id || e.className || e.tagName) : 'none');
    }
    window.scrollTo(0, 0);
    return { fitsNoScroll, bottom: Math.round(vb.bottom), ih: innerHeight, hits, text: lbl.textContent,
      badgeHidden: cs.visibility === 'hidden' || bb.top >= innerHeight };
  });
  check(r.text === 'Sticker Book', `${vp.name}: Sticker Book label (${r.text})`);
  check(r.hits.length === 0, `${vp.name}: nothing overlaps the Sticker Book label (${r.hits})`);
  check(r.badgeHidden, `${vp.name}: hidden sound-out badge does not peek into the screen`);
  if (vp.height >= 700) check(r.fitsNoScroll, `${vp.name}: Sticker Book fully visible without scrolling (bottom ${r.bottom} / ${r.ih})`);
}

/* English natural-voice clips: real loading, rapid-tap overlap cancellation, fallback, voice preference. */
async function audioSuite() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(speechMock);
  await ctx.addInitScript(mediaTracker);
  const siteHits = [];
  if (!T.http) await routeSite(ctx, root, 'serve', siteHits);
  const page = await ctx.newPage();
  page.__siteHits = siteHits;
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('request', (r) => { if (!okRequest(r.url())) errs.push('network request: ' + r.url()); });
  page.on('response', (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
  await page.goto(url);
  await page.waitForFunction(() => window.LPW && window.CLIPS);

  // Every key the English data needs exists in audio/en and in the built page.
  const need = await requiredKeys(page), files = clipFiles(root), inPage = new Set(await page.evaluate(() => window.CLIPS.keys()));
  const noFile = need.filter((k) => !files.has(k)), noPage = need.filter((k) => !inPage.has(k));
  check(noFile.length === 0, `${T.name}: every needed clip exists in audio/en (missing: ${noFile})`);
  check(noPage.length === 0, `${T.name}: every needed clip is in the build (missing: ${noPage})`);
  check(await page.evaluate(() => window.CLIPS.embedded) === !T.http, `${T.name}: clips ${T.http ? 'loaded by relative URL' : 'embedded'}`);

  // Clips really load and decode.
  const res = await loadClips(page, ['letter-a', 'word-cat', 'spell-cat', 'hello', 'cheer-great-job', 'tile-b', 'word-yo-yo', 'letter-z']);
  for (const x of res) check(x.ok && x.rs >= 2 && x.dur > 0.2, `${T.name}: clip ${x.k} loads (readyState ${x.rs}, ${x.dur && x.dur.toFixed(2)}s, ${x.err || 'ok'})`);
  if (T.http) check(httpLog.some(([u, st]) => u === '/audio/en/spell-cat.mp3' && st === 200), 'web: ./audio/en/spell-cat.mp3 served with HTTP 200');

  // Rapid tapping 8 letters: only the last one plays, nothing stacks, no Web Speech.
  const rt = await rapidTap(page);
  console.log(`  ${T.name} rapid tap: 8 taps in ${rt.ms} ms -> ${JSON.stringify({ key: rt.key, playing: rt.playing, now: rt.now, max: rt.max, t: rt.t })}`);
  check(rt.ms < 1600, `${T.name}: 8 taps happened quickly (${rt.ms} ms)`);
  check(rt.key === 'letter-' + rt.last, `${T.name}: rapid tap ends on the last tapped letter (${rt.key} vs letter-${rt.last})`);
  check(rt.playing === true && rt.now <= 1 && rt.max <= 1, `${T.name}: exactly one clip playing after rapid taps (playing=${rt.playing}, now=${rt.now}, max=${rt.max})`);
  check(rt.t > 0, `${T.name}: last clip is actually progressing (currentTime ${rt.t})`);
  check(rt.spoken === 0 && rt.errs.length === 0, `${T.name}: no Web Speech stacking / media errors (${rt.spoken}, ${rt.errs})`);

  // Switching mode or language silences the clip.
  await page.evaluate(() => window.LPW.goMode('home'));
  check((await page.evaluate(() => window.LPW.audioState())).playing === false, `${T.name}: leaving a mode stops the clip`);
  await page.click('.pill[data-lang="he"]');
  await page.click('.pill[data-lang="en"]');
  await page.waitForTimeout(300);
  const hs = await page.evaluate(() => window.LPW.audioState());
  check(hs.key === 'hello' && hs.playing, `${T.name}: English greeting plays the natural "hello" clip (${JSON.stringify(hs)})`);

  // Builder completion: spell clip then the cheer that is on screen.
  await page.evaluate(() => window.LPW.goMode('builder'));
  const word = await page.locator('#slots .slot').evaluateAll((els) => els.map((e) => e.dataset.t).join(''));
  for (const t of word) {
    const i = await page.locator('#tray .tile').evaluateAll((els, t) => els.findIndex((e) => e.dataset.t === t && !e.classList.contains('used')), t);
    await page.locator('#tray .tile').nth(i).click({ force: true });
  }
  const cheerText = await page.locator('#fx .cheer').textContent();
  await page.waitForTimeout(700);
  const bs = await page.evaluate(() => window.LPW.audioState());
  check(bs.key === 'spell-' + word && bs.playing, `${T.name}: finished word plays spell-${word} (${JSON.stringify(bs)})`);
  await page.waitForFunction(() => /^cheer-/.test(window.LPW.audioState().key || ''), null, { timeout: 8000 }).catch(() => {});
  const ck = (await page.evaluate(() => window.LPW.audioState())).key;
  check(ck === 'cheer-' + cheerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), `${T.name}: spoken cheer matches the pop-up "${cheerText}" (${ck})`);
  await nativeChecks(page);
  check(errs.length === 0, `${T.name}: audio suite has no errors (${errs.join(' | ')})`);
  await ctx.close();

  if (T.http) await fallbackAndVoices();
  else await offlineStandalone();
}

/* A clip that fails falls back to Web Speech with the best natural English voice. */
async function fallbackAndVoices() {
  const voicesMock = (list) => {
    window.__spoken = [];
    const ss = { getVoices: () => list, speak: (u) => window.__spoken.push({ text: u.text, voice: u.voice && u.voice.name }), cancel: () => {},
      speaking: false, pending: false, addEventListener: () => {}, removeEventListener: () => {} };
    Object.defineProperty(window, 'speechSynthesis', { value: ss, configurable: true });
    window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  };
  const V = (name, lang) => ({ name, lang, default: false, localService: true, voiceURI: name });
  for (const [label, list, want] of [
    ['robotic vs Google', [V('Microsoft David - English (United States)', 'en-US'), V('Microsoft Zira - English (United States)', 'en-US'), V('Google US English', 'en-US'), V('Mock British', 'en-GB')], 'Google US English'],
    ['robotic en-US vs natural en-GB', [V('eSpeak English', 'en-US'), V('Fred', 'en-US'), V('Microsoft Sonia Online (Natural) - English (United Kingdom)', 'en-GB')], 'Microsoft Sonia Online (Natural) - English (United Kingdom)'],
    ['Samantha', [V('Albert', 'en-US'), V('Samantha', 'en-US'), V('Daniel', 'en-GB')], 'Samantha']
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(voicesMock, list);
    await ctx.route('**/audio/en/letter-a.mp3', (r) => r.fulfill({ status: 404, body: 'nope' }));
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => window.LPW);
    await page.click('.mode-btn[data-mode="letters"]');
    await page.locator('.lcard').nth(0).click();
    await page.waitForFunction(() => window.__spoken.length > 0, null, { timeout: 5000 }).catch(() => {});
    const sp = await page.evaluate(() => window.__spoken);
    check(sp.length === 1 && sp[0].text === 'A! A is for apple.' && sp[0].voice === want,
      `fallback (${label}): missing clip -> Web Speech "${sp[0] && sp[0].text}" with ${sp[0] && sp[0].voice} (want ${want})`);
    check(errs.length === 0, `fallback (${label}): no page errors ${errs}`);
    await ctx.close();
  }
}

/* Native he/el/th/es clips: every spoken text mapped, clips load, taps play them, rapid taps never stack. */
async function nativeChecks(page) {
  const base = await page.evaluate(() => window.CLIPS.nativeBase());
  check(base === (T.http ? './audio/' : SITE), `${T.name}: native clips load from ${T.http ? './audio/<lang>/' : 'the website (file://)'} (${base})`);
  for (const l of NATIVE_LANGS) {
    const need = await requiredTexts(page, l), man = nativeManifest(root, l);
    const miss = need.filter((t) => !man[t] && !man[t.normalize('NFC')]);
    check(miss.length === 0, `${T.name}: every ${l} spoken text has a manifest entry (missing: ${miss.join(' | ')})`);
    const inBuild = await page.evaluate((l) => window.LPW_NATIVE[l], l);
    check(JSON.stringify(inBuild) === JSON.stringify(man), `${T.name}: ${l} manifest embedded unchanged`);
    const noLookup = await page.evaluate(({ l, need }) => need.filter((t) => !window.CLIPS.native(l, t)), { l, need });
    check(noLookup.length === 0, `${T.name}: every ${l} text resolves to a clip in the game (${noLookup.join(' | ')})`);
    const sample = [0, 1, 2, Math.floor(need.length / 2), need.length - 1].map((i) => need[i]);
    for (const x of await loadNative(page, l, sample)) check(x.ok && x.rs >= 2 && x.dur > 0.2, `${T.name}: ${l} clip ${x.k} loads (readyState ${x.rs}, ${x.dur && x.dur.toFixed(2)}s, ${x.err || 'ok'})`);

    // A real tap on a letter plays its native clip, with the sound-out badge shown.
    await page.evaluate((l) => { window.__spoken.length = 0; window.LPW.setLang(l); window.LPW.goMode('letters'); }, l);
    await page.locator('.lcard').nth(0).click();
    await page.waitForTimeout(250);
    const st = await page.evaluate(() => {
      const D = window.LPW_DATA[window.LPW.state().lang], L = D.letters[0], b = document.getElementById('badge');
      return { ...window.LPW.audioState(), want: window.CLIPS.native(D.code, L.name).key, badge: b.classList.contains('show') && getComputedStyle(b).visibility === 'visible',
        spoken: window.__spoken.length, errs: window.__media.errors.slice() };
    });
    check(st.lang === l && st.key === st.want && st.playing, `${T.name}: tapping a ${l} letter plays its native clip (${JSON.stringify({ key: st.key, lang: st.lang, playing: st.playing, want: st.want })})`);
    check(st.badge, `${T.name}: ${l} sound-out badge visible while the native clip plays`);
    check(st.spoken === 0 && st.errs.length === 0, `${T.name}: ${l} letter used no device voice / media errors (${st.spoken}, ${st.errs})`);
    if (l === 'he') await page.screenshot({ path: join(shots, `${T.shot}native-he-letter.png`) }), shotCount++;
  }
  if (T.http) check(NATIVE_LANGS.every((l) => httpLog.some(([u, s]) => u.startsWith(`/audio/${l}/`) && u.endsWith('.mp3') && s === 200)), 'web: native clips served from ./audio/<lang>/ with HTTP 200');
  else check(NATIVE_LANGS.every((l) => page.__siteHits.some((u) => u.startsWith(l + '/'))), `standalone: native clips requested from the website (${page.__siteHits.length} routed)`);

  // Rapid taps in Hebrew and Thai: only the last letter plays, never two at once.
  for (const l of ['he', 'th']) {
    const rt = await rapidTapLang(page, l);
    console.log(`  ${T.name} ${l} rapid tap: ${rt.taps} taps in ${rt.ms} ms -> ${JSON.stringify({ key: rt.key, playing: rt.playing, now: rt.now, max: rt.max, t: rt.t })}`);
    check(rt.want.includes(rt.key) && rt.lang === l, `${T.name}: ${l} rapid tap ends on the last tapped letter (${rt.key} vs ${rt.want})`);
    check(rt.playing === true && rt.now <= 1 && rt.max <= 1, `${T.name}: ${l} exactly one clip playing after rapid taps (playing=${rt.playing}, now=${rt.now}, max=${rt.max})`);
    check(rt.spoken === 0 && rt.errs.length === 0, `${T.name}: ${l} rapid tap: no device voice / media errors (${rt.spoken}, ${rt.errs})`);
  }
  await page.evaluate(() => window.LPW.goMode('home'));
  check((await page.evaluate(() => window.LPW.audioState())).playing === false, `${T.name}: leaving a mode stops the native clip`);
  await page.click('.pill[data-lang="es"]');
  await page.waitForTimeout(250);
  const hs = await page.evaluate(() => window.LPW.audioState());
  check(hs.lang === 'es' && hs.text === '¡Hola!' && hs.playing, `${T.name}: switching to Spanish plays the native "¡Hola!" clip (${JSON.stringify(hs)})`);
  await page.click('.pill[data-lang="en"]');
}

/* Standalone over file:// with the website unreachable: silent fallback to the device voice / badge, no console errors. */
async function offlineStandalone() {
  // A: device offline (navigator.onLine false) + website aborted: strict, zero console messages and no request at all.
  // B: device "online" but the website is unreachable: one attempt, then silent fallback. Chrome itself prints one
  //    "Failed to load resource" line for the aborted media request (browser-generated, not catchable by page JS).
  await offlineRun(true);
  await offlineRun(false);
}
async function offlineRun(deviceOffline) {
  const tag = deviceOffline ? 'offline standalone' : 'site-unreachable standalone';
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(speechMock);
  await ctx.addInitScript(mediaTracker);
  const hits = [];
  await routeSite(ctx, root, 'offline', hits);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`console.${m.type()}: ${m.text()}`); });
  page.on('request', (r) => { if (!okRequest(r.url())) errs.push('network request: ' + r.url()); });
  await page.goto(url);
  await page.waitForFunction(() => window.LPW && document.querySelector('.mode-btn'));
  if (deviceOffline) await ctx.setOffline(true);
  const vmap = { he: 'he-IL', el: 'el-GR', es: 'es-ES' };
  for (const l of NATIVE_LANGS) {
    await page.click(`.pill[data-lang="${l}"]`);
    await page.click('#homeBtn'); await page.click('.mode-btn[data-mode="letters"]');
    await page.evaluate(() => { window.__spoken.length = 0; const b = document.getElementById('badge'); b.removeAttribute('data-shown'); b.innerHTML = ''; });
    await page.locator('.lcard').nth(1).click();
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const D = window.LPW_DATA[window.LPW.state().lang], L = D.letters[1], b = document.getElementById('badge');
      return { name: L.name, word: L.word, spoken: window.__spoken.slice(), badge: b.hasAttribute('data-shown') ? b.textContent : '', st: window.LPW.audioState() };
    });
    if (vmap[l]) check(r.spoken.length >= 1 && r.spoken[0].text === r.name && r.spoken.every((u) => u.lang === vmap[l]) && r.spoken.some((u) => u.text === r.word),
      `${tag}: ${l} letter falls back to the ${vmap[l]} device voice (${r.spoken.map((u) => u.text + '/' + u.lang)})`);
    else check(r.spoken.length === 0 && r.badge.includes(r.name), `${tag}: Thai (no device voice) falls back to the sound-out badge (${r.badge})`);
    check(!r.st.playing, `${tag}: ${l} no clip left playing (${JSON.stringify(r.st)})`);
    if (l === 'th') await page.screenshot({ path: join(shots, deviceOffline ? 'standalone-offline-th-badge.png' : 'standalone-unreachable-th-badge.png') }), shotCount++;
  }
  // Builder + bubbles offline too.
  await page.click('.pill[data-lang="es"]');
  await page.click('#homeBtn'); await page.click('.mode-btn[data-mode="bubbles"]');
  await page.waitForTimeout(700);
  check(await page.evaluate(() => window.__spoken.some((u) => u.lang === 'es-ES')), `${tag}: Spanish bubble word spoken by the device voice`);
  if (deviceOffline) {
    check(hits.length === 0, `${tag}: no request to the website while offline (${hits.length})`);
    check(errs.length === 0, `${tag}: no console errors or warnings (${errs.join(' | ')})`);
  } else {
    check(hits.length === 1, `${tag}: tried the website exactly once, then fell back without retrying (${hits.length} request(s))`);
    const own = errs.filter((e) => !/^console\.error: Failed to load resource: net::ERR_INTERNET_DISCONNECTED$/.test(e));
    check(own.length === 0, `${tag}: no game/JS console errors, only Chrome's single network line (${errs.join(' | ')})`);
    check(errs.length <= 1, `${tag}: at most one browser network message (${errs.length})`);
  }
  await ctx.close();
}

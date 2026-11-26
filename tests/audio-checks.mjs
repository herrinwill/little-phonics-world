// English voice-clip checks shared by both builds (index.html over HTTP, Little-Phonics-World.html over file://).
import { createServer } from 'node:http';
import { readFile, readdirSync, readFileSync as readFileSyncFs } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const TYPES = { '.html': 'text/html; charset=utf-8', '.mp3': 'audio/mpeg', '.json': 'application/json', '.js': 'text/javascript', '.png': 'image/png' };

/** Static server for the project dir on a random port. Records every request status. */
export function serve(root) {
  const log = [];
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    const file = join(root, path === '/' ? 'index.html' : path);
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); log.push([req.url, 403]); return; }
    readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('not found'); log.push([req.url, 404]); return; }
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Content-Length': buf.length, 'Accept-Ranges': 'none' });
      res.end(buf); log.push([req.url, 200]);
    });
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, log, origin: `http://127.0.0.1:${server.address().port}` })));
}

/** Tracks concurrently playing media elements (init script). */
export const mediaTracker = () => {
  const playing = new Set();
  window.__media = { max: 0, plays: 0, errors: [] };
  const on = (e) => { playing.add(e.target); window.__media.plays++; window.__media.max = Math.max(window.__media.max, playing.size); };
  const off = (e) => playing.delete(e.target);
  document.addEventListener('playing', on, true);
  document.addEventListener('pause', off, true);
  document.addEventListener('ended', off, true);
  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (!this.__tracked) {
      this.__tracked = true;
      this.addEventListener('playing', on); this.addEventListener('pause', off); this.addEventListener('ended', off);
      this.addEventListener('error', () => window.__media.errors.push((this.error && this.error.code) + ' ' + String(this.currentSrc).slice(0, 60)));
    }
    return origPlay.apply(this, arguments);
  };
  window.__media.playingNow = () => playing.size;
};

/** Every clip key the English data needs, computed from the live page data. */
export async function requiredKeys(page) {
  return page.evaluate(() => {
    const D = window.LPW_DATA.en, slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const k = new Set(['hello']);
    D.letters.forEach((L) => { k.add('letter-' + L.name.toLowerCase()); k.add('word-' + slug(L.word)); k.add('tile-' + L.name.toLowerCase()); });
    D.words.forEach((W) => { k.add('spell-' + W.w); k.add('word-' + slug(W.w)); W.tiles.forEach((t) => k.add('tile-' + t)); });
    [...D.numbers, ...D.colors, ...D.animals].forEach((x) => k.add('word-' + slug(x.w)));
    window.LPWCore.CHEERS.forEach((c) => k.add('cheer-' + slug(c)));
    return [...k].sort();
  });
}

export function clipFiles(root) {
  return new Set(readdirSync(join(root, 'audio', 'en')).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)));
}

/** Load several clips through fresh Audio elements and wait until they can play. */
export async function loadClips(page, keys) {
  return page.evaluate(async (keys) => {
    const one = (k) => new Promise((ok) => {
      const a = new Audio(); let done = false;
      const fin = (r) => { if (!done) { done = true; ok({ k, ...r, rs: a.readyState, dur: a.duration }); } };
      a.addEventListener('canplaythrough', () => fin({ ok: true }));
      a.addEventListener('loadeddata', () => { if (a.readyState >= 2) fin({ ok: true }); });
      a.addEventListener('error', () => fin({ ok: false, err: a.error && a.error.code }));
      setTimeout(() => fin({ ok: a.readyState >= 2, err: 'timeout' }), 8000);
      a.preload = 'auto'; a.src = window.CLIPS.src(k); a.load();
    });
    return Promise.all(keys.map(one));
  }, keys);
}

/** Tap 8 different English letters within ~1 s; return what is playing at the end. */
export async function rapidTap(page) {
  await page.evaluate(() => { window.__spoken.length = 0; window.LPW.setLang('en'); window.LPW.goMode('letters'); });
  const idx = [1, 4, 7, 10, 13, 16, 19, 25];
  const t0 = Date.now();
  for (const i of idx) await page.locator('.lcard').nth(i).click({ delay: 0 });
  const ms = Date.now() - t0;
  const last = await page.locator('.lcard').nth(idx[idx.length - 1]).evaluate((e) => e.querySelector('.ch').textContent[0].toLowerCase());
  await page.waitForTimeout(350);
  const st = await page.evaluate(() => ({ ...window.LPW.audioState(), now: window.__media.playingNow(), max: window.__media.max,
    t: window.CLIPS.element().currentTime, spoken: window.__spoken.length, errs: window.__media.errors.slice() }));
  return { ms, last, ...st };
}

/* ---------------- Native voice clips (Hebrew, Greek, Thai, Spanish) ---------------- */
export const NATIVE_LANGS = ['he', 'el', 'th', 'es'];
export const SITE = 'https://herrinwill.github.io/little-phonics-world/audio/';

export function nativeManifest(root, lang) {
  return JSON.parse(readFileSyncFs(join(root, 'audio', lang, 'manifest.json'), 'utf8')).clips;
}

/** Every text the game passes to C.say() for `lang`, mirroring the mode code (hello, letters, builder, bubbles, stage). */
export async function requiredTexts(page, lang) {
  return page.evaluate((lang) => {
    const D = window.LPW_DATA[lang], s = new Set([D.hello]);
    const base = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    D.letters.forEach((L) => { s.add(L.name); s.add(L.word); if (L.syl && lang === 'es') s.add(L.syl.split('-').join(', ')); });
    D.words.forEach((W) => {
      s.add(W.w); if (W.syl && W.syl.length > 1) s.add(W.syl.join(', '));
      W.tiles.forEach((t, k) => s.add((W.say && W.say[k]) || D.tileSay[t] || D.tileSay[base(t)] || t));
    });
    [...D.numbers, ...D.colors, ...D.animals].forEach((x) => s.add(x.w));
    return [...s];
  }, lang);
}

/** Serve (mode 'serve') or abort (mode 'offline') every request to the game's website, from the local audio/ folder. */
export async function routeSite(ctx, root, mode, hits) {
  await ctx.route(SITE + '**', async (r) => {
    const rel = decodeURIComponent(r.request().url().slice(SITE.length).split('?')[0]);
    if (hits) hits.push(rel);
    if (mode === 'offline' || !/^(he|el|th|es)\/[0-9]+\.mp3$/.test(rel)) return r.abort('internetdisconnected');
    return r.fulfill({ status: 200, contentType: 'audio/mpeg', body: readFileSyncFs(join(root, 'audio', rel)) });
  });
}

/** Load native clips (by exact text) through fresh Audio elements. */
export async function loadNative(page, lang, texts) {
  return page.evaluate(async ({ lang, texts }) => {
    const one = (text) => new Promise((ok) => {
      const e = window.CLIPS.native(lang, text);
      if (!e) return ok({ k: lang + ':' + text, ok: false, err: 'no clip' });
      const a = new Audio(); let done = false;
      const fin = (r) => { if (!done) { done = true; ok({ k: e.key + ' "' + text + '"', ...r, rs: a.readyState, dur: a.duration }); } };
      a.addEventListener('canplaythrough', () => fin({ ok: true }));
      a.addEventListener('loadeddata', () => { if (a.readyState >= 2) fin({ ok: true }); });
      a.addEventListener('error', () => fin({ ok: false, err: a.error && a.error.code }));
      setTimeout(() => fin({ ok: a.readyState >= 2, err: 'timeout' }), 8000);
      a.preload = 'auto'; a.src = e.src; a.load();
    });
    return Promise.all(texts.map(one));
  }, { lang, texts });
}

/** Tap several different letters of `lang` quickly; return what is playing at the end. */
export async function rapidTapLang(page, lang) {
  await page.evaluate((l) => { window.__spoken.length = 0; window.LPW.setLang(l); window.LPW.goMode('letters'); }, lang);
  const n = await page.locator('.lcard').count();
  const idx = [1, 3, 5, 7, 9, 11].filter((i) => i < n);
  const t0 = Date.now();
  for (const i of idx) await page.locator('.lcard').nth(i).click({ delay: 0 });
  const ms = Date.now() - t0;
  await page.waitForTimeout(350);
  const st = await page.evaluate((i) => {
    const D = window.LPW_DATA[window.LPW.state().lang], L = D.letters[i];
    return { ...window.LPW.audioState(), want: [window.CLIPS.native(D.code, L.name).key, window.CLIPS.native(D.code, L.word).key], now: window.__media.playingNow(), max: window.__media.max,
      t: window.CLIPS.element().currentTime, spoken: window.__spoken.length, errs: window.__media.errors.slice() };
  }, idx[idx.length - 1]);
  return { ms, taps: idx.length, ...st };
}

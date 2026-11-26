// Build: inline src/* into two single-file games (no deps).
//  - index.html (GitHub Pages): English voice clips load from ./audio/en/<key>.mp3 (window.LPW_CLIPS = null).
//  - Little-Phonics-World.html (standalone, works offline from file://): every English clip embedded as a data: URI.
//  - Both: Hebrew/Greek/Thai/Spanish clip maps embedded; MP3s from ./audio/<lang>/ (or the website when on file://).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(root, 'src', f), 'utf8');

const css = ['style.css', 'style2.css', 'style3.css'].map(src).join('\n');
const js = [
  'data-en.js', 'data-he.js', 'data-el.js', 'data-th.js', 'data-es.js',
  'art1.js', 'art2.js', 'art3.js', 'art4.js', 'art5.js', 'icons.js',
  'clips.js', 'audio.js', 'core.js',
  'mode-letters.js', 'mode-builder.js', 'mode-bubbles.js', 'mode-stage.js',
  'app.js'
].map((f) => `/* ---- ${f} ---- */\n${src(f)}`).join('\n');

if (/<\/script/i.test(js)) throw new Error('JS contains </script> — would break inlining');
// The ONE allowed external base URL: the game's own website, used only by the standalone file opened from file://
// to stream the Hebrew/Greek/Thai/Spanish voice clips.
const SITE = 'https://herrinwill.github.io/little-phonics-world/audio/';
if (/https?:\/\//i.test(js.replace(/http:\/\/www\.w3\.org\/2000\/svg/g, '').split(`'${SITE}'`).join(''))) throw new Error('JS references an external URL');

// English voice clips: manifest key -> spoken text; every key must have its MP3.
const audioDir = join(root, 'audio', 'en');
const manifest = JSON.parse(readFileSync(join(audioDir, 'manifest.json'), 'utf8'));
const keys = Object.keys(manifest).sort();
for (const k of keys) {
  if (!/^[a-z0-9-]+$/.test(k)) throw new Error(`Bad clip key: ${k}`);
  if (!existsSync(join(audioDir, k + '.mp3'))) throw new Error(`Missing clip audio/en/${k}.mp3`);
}
const textMap = JSON.stringify(Object.fromEntries(keys.map((k) => [k, manifest[k]])));
const embedded = '{\n' + keys.map((k) =>
  JSON.stringify(k) + ':"data:audio/mpeg;base64,' + readFileSync(join(audioDir, k + '.mp3')).toString('base64') + '"').join(',\n') + '\n}';

// Native voice clips (he/el/th/es): embed each manifest's exact-text -> file map; MP3s stay in audio/<lang>/.
const NATIVE_LANGS = ['he', 'el', 'th', 'es'];
const native = {};
for (const l of NATIVE_LANGS) {
  const m = JSON.parse(readFileSync(join(root, 'audio', l, 'manifest.json'), 'utf8'));
  if (!m.clips || typeof m.clips !== 'object') throw new Error(`audio/${l}/manifest.json has no clips`);
  for (const [t, f] of Object.entries(m.clips)) {
    if (!/^[0-9]{3,4}\.mp3$/.test(f)) throw new Error(`Bad clip file name in audio/${l}: ${f}`);
    if (!existsSync(join(root, 'audio', l, f))) throw new Error(`Missing clip audio/${l}/${f} for "${t}"`);
  }
  native[l] = m.clips;
}
const nativeMap = JSON.stringify(native);
const nativeCount = Object.values(native).reduce((n, m) => n + Object.keys(m).length, 0);

function page(clips) {
  const pre = `window.LPW_NATIVE = ${nativeMap};\nwindow.LPW_CLIP_TEXT = ${textMap};\nwindow.LPW_CLIPS = ${clips};\n`;
  if (/<\/script/i.test(pre) || /https?:\/\//i.test(pre)) throw new Error('Clip data would break inlining or references a URL');
  return src('shell.html')
    .replace('/*@@STYLE@@*/', () => css)
    .replace('/*@@SCRIPT@@*/', () => '"use strict";\n' + pre + js);
}

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB';
const web = page('null'), standalone = page(embedded);
if (Buffer.byteLength(standalone) > 2.5 * 1024 * 1024) throw new Error('Standalone file exceeds 2.5 MB');
writeFileSync(join(root, 'index.html'), web);
writeFileSync(join(root, 'Little-Phonics-World.html'), standalone);
console.log(`Built index.html (${kb(web)}, clips from ./audio/en/) and Little-Phonics-World.html (${kb(standalone)}, ${keys.length} English clips embedded); ${nativeCount} native he/el/th/es clips mapped`);

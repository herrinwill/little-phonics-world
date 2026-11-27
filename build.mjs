// Build: inline src/* into two single-file games (no deps).
//  - index.html (GitHub Pages): English voice clips load from ./audio/en/<key>.mp3 (window.LPW_CLIPS = null).
//  - Little-Phonics-World.html (standalone, works offline from file://): every English clip embedded as a data: URI.
//  - Both: Hebrew/Greek/Thai/Spanish clip maps embedded; MP3s from ./audio/<lang>/ (or the website when on file://).
//  - Letter-card flow: audio/for (English "is for …") embedded in the standalone; audio/means ("which means …") always streamed.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(root, 'src', f), 'utf8');

const css = ['style.css', 'style2.css', 'style3.css', 'style4.css'].map(src).join('\n');
const js = [
  'data-en.js', 'data-he.js', 'data-el.js', 'data-th.js', 'data-es.js',
  'art1.js', 'art2.js', 'art3.js', 'art4.js', 'art5.js', 'icons.js',
  'clips.js', 'audio.js', 'core.js', 'buddy.js',
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

// Letter SOUND clips (all 5 languages) + English explanation clips (he/el/th/es) + approved.json.
// index.html loads them from ./audio/sound|explain/<lang>/NN.mp3; the standalone embeds the small English sound clips.
const ALL_LANGS = ['en', ...NATIVE_LANGS];
const soundMeta = {}, explainMeta = {}, soundEmbed = {};
const approved = JSON.parse(readFileSync(join(root, 'audio', 'sound', 'approved.json'), 'utf8'));
for (const l of ALL_LANGS) {
  const m = JSON.parse(readFileSync(join(root, 'audio', 'sound', l, 'manifest.json'), 'utf8'));
  soundMeta[l] = {};
  for (const [k, v] of Object.entries(m)) {
    if (!/^[0-9]{2,3}\.mp3$/.test(v.file) || !existsSync(join(root, 'audio', 'sound', l, v.file))) throw new Error(`Missing/bad sound clip audio/sound/${l}/${v.file} for "${k}"`);
    soundMeta[l][k] = { file: v.file, ipa: v.ipa || '' };
    if (l === 'en') soundEmbed[k] = 'data:audio/mpeg;base64,' + readFileSync(join(root, 'audio', 'sound', l, v.file)).toString('base64');
  }
  if (!Array.isArray(approved[l])) throw new Error(`approved.json has no list for ${l}`);
  if (l === 'en') continue;
  const e = JSON.parse(readFileSync(join(root, 'audio', 'explain', l, 'manifest.json'), 'utf8'));
  explainMeta[l] = {};
  for (const [k, v] of Object.entries(e)) {
    if (!/^[0-9]{2,3}\.mp3$/.test(v.file) || !existsSync(join(root, 'audio', 'explain', l, v.file))) throw new Error(`Missing/bad explain clip audio/explain/${l}/${v.file} for "${k}"`);
    explainMeta[l][k] = { file: v.file, text: String(v.text || '') };
  }
}
const soundPre = `window.LPW_SOUND = ${JSON.stringify(soundMeta)};\nwindow.LPW_EXPLAIN = ${JSON.stringify(explainMeta)};\nwindow.LPW_APPROVED = ${JSON.stringify(approved)};\n`;
const soundCount = Object.values(soundMeta).reduce((n, m) => n + Object.keys(m).length, 0);
const explainCount = Object.values(explainMeta).reduce((n, m) => n + Object.keys(m).length, 0);

// Phonics Buddy (English only, en-US-AvaNeural): audio/buddy/manifest.json = {voice, clips: {key: {file, text, group}}}.
// index.html streams ./audio/buddy/<file>; the standalone embeds every Buddy clip so Hoot talks offline.
const BUDDY_GROUPS = ['welcome', 'cheer', 'retry', 'sticker', 'tap'];
const buddyMan = JSON.parse(readFileSync(join(root, 'audio', 'buddy', 'manifest.json'), 'utf8'));
if (!buddyMan.clips || typeof buddyMan.clips !== 'object') throw new Error('audio/buddy/manifest.json has no clips');
const buddyMeta = {}, buddyEmbed = {};
for (const [k, v] of Object.entries(buddyMan.clips)) {
  if (!/^[a-z0-9-]+$/.test(k) || !/^[a-z0-9-]+\.mp3$/.test(v.file || '')) throw new Error(`Bad Buddy clip ${k}: ${v.file}`);
  if (!BUDDY_GROUPS.includes(v.group)) throw new Error(`Buddy clip ${k} has unknown group ${v.group}`);
  if (!existsSync(join(root, 'audio', 'buddy', v.file))) throw new Error(`Missing Buddy clip audio/buddy/${v.file}`);
  buddyMeta[k] = { file: v.file, text: String(v.text || ''), group: v.group };
  buddyEmbed[k] = 'data:audio/mpeg;base64,' + readFileSync(join(root, 'audio', 'buddy', v.file)).toString('base64');
}
for (const g of BUDDY_GROUPS) if (!Object.values(buddyMeta).some((m) => m.group === g)) throw new Error(`No Buddy clips in group ${g}`);
const buddyPre = `window.LPW_BUDDY = ${JSON.stringify({ voice: buddyMan.voice || '', clips: buddyMeta })};\n`;
const buddyCount = Object.keys(buddyMeta).length;

// Letter-card tap flow: audio/for/en/NN.mp3 ("is for turtle", English), audio/for/is-for.mp3 ("is for") and
// audio/means/<lang>/NN.mp3 ("which means house", he/el/th/es). NN = letter index; manifests map letter ch -> {file, text}.
// index.html loads them from ./audio/for|means/; the standalone embeds audio/for and streams audio/means.
const forMeta = { en: {} }, meansMeta = {}, forEmbed = {};
const b64 = (...p) => 'data:audio/mpeg;base64,' + readFileSync(join(root, 'audio', ...p)).toString('base64');
{
  const enLetters = readFileSync(join(root, 'src', 'data-en.js'), 'utf8');
  const m = JSON.parse(readFileSync(join(root, 'audio', 'for', 'en', 'manifest.json'), 'utf8'));
  for (const [k, v] of Object.entries(m)) {
    if (!/^[0-9]{2}\.mp3$/.test(v.file) || !existsSync(join(root, 'audio', 'for', 'en', v.file))) throw new Error(`Missing/bad clip audio/for/en/${v.file} for "${k}"`);
    if (!enLetters.includes(`ch: '${k}'`)) throw new Error(`audio/for/en key "${k}" is not an English letter`);
    forMeta.en[k] = { file: v.file, text: String(v.text || '') };
    forEmbed[k] = b64('for', 'en', v.file);
  }
  if (!existsSync(join(root, 'audio', 'for', 'is-for.mp3'))) throw new Error('Missing clip audio/for/is-for.mp3');
  forEmbed['is-for'] = b64('for', 'is-for.mp3');
  for (const l of NATIVE_LANGS) {
    const mm = JSON.parse(readFileSync(join(root, 'audio', 'means', l, 'manifest.json'), 'utf8'));
    meansMeta[l] = {};
    for (const [k, v] of Object.entries(mm)) {
      if (!/^[0-9]{2}\.mp3$/.test(v.file) || !existsSync(join(root, 'audio', 'means', l, v.file))) throw new Error(`Missing/bad clip audio/means/${l}/${v.file} for "${k}"`);
      meansMeta[l][k] = { file: v.file, text: String(v.text || '') };
    }
  }
}
const forPre = `window.LPW_FOR = ${JSON.stringify(forMeta)};\nwindow.LPW_MEANS = ${JSON.stringify(meansMeta)};\n`;
const meansCount = Object.values(meansMeta).reduce((n, m) => n + Object.keys(m).length, 0);

function page(clips, soundClips, buddyClips, forClips) {
  const pre = `window.LPW_NATIVE = ${nativeMap};\nwindow.LPW_CLIP_TEXT = ${textMap};\n${soundPre}${buddyPre}${forPre}window.LPW_SOUND_EMBED = ${soundClips};\nwindow.LPW_BUDDY_EMBED = ${buddyClips};\nwindow.LPW_FOR_EMBED = ${forClips};\nwindow.LPW_CLIPS = ${clips};\n`;
  if (/<\/script/i.test(pre) || /https?:\/\//i.test(pre)) throw new Error('Clip data would break inlining or references a URL');
  return src('shell.html')
    .replace('/*@@STYLE@@*/', () => css)
    .replace('/*@@SCRIPT@@*/', () => '"use strict";\n' + pre + js);
}

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB';
const web = page('null', 'null', 'null', 'null'), standalone = page(embedded, JSON.stringify(soundEmbed), JSON.stringify(buddyEmbed), JSON.stringify(forEmbed));
if (Buffer.byteLength(standalone) > 3.5 * 1024 * 1024) throw new Error('Standalone file exceeds 3.5 MB');
writeFileSync(join(root, 'index.html'), web);
writeFileSync(join(root, 'Little-Phonics-World.html'), standalone);
console.log(`Built index.html (${kb(web)}, clips from ./audio/en/) and Little-Phonics-World.html (${kb(standalone)}, ${keys.length} English clips + ${Object.keys(soundEmbed).length} English letter sounds + ${buddyCount} Buddy clips + ${Object.keys(forEmbed).length} "is for" clips embedded); ${nativeCount} native clips, ${soundCount} letter sounds, ${explainCount} English explanations, ${meansCount} "which means" clips mapped`);

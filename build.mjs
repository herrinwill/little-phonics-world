// Build: inline src/* into a single self-contained index.html + Little-Phonics-World.html (no deps).
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(root, 'src', f), 'utf8');

const css = ['style.css', 'style2.css'].map(src).join('\n');
const js = [
  'data-he.js', 'data-el.js', 'data-th.js', 'data-es.js',
  'art1.js', 'art2.js', 'art3.js', 'icons.js',
  'audio.js', 'core.js',
  'mode-letters.js', 'mode-builder.js', 'mode-bubbles.js', 'mode-stage.js',
  'app.js'
].map((f) => `/* ---- ${f} ---- */\n${src(f)}`).join('\n');

if (/<\/script/i.test(js)) throw new Error('JS contains </script> — would break inlining');
if (/https?:\/\//i.test(js.replace(/http:\/\/www\.w3\.org\/2000\/svg/g, ''))) throw new Error('JS references an external URL');

const html = src('shell.html')
  .replace('/*@@STYLE@@*/', () => css)
  .replace('/*@@SCRIPT@@*/', () => '"use strict";\n' + js);

writeFileSync(join(root, 'index.html'), html);
copyFileSync(join(root, 'index.html'), join(root, 'Little-Phonics-World.html'));
console.log(`Built index.html (${(html.length / 1024).toFixed(1)} KB) and Little-Phonics-World.html`);

/* Core: persistent store, stars, stickers, effects, small DOM helpers. */
(function () {
  var KEY = 'littlePhonicsWorld.v1';
  var MODES_LIST = ['letters', 'builder', 'bubbles', 'stage'];
  var NEED = { letters: 5, builder: 1, bubbles: 3, stage: 10 }; /* actions to unlock a sticker */
  var memory = null;

  function fresh() { return { stars: 0, lang: 'en', parent: false, prog: {}, stickers: {} }; }
  function load() {
    var s = null;
    try { var raw = window.localStorage && window.localStorage.getItem(KEY); if (raw) s = JSON.parse(raw); } catch (e) { s = null; }
    if (!s && memory) s = JSON.parse(memory);
    var f = fresh();
    if (!s || typeof s !== 'object') return f;
    Object.keys(f).forEach(function (k) { if (s[k] === undefined) s[k] = f[k]; });
    return s;
  }
  var ST = load();
  function save() {
    var raw = JSON.stringify(ST);
    memory = raw;
    try { if (window.localStorage) window.localStorage.setItem(KEY, raw); } catch (e) { /* private mode / file:// — keep in memory */ }
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'style') e.style.cssText = attrs[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function restart(node, cls) { if (!node) return; node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }

  var COLORS = ['#ff5a8a', '#ff9f1c', '#4d96ff', '#3ddc84', '#9b5de5', '#2ec4b6', '#ff5a5f', '#f7b801'];

  function confetti(n) {
    if (reduced()) return;
    var fx = document.getElementById('fx'); if (!fx) return;
    n = n || 60;
    for (var i = 0; i < n; i++) {
      var c = el('div', { class: 'confetti' });
      c.style.left = (Math.random() * 100) + 'vw';
      c.style.background = COLORS[i % COLORS.length];
      c.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      c.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
      c.style.animationDelay = (Math.random() * 0.4) + 's';
      if (i % 3 === 0) c.style.borderRadius = '50%';
      fx.appendChild(c);
      (function (c) { setTimeout(function () { c.remove(); }, 2600); })(c);
    }
  }
  function burst(x, y) {
    if (reduced()) return;
    var fx = document.getElementById('fx'); if (!fx) return;
    for (var i = 0; i < 14; i++) {
      var a = i / 14 * Math.PI * 2, b = el('div', { class: 'burst' });
      b.style.left = x + 'px'; b.style.top = y + 'px'; b.style.background = COLORS[i % COLORS.length];
      b.style.setProperty('--dx', Math.cos(a) * 80 + 'px'); b.style.setProperty('--dy', Math.sin(a) * 80 + 'px');
      fx.appendChild(b);
      (function (b) { setTimeout(function () { b.remove(); }, 800); })(b);
    }
  }
  function center(node) {
    if (!node || !node.getBoundingClientRect) return { x: innerWidth / 2, y: innerHeight / 2 };
    var r = node.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function renderStars() {
    var sc = document.getElementById('starCount');
    if (sc) { sc.innerHTML = ICON.star + '<span id="starNum">' + ST.stars + '</span>'; restart(sc, 'bump'); }
  }
  function addStar(fromNode, n) {
    n = n || 1;
    ST.stars += n; save();
    try { SFX.star(); } catch (e) { /* ignore */ }
    var fx = document.getElementById('fx'), sc = document.getElementById('starCount');
    if (fx && sc && !reduced()) {
      var a = center(fromNode), b = center(sc), s = el('div', { class: 'flystar' }, ICON.star);
      s.style.left = (a.x - 28) + 'px'; s.style.top = (a.y - 28) + 'px';
      s.style.setProperty('--tx', (b.x - a.x) + 'px'); s.style.setProperty('--ty', (b.y - a.y) + 'px');
      fx.appendChild(s);
      setTimeout(function () { s.remove(); renderStars(); }, 900);
    } else renderStars();
    renderStars();
  }

  /* Count an action for (lang, mode); unlock that sticker when the goal is reached. */
  function progress(mode, key) {
    var L = ST.lang, p = ST.prog[L] = ST.prog[L] || {};
    if (mode === 'letters') {
      p.letters = p.letters || [];
      if (p.letters.indexOf(key) < 0) p.letters.push(key);
      var count = p.letters.length;
    } else { p[mode] = (p[mode] || 0) + 1; count = p[mode]; }
    save();
    var id = L + '-' + mode;
    if (!ST.stickers[id] && count >= NEED[mode]) {
      ST.stickers[id] = Date.now(); save();
      setTimeout(function () { stickerToast(L, mode); }, 700);
      return true;
    }
    return false;
  }
  function stickerToast(L, mode) {
    var fx = document.getElementById('fx'); if (!fx) return;
    var t = el('div', { class: 'stk-toast', style: 'position:fixed;left:50%;top:50%;width:min(240px,60vw);transform:translate(-50%,-50%);animation:pop .6s cubic-bezier(.3,1.6,.5,1);filter:drop-shadow(0 12px 20px rgba(43,35,80,.3))' }, ICON.sticker(L, mode));
    fx.appendChild(t);
    try { SFX.win(); } catch (e) { /* ignore */ }
    confetti(90);
    setTimeout(function () { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; }, 1800);
    setTimeout(function () { t.remove(); }, 2300);
  }

  var CHEERS = ['Great job!', 'You did it!', 'Awesome!', 'Way to go!', 'Super!', 'Yay, you!'];
  function cheer(node) {
    var fx = document.getElementById('fx'); if (!fx) return;
    var c = center(node), t = el('div', { class: 'cheer', lang: 'en' }, esc(CHEERS[Math.floor(Math.random() * CHEERS.length)]));
    t.style.left = Math.max(90, Math.min(innerWidth - 90, c.x)) + 'px'; t.style.top = Math.max(60, c.y - 40) + 'px';
    fx.appendChild(t);
    setTimeout(function () { t.remove(); }, 1500);
    return 'cheer-' + slugify(t.textContent);
  }
  function slugify(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  window.LPWCore = {
    ST: ST, save: save, el: el, esc: esc, shuffle: shuffle, restart: restart, reduced: reduced,
    confetti: confetti, burst: burst, center: center, addStar: addStar, renderStars: renderStars,
    progress: progress, MODES_LIST: MODES_LIST, NEED: NEED, COLORS: COLORS,
    D: function () { return window.LPW_DATA[ST.lang] || window.LPW_DATA.en; },
    /* Always-visible English meaning caption for non-English words (empty in English). */
    mean: function (D, en, cls) {
      if (!en || !D || D.code === 'en') return '';
      return '<span class="mean' + (cls ? ' ' + cls : '') + '" lang="en" dir="ltr">' + esc(en) + '</span>';
    },
    cheer: cheer, CHEERS: CHEERS,
    /* English clip keys (ignored in other languages, which use the device voice). */
    wordKey: function (w) { return 'word-' + slugify(w); },
    later: function (fn, ms) { return window.CLIPS ? CLIPS.later(fn, ms) : setTimeout(fn, ms); },
    /* say a native word (+ transliteration fallback) in the current language */
    say: function (items, opts) { return SPEECH.say(ST.lang, items, opts); }
  };
  window.MODES = window.MODES || {};
})();

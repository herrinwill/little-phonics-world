/* App shell: top bar, language switcher, parent toggle, home screen, navigation, test hook. */
(function () {
  var C = window.LPWCore, ST = C.ST;
  var LANGS = ['en', 'he', 'el', 'th', 'es'];
  var screen = document.getElementById('screen');
  var mode = 'home';

  function renderLangbar() {
    var bar = document.getElementById('langbar');
    bar.innerHTML = '';
    LANGS.forEach(function (code) {
      var D = LPW_DATA[code];
      var b = C.el('button', {
        class: 'pill' + (ST.lang === code ? ' on' : ''), 'data-lang': code, style: '--c:' + D.color,
        'aria-label': D.en + ' — ' + D.name, 'aria-pressed': String(ST.lang === code), title: D.en
      }, '<span class="glyph' + (D.glyph.length > 1 ? ' two' : '') + '" style="background:' + D.color + '" lang="' + code + '"' + (D.dir === 'rtl' ? ' dir="rtl"' : '') + '>' + D.glyph + '</span>' +
        '<span class="nm" lang="' + code + '"' + (D.dir === 'rtl' ? ' dir="rtl"' : '') + '>' + D.name + '</span>');
      b.addEventListener('click', function () { setLang(code, true); });
      bar.appendChild(b);
    });
  }

  function setLang(code, greet) {
    if (!LPW_DATA[code]) return false;
    ST.lang = code; C.save();
    document.documentElement.setAttribute('data-lang', code);
    renderLangbar();
    go(mode === 'stickers' ? 'stickers' : mode);
    if (greet) {
      try { SFX.chime(); } catch (e) { /* ignore */ }
      var D = LPW_DATA[code];
      C.say([{ text: D.hello, tr: D.helloTr }], { quiet: true, clip: 'hello' });
    }
    return true;
  }

  function setParent(on) {
    ST.parent = !!on; C.save();
    document.body.classList.toggle('parent-on', ST.parent);
    document.getElementById('parentBtn').setAttribute('aria-pressed', String(ST.parent));
  }

  function renderHome(root) {
    var D = C.D();
    root.innerHTML =
      '<div class="hello"><div class="big" lang="' + D.code + '" dir="' + D.dir + '">' + C.esc(D.hello) + '</div>' +
      (D.code === 'en' ? '<div class="sub" lang="en">Let\'s play with letters and sounds!</div>' : C.mean(D, 'Hello!', 'block')) +
      '<div class="ptxt parent" style="display:inline-block">' + (D.code === 'en' ? 'Welcome! ' : C.esc(D.helloTr) + ' = “hello” in ' + D.en + '. ') +
      'Pick a game — every button is a picture, no reading needed.</div></div>';
    var grid = C.el('div', { class: 'home-grid' });
    [['letters', 'm-letters'], ['builder', 'm-builder'], ['bubbles', 'm-bubbles'], ['stage', 'm-stage']].forEach(function (m) {
      var b = C.el('button', { class: 'mode-btn ' + m[1], 'data-mode': m[0], 'aria-label': MODES[m[0]].title },
        ICON.modeIcon[m[0]] + '<span class="lbl">' + MODES[m[0]].title + '</span>');
      b.addEventListener('click', function () { try { SFX.tap(); } catch (e) { /* ignore */ } go(m[0]); });
      grid.appendChild(b);
    });
    root.appendChild(grid);
    var sb = C.el('button', { class: 'sticker-btn', 'data-mode': 'stickers', 'aria-label': 'Sticker Book' }, ICON.book + '<span>Sticker Book</span>' + ICON.jar(ST.stars).replace('<svg', '<svg style="width:46px;height:74px"'));
    sb.addEventListener('click', function () { try { SFX.tap(); } catch (e) { /* ignore */ } go('stickers'); });
    root.appendChild(sb);
  }

  function go(name) {
    if (name !== 'home' && !MODES[name]) name = 'home';
    var prev = mode;
    mode = name;
    try { SPEECH.stop(); } catch (e) { /* ignore */ }
    screen.innerHTML = '';
    screen.setAttribute('data-mode', name);
    try {
      if (name === 'home') renderHome(screen);
      else MODES[name].render(screen, C.D());
    } catch (e) {
      screen.innerHTML = '';
      if (window.console) console.warn('render failed', e);
      renderHome(screen); mode = 'home';
    }
    window.scrollTo(0, 0);
    try { if (window.BUDDY) BUDDY.nav(mode, prev); } catch (e) { /* ignore */ }
    return mode;
  }

  /* Boot */
  document.getElementById('homeBtn').innerHTML = ICON.home;
  document.getElementById('homeBtn').addEventListener('click', function () { try { SFX.tap(); } catch (e) { /* ignore */ } go('home'); });
  document.getElementById('parentBtn').innerHTML = ICON.parent;
  document.getElementById('parentBtn').addEventListener('click', function () { setParent(!ST.parent); try { SFX.tap(); } catch (e) { /* ignore */ } });
  if (typeof ST.lang !== 'string' || !LPW_DATA[ST.lang]) { ST.lang = 'en'; C.save(); }
  setParent(ST.parent);
  C.renderStars();
  try { if (window.BUDDY) BUDDY.init(); } catch (e) { if (window.console) console.warn('buddy failed', e); }
  renderLangbar();
  document.documentElement.setAttribute('data-lang', ST.lang);
  go('home');

  window.LPWApp = { go: go, setLang: setLang };
  /* Small, harmless hook for automated tests. */
  window.LPW = {
    setLang: function (c) { return setLang(c, false); },
    goMode: go,
    setParent: setParent,
    buddy: function () { return window.BUDDY ? BUDDY.state() : null; },
    setBuddy: function (v) { return window.BUDDY ? BUDDY.setOn(v) : false; },
    state: function () {
      return { lang: ST.lang, mode: mode, stars: ST.stars, parent: ST.parent, buddy: ST.buddy !== false, stickers: Object.keys(ST.stickers),
        voice: SPEECH.voiceName(ST.lang) || null };
    },
    audioState: function () { return window.CLIPS ? CLIPS.state() : { playing: false, key: null }; },
    langs: LANGS.slice(),
    modes: ['home', 'letters', 'builder', 'bubbles', 'stage', 'stickers']
  };
})();

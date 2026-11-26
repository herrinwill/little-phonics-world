/* Natural pre-recorded voice clips with strict overlap cancellation (one shared Audio element).
   English: window.LPW_CLIP_TEXT = {key: spoken text}; window.LPW_CLIPS = null (load ./audio/en/<key>.mp3)
            or {key: 'data:audio/mpeg;base64,...'} (standalone file).
   Hebrew / Greek / Thai / Spanish: window.LPW_NATIVE = {lang: {"exact spoken text": "NNN.mp3"}} (always embedded);
            the MP3s load from ./audio/<lang>/ over http(s), or from the game's website when opened from file://. */
(function () {
  var TEXT = window.LPW_CLIP_TEXT || {};
  var EMBED = window.LPW_CLIPS || null;
  var NATIVE = window.LPW_NATIVE || {};
  var SITE = 'https://herrinwill.github.io/little-phonics-world/audio/';
  var proto = (window.location && window.location.protocol) || '';
  var REMOTE = !/^https?:$/.test(proto);
  var BASE = REMOTE ? SITE : './audio/';
  var remoteDown = false; /* offline file:// copy: after one failed remote clip, go straight to the fallback */
  try { window.addEventListener('online', function () { remoteDown = false; }); } catch (e) { /* ignore */ }
  var audio = null, token = 0, cur = null, timers = [], log = [], missing = [];

  function has(key) { return !!key && Object.prototype.hasOwnProperty.call(TEXT, key) && (!EMBED || !!EMBED[key]); }
  function src(key) { return EMBED ? EMBED[key] : './audio/en/' + key + '.mp3'; }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  /* Native clip file for an exact spoken text (also tries NFC-normalized text), or null. */
  function nativeFile(lang, text) {
    var m = NATIVE[lang]; if (!m || text == null) return null;
    var t = String(text), own = Object.prototype.hasOwnProperty;
    if (own.call(m, t)) return m[t];
    try { var n = t.normalize('NFC'); if (own.call(m, n)) return m[n]; } catch (e) { /* ignore */ }
    return null;
  }
  /* {key, src, lang, text} entry for a native clip, or null when it has no clip / the site is unreachable. */
  function native(lang, text) {
    /* Offline (or the site already failed once): no request at all, so nothing is logged; fall back at once. */
    if (REMOTE && (remoteDown || (window.navigator && navigator.onLine === false))) return null;
    var f = nativeFile(lang, text);
    return f ? { key: lang + '/' + f, src: BASE + lang + '/' + f, lang: lang, text: String(text) } : null;
  }

  /* Letter SOUND clips (window.LPW_SOUND = {lang: {key: {file, ipa}}}) and English explanation clips
     (window.LPW_EXPLAIN = {lang: {key: {file, text}}}). English sounds are embedded in the standalone
     (window.LPW_SOUND_EMBED = {key: data URI}); everything else loads from BASE + 'sound|explain/<lang>/NN.mp3'.
     A key missing from window.LPW_APPROVED[lang] has no sound clip: callers fall back to the English explanation. */
  var SOUND = window.LPW_SOUND || {}, EXPLAIN = window.LPW_EXPLAIN || {}, APPROVED = window.LPW_APPROVED || {};
  var SEMBED = window.LPW_SOUND_EMBED || null;
  function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
  function approved(lang, key) { return Array.isArray(APPROVED[lang]) && APPROVED[lang].indexOf(key) >= 0; }
  function soundMeta(lang, key) { return own(SOUND[lang], key) ? SOUND[lang][key] : null; }
  function explainMeta(lang, key) { return own(EXPLAIN[lang], key) ? EXPLAIN[lang][key] : null; }
  function remoteBlocked() { return REMOTE && (remoteDown || (window.navigator && navigator.onLine === false)); }
  /* {key, src, lang} for the letter sound clip, or null (not approved / no clip / site unreachable). */
  function sound(lang, key) {
    var m = soundMeta(lang, key);
    if (!m || !approved(lang, key)) return null;
    var k = 'sound/' + lang + '/' + m.file;
    if (lang === 'en' && SEMBED) return own(SEMBED, key) ? { key: k, src: SEMBED[key], lang: 'en', text: key } : null;
    if (lang === 'en' && !REMOTE) return { key: k, src: './audio/' + k, lang: 'en', text: key };
    if (remoteBlocked()) return null;
    return { key: k, src: BASE + k, lang: lang === 'en' ? 'en-remote' : lang, text: key };
  }
  /* {key, src, lang, text} for the English explanation of a non-English letter, or null. */
  function explain(lang, key) {
    var m = explainMeta(lang, key);
    if (!m || remoteBlocked()) return null;
    var k = 'explain/' + lang + '/' + m.file;
    return { key: k, src: BASE + k, lang: lang, text: m.text };
  }

  function el() {
    if (audio) return audio;
    try { audio = new Audio(); } catch (e) { audio = null; return null; }
    audio.preload = 'auto';
    return audio;
  }

  /* Stop everything: current clip, queued clips, pending delayed speech, and Web Speech. */
  function stopAll() {
    token++;
    timers.forEach(clearTimeout); timers = [];
    cur = null;
    if (audio) {
      try { audio.pause(); } catch (e) { /* ignore */ }
      try { audio.currentTime = 0; } catch (e) { /* ignore */ }
    }
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }

  /* Run fn after ms unless something else starts or the screen changes first. */
  function later(fn, ms) {
    var t = setTimeout(function () { timers = timers.filter(function (x) { return x !== t; }); fn(); }, ms);
    timers.push(t);
    return t;
  }

  /* Play entries [{key, src, lang}] in order through the shared element.
     onFail(i) if entry i cannot play (error / rejected); onDone() after the last one ends. Errors are handled quietly. */
  function run(entries, onFail, onDone) {
    stopAll();
    var my = token, a = el();
    if (!a) { if (onFail) onFail(0); return false; }
    var i = 0, failed = false;
    function fail() {
      if (my !== token || failed) return;
      failed = true; cur = null;
      if (REMOTE && entries[i] && entries[i].lang !== 'en') remoteDown = true;
      try { a.pause(); } catch (e) { /* ignore */ }
      if (onFail) onFail(i);
    }
    function step() {
      if (my !== token) return;
      if (i >= entries.length) { cur = null; if (onDone) onDone(); return; }
      var e = entries[i];
      if (e.pause && !e.paused) { e.paused = true; later(function () { if (my === token) step(); }, e.pause); return; }
      cur = e; log.push(e.key); if (log.length > 300) log.shift();
      a.onended = function () { if (my !== token) return; i++; step(); };
      a.onerror = function () { fail(); };
      try {
        a.src = e.src;
        var p = a.play();
        if (p && p.catch) p.catch(function (err) {
          if (my !== token) return; /* interrupted by a newer clip: silent */
          var n = err && err.name;
          if (n === 'AbortError') return;
          if (n === 'NotAllowedError') { cur = null; return; } /* autoplay blocked: stay silent */
          fail();
        });
      } catch (x) { fail(); }
    }
    step();
    return true;
  }

  /* English: play keys in order. onFail(remainingKeys) if a clip is missing or cannot play. */
  function play(keys, onFail) {
    if (!Array.isArray(keys)) keys = [keys];
    var bad = keys.filter(function (k) { return !has(k); });
    bad.forEach(function (k) { if (missing.indexOf(k) < 0) missing.push(k); });
    if (bad.length || !el()) { stopAll(); if (onFail) onFail(keys); return false; }
    return run(keys.map(function (k) { return { key: k, src: src(k), lang: 'en' }; }), function (i) { if (onFail) onFail(keys.slice(i)); });
  }

  window.CLIPS = {
    has: has, src: src, text: function (k) { return TEXT[k] || ''; }, slug: slug, embedded: !!EMBED,
    play: play, run: run, stop: stopAll, later: later,
    native: native, nativeFile: nativeFile,
    sound: sound, explain: explain, approved: approved, soundMeta: soundMeta, explainMeta: explainMeta, nativeBase: function () { return BASE; }, remote: REMOTE,
    nativeLangs: function () { return Object.keys(NATIVE); },
    state: function () {
      return { playing: !!(audio && cur && !audio.paused && !audio.ended), key: cur ? cur.key : null,
        lang: cur ? cur.lang : null, text: cur ? (cur.text || TEXT[cur.key] || '') : null };
    },
    log: function () { return log.slice(); },
    missing: function () { return missing.slice(); },
    keys: function () { return Object.keys(TEXT); },
    element: function () { return el(); }
  };
})();

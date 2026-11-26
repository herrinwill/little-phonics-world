/* Sound effects (Web Audio synth) + speech (Web Speech API) with a no-voice fallback badge. */
(function () {
  var ctx = null, master = null, muted = false;
  function ensure() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume().catch(function () {});
      return ctx;
    } catch (e) { return null; }
  }
  /* AudioContext only starts on a user gesture. */
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { ensure(); }, { capture: true, passive: true });
  });

  function tone(freq, dur, type, vol, when, slideTo) {
    try {
      var c = ctx; if (!c || muted || c.state !== 'running') return;
      var t = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* ignore */ }
  }
  var SCALE = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51];
  var S = window.SFX = {
    ensure: ensure,
    xylo: function (i) { var f = SCALE[i % SCALE.length]; tone(f, 0.9, 'sine', 0.35); tone(f * 4, 0.25, 'sine', 0.06); tone(f * 2.76, 0.4, 'triangle', 0.05); },
    chime: function () { [0, 4, 7, 12].forEach(function (s, i) { tone(1046.5 * Math.pow(2, s / 12), 0.5, 'sine', 0.18, i * 0.07); }); },
    pop: function () { tone(900, 0.12, 'sine', 0.35, 0, 180); tone(1600, 0.05, 'triangle', 0.12); },
    star: function () { [0, 7, 12, 19].forEach(function (s, i) { tone(1318 * Math.pow(2, s / 12), 0.25, 'triangle', 0.1, i * 0.05); }); },
    giggle: function () { [0, 1, 2, 3, 4].forEach(function (i) { tone(620 + (i % 2) * 180 + i * 40, 0.09, 'square', 0.05, i * 0.085, 540 + i * 30); }); },
    boing: function () { tone(220, 0.35, 'sine', 0.3, 0, 520); tone(330, 0.2, 'triangle', 0.08, 0.05, 160); },
    tap: function () { tone(740, 0.08, 'triangle', 0.15); },
    win: function () { [0, 4, 7, 12, 7, 12, 16].forEach(function (s, i) { tone(523.25 * Math.pow(2, s / 12), 0.3, i < 4 ? 'triangle' : 'sine', 0.2, i * 0.11); }); },
    animal: function () { tone(330, 0.25, 'sawtooth', 0.06, 0, 440); tone(440, 0.3, 'triangle', 0.12, 0.2, 300); },
    mute: function (m) { muted = !!m; }
  };

  /* ---------------- Speech ---------------- */
  var voices = [];
  function loadVoices() {
    try { if (window.speechSynthesis) voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
  }
  try {
    if (window.speechSynthesis) {
      loadVoices();
      if (window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      else window.speechSynthesis.onvoiceschanged = loadVoices;
      setTimeout(loadVoices, 600); setTimeout(loadVoices, 2000);
    }
  } catch (e) { /* ignore */ }

  var PREFER = { he: ['he-IL', 'iw-IL'], el: ['el-GR'], th: ['th-TH'], es: ['es-ES', 'es-MX', 'es-US'] };
  function norm(l) { return String(l || '').replace('_', '-').toLowerCase(); }
  function findVoice(code) {
    if (!voices.length) loadVoices();
    var D = (window.LPW_DATA || {})[code]; if (!D) return null;
    var prefs = (PREFER[code] || []).map(norm), i, v;
    for (i = 0; i < prefs.length; i++) {
      for (var j = 0; j < voices.length; j++) if (norm(voices[j].lang) === prefs[i]) return voices[j];
    }
    for (i = 0; i < voices.length; i++) {
      v = norm(voices[i].lang);
      for (var k = 0; k < D.speech.length; k++) if (v === D.speech[k] || v.indexOf(D.speech[k] + '-') === 0) return voices[i];
    }
    return null;
  }

  var badgeTimer = null;
  function showBadge(native, tr, dir) {
    try {
      var b = document.getElementById('badge'); if (!b) return;
      b.innerHTML = (window.ICON ? ICON.badgeStar : '') + '<div class="bw"><span>' + esc(tr || native) + '</span>' +
        (tr && native ? '<small dir="' + (dir || 'ltr') + '">' + esc(native) + '</small>' : '') + '</div>';
      b.classList.add('show'); b.setAttribute('data-shown', '1');
      clearTimeout(badgeTimer);
      badgeTimer = setTimeout(function () { b.classList.remove('show'); }, 2400);
    } catch (e) { /* ignore */ }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var Speech = window.SPEECH = {
    hasVoice: function (code) { return !!findVoice(code); },
    voiceName: function (code) { var v = findVoice(code); return v ? v.name + ' (' + v.lang + ')' : ''; },
    /* items: [{text, tr}] spoken in order in language `code`. Never uses a wrong-language voice. */
    say: function (code, items, opts) {
      opts = opts || {};
      if (!Array.isArray(items)) items = [items];
      var D = (window.LPW_DATA || {})[code] || {};
      var v = findVoice(code);
      var trs = items.map(function (it) { return it.tr || it.text; }).join(' · ');
      var natives = items.map(function (it) { return it.text; }).join(' · ');
      if (!v || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        if (!opts.quiet) S.chime();
        showBadge(natives, trs, D.dir);
        return false;
      }
      try {
        var ss = window.speechSynthesis;
        if (!opts.queue) ss.cancel();
        items.forEach(function (it) {
          var u = new SpeechSynthesisUtterance(it.text);
          u.voice = v; u.lang = v.lang; u.rate = opts.rate || 0.8; u.pitch = 1.1; u.volume = 1;
          ss.speak(u);
        });
        if (document.body.classList.contains('parent-on')) showBadge(natives, trs, D.dir);
        return true;
      } catch (e) {
        showBadge(natives, trs, D.dir);
        return false;
      }
    },
    badge: showBadge
  };
})();

/* Phonics Buddy "Hoot": a friendly owl in the bottom-left corner who cheers, encourages and giggles (English only).
   Clips: window.LPW_BUDDY = {voice, clips: {key: {file, text, group}}};
          window.LPW_BUDDY_EMBED = null (load ./audio/buddy/<file>) or {key: data URI} (standalone file).
   Speech goes through the one shared CLIPS player, and only when it is idle, so a Buddy line never cuts off or overlaps
   a learning clip. Any new learning clip (letter sound / name / word / explain) cancels the Buddy at once. */
(function () {
  var C = window.LPWCore, ST = C.ST;
  var DATA = (window.LPW_BUDDY && window.LPW_BUDDY.clips) || {};
  var EMBED = window.LPW_BUDDY_EMBED || null;

  /* ---- the owl (inline SVG, round and bright) ---- */
  var OWL =
    '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<ellipse cx="60" cy="112" rx="30" ry="5" fill="rgba(43,35,80,.16)"/>' +
    '<g class="b-body">' +
    '<path d="M30 30 L38 6 L50 24 Z" fill="#6a4cf0"/><path d="M90 30 L82 6 L70 24 Z" fill="#6a4cf0"/>' +
    '<ellipse cx="60" cy="64" rx="40" ry="44" fill="#8b6cff"/>' +
    '<ellipse cx="60" cy="80" rx="25" ry="26" fill="#ffe9a8"/>' +
    '<path d="M50 74q4 4 8 0M62 74q4 4 8 0M54 86q4 4 8 0M46 86q2 3 4 1M68 87q2 2 4-1" stroke="#ffc94d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<g class="b-wing-l"><ellipse cx="22" cy="70" rx="10" ry="22" fill="#6a4cf0" transform="rotate(14 22 70)"/></g>' +
    '<g class="b-wing-r"><ellipse cx="98" cy="70" rx="10" ry="22" fill="#6a4cf0" transform="rotate(-14 98 70)"/></g>' +
    '<circle cx="42" cy="48" r="18" fill="#fff"/><circle cx="78" cy="48" r="18" fill="#fff"/>' +
    '<circle cx="42" cy="48" r="18" fill="none" stroke="#ff9fd0" stroke-width="4"/><circle cx="78" cy="48" r="18" fill="none" stroke="#5ad1ff" stroke-width="4"/>' +
    '<g class="b-eyes"><circle cx="44" cy="50" r="9" fill="#2b2350"/><circle cx="76" cy="50" r="9" fill="#2b2350"/>' +
    '<circle cx="47" cy="46" r="3.4" fill="#fff"/><circle cx="79" cy="46" r="3.4" fill="#fff"/></g>' +
    '<circle cx="28" cy="64" r="5" fill="#ff8fc7" opacity=".7"/><circle cx="92" cy="64" r="5" fill="#ff8fc7" opacity=".7"/>' +
    '<path class="b-beak" d="M53 60 L67 60 L60 71 Z" fill="#ff9f1c" stroke="#ff7a1c" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M46 106q4-6 8 0M66 106q4-6 8 0" stroke="#ff9f1c" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '</g></svg>';

  /* ---- state ---- */
  var btn = null, bubble = null, hideT = null, animT = null;
  var pend = null, navN = 0, lastKey = null, lastSpeak = 0, lastCheer = -1e9, lastRetry = -1e9, lastWelcome = -1e9;
  var started = false, welcomedModes = {}, fails = 0, lastSrc = '', lastText = '';
  var CHEER_GAP = 8000, RETRY_GAP = 10000, WELCOME_GAP = 30000;

  function now() { return Date.now(); }
  function on() { return ST.buddy !== false; }
  function keysOf(group) { return Object.keys(DATA).filter(function (k) { return DATA[k].group === group; }); }
  /* Random line from a group, never the same line twice in a row. */
  function pick(group) {
    var ks = keysOf(group);
    if (ks.length > 1) ks = ks.filter(function (k) { return k !== lastKey; });
    return ks.length ? ks[Math.floor(Math.random() * ks.length)] : null;
  }
  function src(key) {
    var d = DATA[key]; if (!d) return '';
    if (EMBED) return EMBED[key] || '';
    return './audio/buddy/' + d.file;
  }

  /* ---- look & feel ---- */
  function anim(cls, ms) {
    if (!btn) return;
    ['dance', 'tilt', 'spin', 'wave'].forEach(function (c) { btn.classList.remove(c); });
    void btn.offsetWidth;
    btn.classList.add(cls);
    clearTimeout(animT);
    animT = setTimeout(function () { btn.classList.remove(cls); }, ms || 1100);
  }
  function showBubble(text, ms) {
    if (!bubble) return;
    lastText = text;
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(hideT);
    hideT = setTimeout(hideBubble, ms || 2600);
  }
  function hideBubble() { if (bubble) bubble.classList.remove('show'); if (btn) btn.classList.remove('talk'); }
  function middle() { var r = btn.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.4 }; }
  function burst(big) {
    if (!btn || C.reduced()) return;
    var c = middle();
    C.sparkle(c.x, c.y, big ? 12 : 7);
    if (big) C.burst(c.x, c.y);
  }

  /* ---- speech: queued until the shared player is idle; learning clips always win ---- */
  /* o.maxRuns: how many learning sequences may still start before this line (e.g. the tile's own letter sound);
     one more than that means the child moved on, so the line is dropped. o.maxWait: give up after this many ms. */
  function request(key, o) {
    o = o || {};
    if (!on() || !key || !DATA[key] || !window.CLIPS) return false;
    cancel();
    pend = { key: key, group: DATA[key].group, runs0: CLIPS.runs(), maxRuns: o.maxRuns || 0, t0: now(),
      maxWait: o.maxWait || 7000, idle: 0, need: o.need || 2, nav: navN, timer: null };
    tick();
    return true;
  }
  function cancel() { if (pend) { clearTimeout(pend.timer); pend = null; } }
  function tick() {
    var p = pend; if (!p) return;
    if (!on() || p.nav !== navN || CLIPS.runs() - p.runs0 > p.maxRuns || now() - p.t0 > p.maxWait) { pend = null; return; }
    if (CLIPS.busy()) p.idle = 0; else p.idle++;
    if (p.idle >= p.need) { pend = null; speak(p.key); return; }
    p.timer = setTimeout(tick, 150);
  }
  function speak(key) {
    var d = DATA[key];
    lastKey = key; lastSpeak = now();
    if (btn) btn.classList.add('talk');
    showBubble(d.text, 2600);
    var s = src(key);
    lastSrc = s;
    /* No clip (or it cannot load): the bubble text alone carries the message. Never Web Speech for the Buddy. */
    if (!s) { fails++; return; }
    var ok = CLIPS.run([{ key: 'buddy/' + key, src: s, lang: 'en', buddy: true, text: d.text }],
      function () { fails++; },
      function () { if (btn) btn.classList.remove('talk'); });
    if (!ok) fails++;
  }

  /* ---- behaviours ---- */
  function welcome(o) {
    if (!on()) return;
    anim('wave', 1400);
    if (now() - lastWelcome < WELCOME_GAP) return;
    lastWelcome = now();
    request(pick('welcome'), { maxRuns: (o && o.maxRuns) || 1, maxWait: 9000 });
  }
  /* Big win: dance + sparkles; speaks at most once every ~8 s (bubble pops are frequent). */
  function cheer(o) {
    if (!on()) return;
    o = o || {};
    anim('dance', 1000);
    burst(o.big !== false);
    if (now() - lastCheer < CHEER_GAP) return;
    lastCheer = now();
    request(pick('cheer'), { maxRuns: o.maxRuns == null ? 1 : o.maxRuns, maxWait: o.maxWait || 9000 });
  }
  /* Gentle "hmm, try again": head tilt; speaks at most once every ~10 s, and only after the tile's own sound. */
  function retry(o) {
    if (!on()) return;
    o = o || {};
    anim('tilt', 1100);
    if (o.quiet || now() - lastRetry < RETRY_GAP) return;
    lastRetry = now();
    request(pick('retry'), { maxRuns: o.maxRuns == null ? 2 : o.maxRuns, maxWait: o.maxWait || 6000 });
  }
  function sticker(key) {
    if (!on()) return;
    anim('dance', 1000);
    burst(true);
    if (!C.reduced()) C.confetti(30);
    request(key && DATA[key] ? key : pick('sticker'), { maxRuns: 1, maxWait: 8000 });
  }
  function tapped() {
    started = true;
    try { SFX.giggle(); } catch (e) { /* ignore */ }
    anim('spin', 900);
    burst(false);
    request(pick('tap'), { maxRuns: 0, maxWait: 5000, need: 1 });
  }
  /* Called by the app on every screen change: drops stale lines; entering a mode may say a welcome line. */
  function nav(mode, prev) {
    navN++;
    if (pend && pend.group === 'welcome') { pend.nav = navN; pend.runs0 = CLIPS.runs(); pend.maxRuns = 1; pend.t0 = now(); }
    else cancel();
    if (!btn) return;
    btn.setAttribute('data-mode', mode);
    if (mode === 'home' || mode === prev || !started) return;
    if (welcomedModes[mode]) { anim('wave', 1400); return; }
    welcomedModes[mode] = 1;
    welcome({ maxRuns: 1 });
  }

  /* ---- on / off (Parent Info toggle, saved in settings) ---- */
  function setOn(v) {
    ST.buddy = !!v; C.save();
    document.body.classList.toggle('buddy-off', !ST.buddy);
    if (!ST.buddy) {
      cancel(); hideBubble();
      if (window.CLIPS && CLIPS.buddyPlaying()) CLIPS.stop();
    }
    var t = document.getElementById('buddyToggle');
    if (t) {
      t.setAttribute('aria-pressed', String(ST.buddy));
      t.querySelector('b').textContent = ST.buddy ? 'On' : 'Off';
    }
    return ST.buddy;
  }

  function init() {
    btn = C.el('button', { id: 'buddy', class: 'buddy', type: 'button', 'aria-label': 'Phonics Buddy', title: 'Hoot, your Phonics Buddy' },
      '<span class="bwrap">' + OWL + '</span>');
    bubble = C.el('div', { id: 'buddyBubble', class: 'buddy-bubble', lang: 'en', dir: 'ltr', role: 'status', 'aria-live': 'polite' });
    document.body.appendChild(bubble);
    document.body.appendChild(btn);
    btn.addEventListener('click', function (e) { e.stopPropagation(); tapped(); });
    var t = document.getElementById('buddyToggle');
    if (t) t.addEventListener('click', function () { setOn(!ST.buddy); try { SFX.tap(); } catch (e) { /* ignore */ } });
    setOn(ST.buddy !== false);
    /* Browsers only allow sound after a user gesture: the first tap anywhere (except on Hoot) says hello. */
    var first = function (e) {
      window.removeEventListener('pointerdown', first, true);
      window.removeEventListener('keydown', first, true);
      if (started || (btn && e && e.target && btn.contains(e.target))) { started = true; return; }
      started = true;
      welcome({ maxRuns: 1 });
    };
    window.addEventListener('pointerdown', first, true);
    window.addEventListener('keydown', first, true);
  }

  window.BUDDY = {
    init: init, nav: nav, setOn: setOn, on: on,
    welcome: welcome, cheer: cheer, retry: retry, sticker: sticker, tap: tapped,
    busy: function () { return !!pend || !!(window.CLIPS && CLIPS.buddyPlaying()); },
    clips: function () { return DATA; }, src: src,
    /* test hook */
    state: function () {
      var r = btn ? btn.getBoundingClientRect() : null;
      return { on: on(), started: started, pending: pend ? pend.key : null, lastKey: lastKey, lastSrc: String(lastSrc).slice(0, 40),
        bubble: !!(bubble && bubble.classList.contains('show')), text: lastText, fails: fails,
        anim: btn ? ['dance', 'tilt', 'spin', 'wave'].filter(function (c) { return btn.classList.contains(c); }) : [],
        box: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null };
    },
    resetLimits: function () { lastCheer = lastRetry = lastWelcome = -1e9; welcomedModes = {}; }
  };
})();

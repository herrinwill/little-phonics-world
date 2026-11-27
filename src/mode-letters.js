/* Mode 1 — Letter & Sound Factory: tap a letter-character, it dances, says its NAME, its SOUND, then "is for <word>"
   (non-English: "is for" + native word + "which means <English>"),
   and its picture pops. The spotlight has big separate Sound / Name / Word buttons (+ Explain in English). */
(function () {
  var C = window.LPWCore;
  function la(D) { return 'lang="' + D.code + '" dir="' + D.dir + '"'; }
  window.LPWla = la;

  /* Key of a letter in audio/sound/<lang>/manifest.json (English: lowercase a–z; others: ch exactly as in the data). */
  function soundKey(D, L) { return D.code === 'en' ? String(L.ch).charAt(0).toLowerCase() : L.ch; }
  function enName(D, L) {
    var ex = window.CLIPS && CLIPS.explainMeta(D.code, L.ch), m = ex && /^This letter is ([^.]+)\./.exec(ex.text);
    return m ? m[1] : L.nameTr;
  }
  /* Plain-English "sounds like" hint, from the coordinator-checked explanation text when there is one. */
  function soundsLike(D, L) {
    var ex = window.CLIPS && CLIPS.explainMeta(D.code, L.ch);
    var mid = ex ? ex.text.replace(/^This letter is [^.]+\.\s*/, '').replace(/\s*The picture word means[\s\S]*$/, '') : '';
    var m = /^It makes the sound at the start of ([A-Za-z]+)\.$/.exec(mid);
    if (m) return 'sounds like “' + L.snd.split(' ')[0] + '” in ' + m[1];
    return mid || 'sounds like “' + L.snd + '”';
  }
  function explainText(D, L) {
    var ex = window.CLIPS && CLIPS.explainMeta(D.code, L.ch);
    return ex ? ex.text : 'This letter is ' + enName(D, L) + '. It ' + soundsLike(D, L) + '. The picture word means ' + L.en + '.';
  }
  window.LPWLetters = { soundKey: soundKey, soundsLike: soundsLike, explainText: explainText, enName: enName };

  MODES.letters = {
    title: 'Letter & Sound Factory',
    render: function (root, D) {
      root.innerHTML = '<div class="screen-title"><span class="ico">' + ICON.mLetters + '</span><h1>' + this.title + '</h1></div>';
      var wrap = C.el('div', { class: 'factory' });
      var grid = C.el('div', { class: 'letter-grid', id: 'letterGrid' });
      var spot = C.el('div', { class: 'spot', id: 'spot', style: '--c:' + D.color });
      spot.innerHTML = '<div class="hint">' + ICON.mLetters + '</div>' +
        '<div class="bigch" ' + la(D) + '>' + C.esc(D.letters[0].ch) + '</div>' +
        '<div class="instr" lang="en" dir="ltr">Tap a letter to hear its sound!</div>' +
        '<div class="ptxt parent">Tap any letter friend: it says its name, then its sound, then a word that starts with that sound' +
        (D.code === 'en' ? ' (“B … /b/ … is for bear”). ' : ', then what the word means in English. ') +
        'Then use the big Sound, Name and Word buttons' + (D.code === 'en' ? '' : ' (and Explain in English)') + '.</div>';
      var seen = ((C.ST.prog[D.code] || {}).letters) || [];
      D.letters.forEach(function (L, i) {
        var col = C.COLORS[i % C.COLORS.length];
        var b = C.el('button', {
          class: 'lcard' + (seen.indexOf(L.ch) >= 0 ? ' seen' : ''), style: '--c:' + col, 'data-i': i,
          'aria-label': L.nameTr + ' — ' + L.en
        });
        b.innerHTML = (i % 3 === 1 ? '<span class="horn l"></span><span class="horn r"></span>' : '') +
          '<span class="face"><span class="eye"></span><span class="mouth"></span><span class="eye"></span></span>' +
          '<span class="ch" ' + la(D) + '>' + C.esc(L.ch) + '</span>';
        b.addEventListener('click', function () { tapLetter(b, L, D, col); });
        grid.appendChild(b);
      });
      wrap.appendChild(grid); wrap.appendChild(spot);
      root.appendChild(wrap);
    }
  };

  /* ---- clip entries for one letter (null = no clip / cannot play here) ---- */
  function enClip(k) { return window.CLIPS && CLIPS.has(k) ? { key: k, src: CLIPS.src(k), lang: 'en' } : null; }
  function soundEntry(D, L) { return window.CLIPS ? CLIPS.sound(D.code, soundKey(D, L)) : null; }
  function wordEntry(D, L) { return D.code === 'en' ? enClip(C.wordKey(L.word)) : (window.CLIPS ? CLIPS.native(D.code, L.word) : null); }
  function copy(e, pause) { var o = {}; for (var k in e) o[k] = e[k]; if (pause) o.pause = pause; return o; }
  function badge(D, L, tr) {
    if (D.code === 'en' && !document.body.classList.contains('parent-on')) return;
    try { SPEECH.badge(L.ch + ' · ' + L.word, tr, D.dir); } catch (e) { /* ignore */ }
  }

  /* Old behaviour (name + word, with device-voice / sound-out fallbacks): used when a sound clip is unavailable. */
  function sayNameWord(D, L) {
    var items = [{ text: L.name, tr: L.nameTr }, { text: L.word, tr: L.tr }];
    if (L.syl && D.code === 'es') items.splice(1, 0, { text: L.syl.split('-').join(', '), tr: L.syl });
    C.say(items, { clip: 'letter-' + String(L.name).toLowerCase() });
  }
  /* English explanation (non-English letters): the recorded clip, else the device's English voice, else the badge. */
  function sayExplain(D, L) {
    var e = window.CLIPS && CLIPS.explain(D.code, L.ch), txt = explainText(D, L);
    var fb = function () { SPEECH.say('en', [{ text: txt, tr: soundsLike(D, L) }], { quiet: true }); };
    badge(D, L, enName(D, L) + ' — ' + soundsLike(D, L));
    if (!e || !CLIPS.run([e], fb)) fb();
  }
  /* Letter tap, ~300 ms between clips (NAME / SOUND / WORD are the same clips as the Name, Sound and Word buttons):
       English:  NAME … SOUND … "is for turtle" (audio/for/en/NN.mp3)
       Others:   NAME … SOUND … "is for" (audio/for/is-for.mp3) … native WORD … "which means house" (audio/means/<lang>/NN.mp3)
     A missing step is skipped (no sound clip when not approved; English without its "is for" clip says the word clip).
     No name or word clip at all: the old name + word fallback. If a name/sound/word clip fails to play, the old fallback
     runs; if an "is for" / "which means" clip fails, that step is skipped and the rest continues.
     Everything is one CLIPS.run sequence, so any new tap or button cancels it at once (token) and Hoot waits (busy). */
  var GAP = 300;
  function nameEntry(D, L) { return D.code === 'en' ? enClip('tile-' + soundKey(D, L)) : (window.CLIPS ? CLIPS.native(D.code, L.name) : null); }
  function tapSeq(D, L) {
    var n = nameEntry(D, L), s = soundEntry(D, L), w = wordEntry(D, L);
    if (!n || !w) return null;
    var seq = [copy(n)], add = function (e, extra) { if (e) { var o = copy(e, GAP); if (extra) o.extra = true; seq.push(o); } };
    add(s);
    if (D.code === 'en') {
      var f = CLIPS.forClip && CLIPS.forClip(L.ch);
      if (f) add(f, true); else add(w);
    } else {
      add(CLIPS.isFor && CLIPS.isFor(), true);
      add(w);
      add(CLIPS.means && CLIPS.means(D.code, L.ch), true);
    }
    return seq;
  }
  function playTap(D, L) {
    var seq = tapSeq(D, L);
    if (!seq) return sayNameWord(D, L);
    var s = soundEntry(D, L);
    badge(D, L, L.nameTr + (s ? ' … ' + L.snd.split(' ')[0] : '') + ' … ' +
      (D.code === 'en' ? 'is for ' + L.word : 'is for ' + L.tr + ' … which means ' + L.en));
    var go = function (list) {
      CLIPS.run(list, function (i) {
        if (list[i] && list[i].extra && i + 1 < list.length) go(list.slice(i + 1)); /* skip a failed "is for" / "means" clip */
        else if (!(list[i] && list[i].extra)) sayNameWord(D, L);
      });
    };
    go(seq);
  }
  function playSound(D, L) {
    var s = soundEntry(D, L);
    if (!s) { if (D.code === 'en') C.say([{ text: L.name, tr: L.snd }], { quiet: true, clip: 'tile-' + soundKey(D, L) }); else sayExplain(D, L); return; }
    badge(D, L, L.snd);
    CLIPS.run([s], function () { if (D.code === 'en') C.say([{ text: L.name, tr: L.snd }], { quiet: true, clip: 'tile-' + soundKey(D, L) }); else sayExplain(D, L); });
  }
  function playName(D, L) {
    if (D.code === 'en') C.say([{ text: L.name, tr: L.nameTr }], { quiet: true, clip: 'tile-' + soundKey(D, L) });
    else C.say([{ text: L.name, tr: L.nameTr }], { quiet: true });
  }
  function playWord(D, L) { C.say([{ text: L.word, tr: L.tr }], { quiet: true, clip: C.wordKey(L.word) }); }

  function btn(id, icon, label, cls) {
    return '<button class="lbtn' + (cls ? ' ' + cls : '') + '" id="' + id + '" aria-label="' + label + '" lang="en">' + icon + '<span>' + label + '</span></button>';
  }

  function tapLetter(btnEl, L, D, col) {
    try { SFX.tap(); } catch (e) { /* ignore */ }
    C.restart(btnEl, 'dance');
    var isNew = (((C.ST.prog[D.code] || {}).letters) || []).indexOf(L.ch) < 0;
    btnEl.classList.add('seen');
    var spot = document.getElementById('spot'), en = D.code === 'en';
    var sm = window.CLIPS && CLIPS.soundMeta(D.code, soundKey(D, L)), ok = !!(window.CLIPS && CLIPS.approved(D.code, soundKey(D, L)));
    spot.style.setProperty('--c', col);
    spot.innerHTML =
      '<div class="row"><div class="bigch" ' + la(D) + '>' + C.esc(L.ch) + '</div>' + pic(L.pic, 'pic') + '</div>' +
      '<div class="word" ' + la(D) + '>' + C.esc(L.word) + '</div>' +
      (L.syl ? '<div class="syl">' + C.esc(L.syl) + '</div>' : '') +
      (en ? '' : '<div class="enline" lang="en" dir="ltr"><b>' + C.esc(enName(D, L)) + '</b> — ' + C.esc(soundsLike(D, L)) + ' · <span ' + la(D) + '>' +
        C.esc(L.word) + '</span> (' + C.esc(L.tr) + ') <span class="mean">' + C.esc(L.en) + '</span></div>') +
      '<div class="lbtns">' + btn('btnSound', ICON.lSound, 'Sound') + btn('btnName', ICON.lName, 'Name') + btn('btnWord', ICON.lWord, 'Word') +
      (en ? '' : btn('btnExplain', ICON.lExplain, 'Explain in English', 'explain')) + '</div>' +
      '<div class="ptxt parent"><b>' + C.esc(L.nameTr) + '</b> · sound: <b>' + C.esc(L.snd) + '</b>' +
      (sm && sm.ipa ? ' · IPA <b>/' + C.esc(sm.ipa) + '/</b>' : '') + (ok ? '' : ' · (no recorded sound yet: the English explanation plays instead)') + '<br>' +
      (en ? 'Say it together: “' + C.esc(L.name) + ' … ' + C.esc(L.snd.split(' ')[0]) + ' … is for ' + C.esc(L.word) + '!”' :
        C.esc(L.word) + ' = <i>' + C.esc(L.tr) + '</i> — “' + C.esc(L.en) + '” · Sound clips are the consonant said with “a” (Thai: as Thai children say it).') + '</div>';
    var on = function (id, fn) { var b = document.getElementById(id); if (b) b.addEventListener('click', function (e) { e.stopPropagation(); try { SFX.tap(); } catch (x) { /* ignore */ } fn(D, L); }); };
    on('btnSound', playSound); on('btnName', playName); on('btnWord', playWord); on('btnExplain', sayExplain);
    playTap(D, L);
    C.addStar(btnEl);
    C.progress('letters', L.ch);
    /* Every 5th new letter: Hoot dances and cheers once the whole "B … /b/ … is for bear" flow has finished. */
    var seenN = (((C.ST.prog[D.code] || {}).letters) || []).length;
    if (isNew && seenN % 5 === 0) C.buddy('cheer', { maxRuns: 1, maxWait: 16000 });
    if (window.innerWidth <= 900 && spot.scrollIntoView) {
      try { spot.scrollIntoView({ behavior: C.reduced() ? 'auto' : 'smooth', block: 'nearest' }); } catch (e) { /* ignore */ }
    }
  }
})();

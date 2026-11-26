/* Mode 2 — Word Builder Monsters: tap or drag silly letter tiles into glowing slots. */
(function () {
  var C = window.LPWCore;
  var order = {}, pos = {};

  function base(t) { try { return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); } catch (e) { return t; } }
  function tileSay(D, W, k) {
    var t = W.tiles[k];
    if (W.say && W.say[k]) return W.say[k];
    return D.tileSay[t] || D.tileSay[base(t)] || t;
  }
  /* Letter-SOUND clip key for tile k (null = keep the old tile clip). Thai syllable tiles keep their syllable clips.
     W.sk overrides per tile (e.g. Hebrew vowel letters / final forms that have no matching sound clip). */
  function marks(t) { try { return t.normalize('NFD').replace(/[\u0300-\u036f\u0591-\u05C7]/g, '').toLowerCase(); } catch (e) { return t; } }
  function tileSoundKey(D, W, k) {
    if (D.code === 'th') return null;
    if (W.sk) return W.sk[k] || null;
    var t = marks(W.tiles[k]);
    if (D.code === 'en') return /^[a-z]$/.test(t) ? t : null;
    for (var i = 0; i < D.letters.length; i++) if (marks(D.letters[i].ch).indexOf(t) >= 0) return D.letters[i].ch;
    return null;
  }
  window.LPWBuilder = { tileSoundKey: tileSoundKey };
  function tileTr(D, t) { return (D.tileTr || {})[t] || (D.tileTr || {})[base(t)] || t; }

  function current(D) {
    if (!order[D.code]) { order[D.code] = C.shuffle(D.words.map(function (_, i) { return i; })); pos[D.code] = 0; }
    return D.words[order[D.code][pos[D.code] % D.words.length]];
  }

  MODES.builder = {
    title: 'Word Builder Monsters',
    next: function () { var D = C.D(); current(D); pos[D.code]++; },
    render: function (root, D) {
      var W = current(D), la = window.LPWla(D), done = false;
      root.innerHTML = '<div class="screen-title"><span class="ico">' + ICON.mBuilder + '</span><h1>' + this.title + '</h1></div>';
      var box = C.el('div', { class: 'builder' + (D.code === 'th' ? ' th' : ''), id: 'builder' });
      box.innerHTML =
        '<div class="instr" lang="en" dir="ltr">Build the word!</div>' +
        '<div class="target"><div class="pic" id="bPic">' + pic(W.pic, '') + '</div>' +
        '<button class="roundbtn speak" id="bSay" aria-label="Hear the word">' + ICON.speaker + '</button></div>' +
        (D.code === 'en' ? '' : '<div style="text-align:center">' + C.mean(D, W.en) + '</div>') +
        '<div class="ptxt parent" style="text-align:center">' + (D.code === 'en' ? 'Sound it out together: <b>' + C.esc(W.sylTr || W.w) + '</b> … <b>' + C.esc(W.w) + '</b>. Each tile says its letter sound.' :
          '<span ' + la + '>' + C.esc(W.w) + '</span> = <i>' + C.esc(W.tr) + '</i> — “' + C.esc(W.en) + '”') +
        (D.dir === 'rtl' ? ' · Hebrew reads right → left: the first letter goes in the right-most slot.' : '') + '</div>' +
        '<div class="slots" id="slots" ' + la + '></div><div class="tray" id="tray" ' + la + '></div>' +
        '<div class="row" id="bNext" style="min-height:96px"></div>';
      root.appendChild(box);
      var slotsEl = box.querySelector('#slots'), tray = box.querySelector('#tray');
      W.tiles.forEach(function (t, k) {
        slotsEl.appendChild(C.el('div', { class: 'slot', 'data-t': t, 'data-k': k }, C.esc(t)));
      });
      var tileOrder = C.shuffle(W.tiles.map(function (_, k) { return k; }));
      if (W.tiles.length > 1 && tileOrder.every(function (v, i) { return v === i; })) tileOrder.reverse();
      tileOrder.forEach(function (k, n) {
        var t = W.tiles[k];
        var tile = C.el('button', { class: 'tile', 'data-t': t, 'data-k': k, style: '--c:' + C.COLORS[(n + 2) % C.COLORS.length], 'aria-label': tileTr(D, t) },
          '<span class="ant l"></span><span class="ant r"></span><span class="tch">' + C.esc(t) + '</span><span class="te"><i></i><i></i></span>');
        attachDrag(tile, function (target) { return tryPlace(tile, target); }, function () { speakTile(k); });
        tray.appendChild(tile);
      });
      markNext();
      box.querySelector('#bSay').addEventListener('click', function () { sayWord(); });
      C.later(function () { if (document.body.contains(box)) sayWord(); }, 350);

      function sayWord() { C.say([{ text: W.w, tr: W.tr }], { clip: C.wordKey(W.w) }); }
      function oldTile(k) { C.say([{ text: tileSay(D, W, k), tr: tileTr(D, W.tiles[k]) }], { quiet: true, clip: 'tile-' + W.tiles[k] }); }
      /* Tapping a letter tile plays its letter SOUND clip; anything without one keeps its old tile clip. */
      function speakTile(k) {
        var sk = tileSoundKey(D, W, k), e = sk && window.CLIPS ? CLIPS.sound(D.code, sk) : null;
        if (!e) return oldTile(k);
        if (D.code !== 'en' || document.body.classList.contains('parent-on')) { try { SPEECH.badge(W.tiles[k], tileTr(D, W.tiles[k]), D.dir); } catch (x) { /* ignore */ } }
        CLIPS.run([e], function () { oldTile(k); });
      }
      function nextSlot() { return slotsEl.querySelector('.slot:not(.filled)'); }
      function markNext() {
        slotsEl.querySelectorAll('.slot').forEach(function (s) { s.classList.remove('next'); });
        var n = nextSlot(); if (n) n.classList.add('next');
      }
      /* target: a slot element (drag) or null (tap = next empty slot) */
      function tryPlace(tile, target) {
        if (done || tile.classList.contains('used')) return false; /* a used (hidden) tile can never be placed twice, e.g. via keyboard */
        var slot = target || nextSlot();
        try { SFX.tap(); } catch (e) { /* ignore */ }
        if (slot && !slot.classList.contains('filled') && slot.getAttribute('data-t') === tile.getAttribute('data-t')) {
          slot.classList.add('filled'); slot.style.setProperty('--c', tile.style.getPropertyValue('--c'));
          slot.textContent = tile.getAttribute('data-t');
          tile.classList.add('used');
          speakTile(+slot.getAttribute('data-k'));
          markNext();
          if (!nextSlot()) complete();
          return true;
        }
        try { SFX.boing(); } catch (e) { /* ignore */ }
        /* Wrong TAP: boing, then still say this tile's own letter sound (drags already spoke on pick-up).
           CLIPS.stop + CLIPS.later: any newer clip/tap cancels this, so only one clip ever plays. */
        if (!target) {
          var wk = +tile.getAttribute('data-k');
          try { if (window.CLIPS) CLIPS.stop(); } catch (e) { /* ignore */ }
          C.later(function () { if (document.body.contains(tile)) speakTile(wk); }, 380);
        }
        C.restart(tile, 'no');
        return false;
      }
      function complete() {
        done = true;
        var items = [];
        if (W.syl && W.syl.length > 1) items.push({ text: W.syl.join(', '), tr: W.sylTr || W.syl.join(' - ') });
        items.push({ text: W.w, tr: W.tr });
        try { SFX.win(); } catch (e) { /* ignore */ }
        C.confetti(80);
        C.restart(box.querySelector('#bPic'), 'win');
        C.addStar(box.querySelector('#bPic'), 2);
        var cheerKey = C.cheer(box.querySelector('#bPic'));
        /* English: "C, A, T... Cat!" then the cheer that is on screen. */
        C.later(function () { if (document.body.contains(box)) C.say(items, { quiet: true, clip: ['spell-' + W.w, cheerKey] }); }, 450);
        C.progress('builder');
        box.setAttribute('data-done', '1');
        var nb = C.el('button', { class: 'roundbtn go', id: 'nextWord', 'aria-label': 'Next word' }, ICON.next);
        nb.addEventListener('click', function () { MODES.builder.next(); window.LPWApp.go('builder'); });
        box.querySelector('#bNext').appendChild(nb);
      }
    }
  };

  /* Pointer-event drag that also works with touch. Short press without movement = tap. */
  function attachDrag(tile, place, onTapSound) {
    var sx = 0, sy = 0, dragging = false, active = false, pid = null, hover = null;
    tile.addEventListener('pointerdown', function (e) {
      if (tile.classList.contains('used')) return;
      active = true; dragging = false; sx = e.clientX; sy = e.clientY; pid = e.pointerId;
      try { tile.setPointerCapture(pid); } catch (er) { /* ignore */ }
    });
    tile.addEventListener('pointermove', function (e) {
      if (!active) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!dragging && Math.abs(dx) + Math.abs(dy) > 10) { dragging = true; tile.classList.add('drag'); onTapSound(); }
      if (dragging) {
        tile.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.12)';
        var s = slotAt(e.clientX, e.clientY);
        if (s !== hover) { if (hover) hover.classList.remove('hover'); hover = s; if (s) s.classList.add('hover'); }
      }
    });
    function end(e, cancelled) {
      if (!active) return;
      active = false;
      try { tile.releasePointerCapture(pid); } catch (er) { /* ignore */ }
      if (hover) hover.classList.remove('hover');
      var wasDrag = dragging; dragging = false;
      tile.classList.remove('drag'); tile.style.transform = '';
      if (cancelled) return;
      if (wasDrag) { var s = slotAt(e.clientX, e.clientY); if (s) place(s); else { try { SFX.boing(); } catch (er) { /* ignore */ } } }
      else place(null);
      hover = null;
    }
    tile.addEventListener('pointerup', function (e) { end(e, false); });
    tile.addEventListener('pointercancel', function (e) { end(e, true); });
    tile.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); place(null); } });
  }
  function slotAt(x, y) {
    var slots = document.querySelectorAll('#slots .slot');
    for (var i = 0; i < slots.length; i++) {
      var r = slots[i].getBoundingClientRect();
      if (x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 12 && y <= r.bottom + 12) return slots[i];
    }
    return null;
  }
})();

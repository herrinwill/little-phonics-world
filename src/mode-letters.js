/* Mode 1 — Letter & Sound Factory: tap a letter-character, it dances, speaks, and its picture pops. */
(function () {
  var C = window.LPWCore;
  function la(D) { return 'lang="' + D.code + '" dir="' + D.dir + '"'; }
  window.LPWla = la;

  MODES.letters = {
    title: 'Letter & Sound Factory',
    render: function (root, D) {
      root.innerHTML = '<div class="screen-title"><span class="ico">' + ICON.mLetters + '</span><h1>' + this.title + '</h1></div>';
      var wrap = C.el('div', { class: 'factory' });
      var grid = C.el('div', { class: 'letter-grid', id: 'letterGrid' });
      var spot = C.el('div', { class: 'spot', id: 'spot', style: '--c:' + D.color });
      spot.innerHTML = '<div class="hint">' + ICON.mLetters + '</div>' +
        '<div class="bigch" ' + la(D) + '>' + C.esc(D.letters[0].ch) + '</div>' +
        '<div class="ptxt parent">Tap any letter friend: it says its name and a word that starts with it.</div>';
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

  function tapLetter(btn, L, D, col) {
    try { SFX.tap(); } catch (e) { /* ignore */ }
    C.restart(btn, 'dance');
    btn.classList.add('seen');
    var spot = document.getElementById('spot');
    spot.style.setProperty('--c', col);
    spot.innerHTML =
      '<div class="row"><div class="bigch" ' + la(D) + '>' + C.esc(L.ch) + '</div>' + pic(L.pic, 'pic') + '</div>' +
      '<div class="word" ' + la(D) + '>' + C.esc(L.word) + '</div>' +
      (L.syl ? '<div class="syl">' + C.esc(L.syl) + '</div>' : '') +
      '<div class="ptxt parent"><b>' + C.esc(L.nameTr) + '</b> · sound: <b>' + C.esc(L.snd) + '</b><br>' +
      C.esc(L.word) + ' = <i>' + C.esc(L.tr) + '</i> — “' + C.esc(L.en) + '”</div>' +
      '<button class="roundbtn speak" id="replayLetter" aria-label="Hear again">' + ICON.speaker + '</button>';
    var speakIt = function () {
      var items = [{ text: L.name, tr: L.nameTr }, { text: L.word, tr: L.tr }];
      if (L.syl && D.code === 'es') items.splice(1, 0, { text: L.syl.split('-').join(', '), tr: L.syl });
      C.say(items);
    };
    document.getElementById('replayLetter').addEventListener('click', function (e) { e.stopPropagation(); speakIt(); });
    speakIt();
    C.addStar(btn);
    C.progress('letters', L.ch);
    if (window.innerWidth <= 900 && spot.scrollIntoView) {
      try { spot.scrollIntoView({ behavior: C.reduced() ? 'auto' : 'smooth', block: 'nearest' }); } catch (e) { /* ignore */ }
    }
  }
})();

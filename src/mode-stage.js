/* Mode 4 — Rainbow Sound Stage (free play) + Sticker Book / Star Jar. */
(function () {
  var C = window.LPWCore;
  var RAINBOW = ['#ff4d4d', '#ff7a1c', '#ff9f1c', '#ffd23f', '#a8e05f', '#3ddc84', '#2ec4b6', '#4d96ff', '#7b6cff', '#c86bff'];
  var tabNow = 'numbers';
  var scaleNext = 0; /* playing the bars 1 → 10 in order is a little "song": Hoot cheers at the end */
  var EN_NUM = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  MODES.stage = {
    title: 'Rainbow Sound Stage',
    render: function (root, D) {
      var la = window.LPWla(D);
      root.innerHTML = '<div class="screen-title"><span class="ico">' + ICON.mStage + '</span><h1>' + this.title + '</h1></div>';
      var tabs = C.el('div', { class: 'tabs', role: 'tablist' });
      [['numbers', ICON.note, '1-10'], ['colors', ICON.palette, ''], ['animals', ICON.paw, '']].forEach(function (t) {
        var b = C.el('button', { class: 'tab' + (tabNow === t[0] ? ' on' : ''), 'data-tab': t[0], role: 'tab', 'aria-label': t[0], 'aria-selected': String(tabNow === t[0]) },
          t[1] + (t[2] ? '<span>' + t[2] + '</span>' : ''));
        b.addEventListener('click', function () { tabNow = t[0]; try { SFX.tap(); } catch (e) { /* ignore */ } MODES.stage.render(root, D); });
        tabs.appendChild(b);
      });
      root.appendChild(tabs);
      var area = C.el('div', { id: 'stageArea' }), out = C.el('div', { class: 'stage-out', id: 'stageOut' });

      function show(word, tr, en, extra) {
        out.innerHTML = '<div class="w" ' + la + '>' + C.esc(word) + '</div>' + C.mean(D, en, 'block') + (extra || '') +
          '<div class="ptxt parent" style="display:inline-block">' + (D.code === 'en' ? 'Say it together: “' + C.esc(tr) + '”' : C.esc(tr) + (en ? ' — “' + C.esc(en) + '”' : '')) + '</div>';
        if (document.body.classList.contains('parent-on')) out.querySelector('.parent').style.display = 'inline-block';
      }
      function count() { C.progress('stage'); var s = C.ST.prog[D.code].stage; if (s % 10 === 0) C.addStar(out); }

      if (tabNow === 'numbers') {
        var x = C.el('div', { class: 'xylo', id: 'xylo' });
        D.numbers.forEach(function (n, i) {
          var b = C.el('button', { class: 'bar', 'data-n': i + 1, style: '--c:' + RAINBOW[i] + ';--h:' + (100 - i * 5.5) + '%;--hp:' + (150 - i * 7) + 'px', 'aria-label': String(i + 1) },
            '<i></i><span>' + (i + 1) + (D.digits ? '<br><small>' + D.digits[i] + '</small>' : '') + '</span><i></i>' + C.mean(D, EN_NUM[i]));
          b.addEventListener('pointerdown', function () { C.restart(b, 'hit'); });
          b.addEventListener('click', function () {
            try { SFX.xylo(i); } catch (e) { /* ignore */ }
            C.restart(b, 'hit');
            setTimeout(function () { b.classList.remove('hit'); }, 160);
            C.say([{ text: n.w, tr: n.tr }], { quiet: true, clip: C.wordKey(n.w) });
            scaleNext = (i === scaleNext) ? scaleNext + 1 : (i === 0 ? 1 : 0);
            if (scaleNext === 10) { scaleNext = 0; C.buddy('cheer', { maxRuns: 1, maxWait: 8000 }); }
            var dots = '<div class="dots">';
            for (var k = 0; k <= i; k++) dots += '<span style="animation-delay:' + (k * 0.05) + 's;display:block">' + ICON.star + '</span>';
            show((D.digits ? D.digits[i] + ' · ' : (i + 1) + ' · ') + n.w, n.tr, (i + 1) + ' · ' + EN_NUM[i], dots + '</div>');
            count();
          });
          x.appendChild(b);
        });
        area.appendChild(x);
      } else if (tabNow === 'colors') {
        var sw = C.el('div', { class: 'swatches' });
        D.colors.forEach(function (c, i) {
          var b = C.el('button', { class: 'swatch', style: '--c:' + c.hex, 'aria-label': c.en }, svg(ART._h.face(50, 44, 12)) + C.mean(D, c.en));
          b.addEventListener('click', function () {
            try { SFX.xylo(i + 2); } catch (e) { /* ignore */ }
            C.restart(b, 'dance');
            C.say([{ text: c.w, tr: c.tr }], { quiet: true, clip: C.wordKey(c.w) });
            show(c.w, c.tr, c.en);
            out.querySelector('.w').style.color = c.hex;
            count();
          });
          sw.appendChild(b);
        });
        area.appendChild(sw);
      } else {
        var zoo = C.el('div', { class: 'zoo' });
        D.animals.forEach(function (a) {
          var b = C.el('button', { 'aria-label': a.en, 'data-pic': a.pic }, pic(a.pic, '') + C.mean(D, a.en));
          b.addEventListener('click', function () {
            try { SFX.animal(); } catch (e) { /* ignore */ }
            C.restart(b, 'dance');
            C.say([{ text: a.w, tr: a.tr }], { quiet: true, clip: C.wordKey(a.w) });
            show(a.w, a.tr, a.en);
            count();
          });
          zoo.appendChild(b);
        });
        area.appendChild(zoo);
      }
      root.appendChild(area); root.appendChild(out);
    }
  };

  MODES.stickers = {
    title: 'Sticker Book & Star Jar',
    render: function (root) {
      var ST = C.ST;
      root.innerHTML = '<div class="screen-title"><span class="ico">' + ICON.book + '</span><h1>' + this.title + '</h1></div>';
      var book = C.el('div', { class: 'book' });
      var jar = C.el('div', { class: 'jar', id: 'jar' }, ICON.jar(ST.stars) + '<div class="n">' + ICON.star + '<span>' + ST.stars + '</span></div>');
      var right = C.el('div');
      var head = '<div class="stk-head">' + C.MODES_LIST.map(function (m) { return '<div>' + ICON.modeIcon[m] + '</div>'; }).join('') + '</div>';
      var grid = '<div class="stickers" id="stickerGrid">';
      ['en', 'he', 'el', 'th', 'es'].forEach(function (L) {
        var D = LPW_DATA[L];
        C.MODES_LIST.forEach(function (m, j) {
          var got = !!ST.stickers[L + '-' + m];
          grid += '<div class="stk' + (got ? '' : ' locked') + '" data-id="' + L + '-' + m + '" style="--c:' + D.color + ';animation-delay:' + (j * 0.06) + 's">' +
            ICON.sticker(L, m) + '<span class="lg" lang="' + L + '"' + (D.dir === 'rtl' ? ' dir="rtl"' : '') + '>' + D.glyph + '</span></div>';
        });
      });
      grid += '</div>';
      right.innerHTML = head + grid +
        '<div class="ptxt parent" style="margin-top:12px">Stickers unlock per language: Letters — tap ' + C.NEED.letters + ' different letters · Word Builder — finish ' +
        C.NEED.builder + ' word · Bubble Hunt — pop ' + C.NEED.bubbles + ' right bubbles · Sound Stage — play ' + C.NEED.stage + ' notes. Progress is saved on this device.</div>';
      book.appendChild(jar); book.appendChild(right);
      root.appendChild(book);
      root.querySelectorAll('.stk:not(.locked)').forEach(function (s) {
        s.addEventListener('click', function () { try { SFX.chime(); } catch (e) { /* ignore */ } C.restart(s, 'dance'); });
      });
    }
  };
})();

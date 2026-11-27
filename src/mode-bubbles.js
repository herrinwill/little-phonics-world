/* Mode 3 — Listen & Pop Bubble Hunt: hear a word, pop the matching picture bubble. No timers, no lives. */
(function () {
  var C = window.LPWCore;
  var last = {};

  function pool(D) {
    var seen = {}, out = [];
    D.animals.concat(D.letters.map(function (L) { return { w: L.word, tr: L.tr, en: L.en, pic: L.pic }; })).forEach(function (it) {
      if (!seen[it.pic]) { seen[it.pic] = 1; out.push(it); }
    });
    return out;
  }

  MODES.bubbles = {
    title: 'Listen & Pop Bubble Hunt',
    render: function (root, D) {
      var la = window.LPWla(D), P = pool(D), target, opts, wrong = 0, solved = false;
      do { target = P[Math.floor(Math.random() * P.length)]; } while (P.length > 1 && target.pic === last[D.code]);
      last[D.code] = target.pic;
      opts = C.shuffle([target].concat(C.shuffle(P.filter(function (p) { return p.pic !== target.pic; })).slice(0, 3)));

      root.innerHTML = '<div class="screen-title"><span class="ico">' + ICON.mBubbles + '</span><h1>' + this.title + '</h1></div>';
      var box = C.el('div', { class: 'listen', id: 'listen' });
      box.innerHTML =
        '<div class="instr" lang="en" dir="ltr" style="text-align:center">Listen and pop the matching bubble!</div>' +
        '<div class="ask"><button class="roundbtn speak" id="hear" aria-label="Hear the word">' + ICON.speaker + '</button>' +
        '<div><div class="say" ' + la + '>' + C.esc(target.w) + '</div>' + (D.code === 'en' ? '' : '<div style="font-weight:800;color:#7a6fb0;font-size:18px">' + C.esc(target.tr) + '</div>' + C.mean(D, target.en)) + '</div></div>' +
        '<div class="ptxt parent" style="text-align:center">Find: <b>' + C.esc(target.en) + '</b>. Wrong taps just giggle — after two, the right bubble glows.</div>' +
        '<div class="bubbles" id="bubbleBox" style="--n:' + opts.length + '"></div>';
      root.appendChild(box);
      var bb = box.querySelector('#bubbleBox');
      opts.forEach(function (o) {
        var b = C.el('button', { class: 'bubble', 'data-pic': o.pic, 'aria-label': o.en }, pic(o.pic, '') +
          '<span class="cap parent ptxt" ' + la + '>' + C.esc(o.w) + '</span>' + C.mean(D, o.en));
        if (o === target) b.setAttribute('data-ok', '1');
        b.addEventListener('click', function () { choose(b, o); });
        bb.appendChild(b);
      });
      function sayTarget() { C.say([{ text: target.w, tr: target.tr }], { clip: C.wordKey(target.w) }); }
      box.querySelector('#hear').addEventListener('click', sayTarget);
      C.later(function () { if (document.body.contains(box)) sayTarget(); }, 400);

      function choose(b, o) {
        if (solved) return;
        if (o === target) {
          solved = true;
          try { SFX.pop(); } catch (e) { /* ignore */ }
          var c = C.center(b); C.burst(c.x, c.y);
          C.addStar(b);
          var cheerKey = C.cheer(b);
          b.classList.add('popped');
          C.confetti(50);
          C.say([{ text: target.w, tr: target.tr }], { quiet: true, clip: [C.wordKey(target.w), cheerKey] });
          C.sparkle(c.x, c.y, 10);
          C.buddy('cheer', { maxRuns: 1, maxWait: 6000 });
          C.progress('bubbles');
          box.setAttribute('data-solved', '1');
          /* Next round after 2.3 s, or a little later while Hoot finishes a cheer (never more than 6 s). */
          var t0 = Date.now();
          var advance = function () {
            if (!document.body.contains(box)) return;
            if (window.BUDDY && BUDDY.busy() && Date.now() - t0 < 6000) { setTimeout(advance, 200); return; }
            window.LPWApp.go('bubbles');
          };
          setTimeout(advance, 2300);
          return;
        }
        wrong++;
        try { SFX.giggle(); } catch (e) { /* ignore */ }
        C.restart(b, 'no');
        C.buddy('retry', { maxRuns: 0, quiet: wrong >= 2 }); /* after 2 misses the target word replays instead: Hoot only tilts */
        var g = C.el('span', { class: 'giggle' }, '♪'); b.appendChild(g);
        setTimeout(function () { g.remove(); }, 700);
        if (wrong >= 2) {
          var ok = bb.querySelector('[data-ok]');
          setTimeout(function () { /* visual hint always happens; only the audio is cancellable */
            if (!document.body.contains(box) || solved) return;
            sayTarget();
            if (ok) { ok.classList.add('hint'); setTimeout(function () { ok.classList.remove('hint'); }, 2200); }
          }, 500);
        }
      }
    }
  };
})();

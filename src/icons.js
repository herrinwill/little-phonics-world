/* UI icons, mode illustrations, stickers and the pic() helper. */
(function (A) {
  var h = A._h, INK = h.INK, eyes = h.eyes, smile = h.smile, face = h.face;
  var I = window.ICON = {};
  function svg(inner, cls, label) {
    return '<svg viewBox="0 0 100 100" class="' + (cls || '') + '"' + (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + '>' + inner + '</svg>';
  }
  window.svg = svg;
  window.pic = function (name, cls) { return svg(A[name] || A.star, cls || 'pic', name); };

  I.home = svg('<path d="M10 50L50 14l40 36" stroke="#ff5a5f" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 46v42h56V46L50 22z" fill="#fff"/><rect x="40" y="58" width="20" height="30" rx="8" fill="#4d96ff"/>');
  I.star = svg(A.star.split('<circle')[0]);
  I.speaker = svg('<path d="M12 38h16l22-18v60L28 62H12z" fill="#ff5a8a"/><path d="M62 34q10 16 0 32M72 24q18 26 0 52" stroke="#ff5a8a" stroke-width="7" fill="none" stroke-linecap="round"/>');
  I.parent = svg('<circle cx="34" cy="28" r="12" fill="#4d96ff"/><path d="M14 72q0-30 20-30t20 30z" fill="#4d96ff"/><circle cx="68" cy="44" r="9" fill="#ff9f1c"/><path d="M54 78q0-22 14-22t14 22z" fill="#ff9f1c"/>' +
    '<rect x="40" y="70" width="44" height="22" rx="4" fill="#ffd23f"/><path d="M62 70v22" stroke="#fff" stroke-width="3"/>');
  I.next = svg('<circle cx="50" cy="50" r="44" fill="#fff" opacity=".0"/><path d="M30 20l36 30-36 30z" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>');
  I.replay = svg('<path d="M74 34A30 30 0 1 0 80 56" stroke="#2b2350" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M64 14l18 22-28 4z" fill="#2b2350"/>');
  I.note = svg('<path d="M38 70V22l40-8v48" stroke="#9b5de5" stroke-width="7" fill="none" stroke-linejoin="round"/><ellipse cx="28" cy="72" rx="13" ry="10" fill="#9b5de5"/><ellipse cx="68" cy="64" rx="13" ry="10" fill="#9b5de5"/>');
  I.palette = svg('<path d="M50 10C24 10 8 30 8 50s16 38 34 38c8 0 10-6 6-12s0-12 8-12h14c14 0 22-8 22-20 0-20-20-34-42-34z" fill="#ffe0a3"/>' +
    '<circle cx="30" cy="40" r="7" fill="#ff4d4d"/><circle cx="46" cy="26" r="7" fill="#ffd23f"/><circle cx="66" cy="28" r="7" fill="#3ddc84"/><circle cx="76" cy="46" r="7" fill="#4d96ff"/><circle cx="28" cy="62" r="7" fill="#9b5de5"/>');
  I.paw = svg('<ellipse cx="50" cy="64" rx="22" ry="18" fill="#ff7eb6"/><circle cx="24" cy="40" r="9" fill="#ff7eb6"/><circle cx="40" cy="24" r="9" fill="#ff7eb6"/><circle cx="60" cy="24" r="9" fill="#ff7eb6"/><circle cx="76" cy="40" r="9" fill="#ff7eb6"/>');
  I.book = svg('<rect x="12" y="12" width="76" height="80" rx="10" fill="#9b5de5"/><rect x="20" y="12" width="68" height="74" rx="8" fill="#ff7eb6"/>' +
    '<circle cx="42" cy="38" r="12" fill="#ffd23f"/><path d="M62 30l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#fff"/><rect x="32" y="58" width="22" height="20" rx="6" fill="#3ddc84"/><circle cx="68" cy="68" r="10" fill="#4dc3ff"/>');
  I.check = svg('<path d="M20 52l20 20 40-44" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');

  /* Mode illustrations */
  I.mLetters = svg('<rect x="16" y="14" width="68" height="74" rx="20" fill="#fff"/><path d="M34 12l-4-10 10 6zM66 12l4-10-10 6z" fill="#ffd23f"/>' +
    '<text x="50" y="74" text-anchor="middle" font-size="46" font-weight="900" fill="#ff5a8a" font-family="Arial,sans-serif">A</text>' + eyes(50, 32, 11, 5) +
    '<path d="M84 20l3 6 6 1-5 4 2 6-6-3-6 3 2-6-5-4 6-1z" fill="#ffd23f"/>');
  I.mBuilder = svg('<rect x="22" y="22" width="56" height="52" rx="22" fill="#ff9f1c"/><path d="M34 24l-8-18M66 24l8-18" stroke="#ff9f1c" stroke-width="5" stroke-linecap="round"/><circle cx="26" cy="6" r="6" fill="#ffd23f"/><circle cx="74" cy="6" r="6" fill="#ffd23f"/>' +
    eyes(50, 42, 11, 6) + '<path d="M38 56q12 12 24 0z" fill="#fff"/>' +
    '<rect x="6" y="74" width="26" height="24" rx="6" fill="#ffd23f"/><rect x="37" y="74" width="26" height="24" rx="6" fill="#ff5a8a"/><rect x="68" y="74" width="26" height="24" rx="6" fill="#4d96ff"/>');
  I.mBubbles = svg('<circle cx="40" cy="54" r="34" fill="#cfefff" stroke="#fff" stroke-width="4"/><circle cx="28" cy="40" r="7" fill="#fff" opacity=".9"/>' + A.fish.replace(/<circle[^>]*stroke="#9fd8ff"[^>]*\/>/g, '').replace(/^/, '<g transform="translate(18 34) scale(.44)">') + '</g>' +
    '<circle cx="80" cy="24" r="16" fill="#cfefff" stroke="#fff" stroke-width="3"/><circle cx="84" cy="66" r="10" fill="#cfefff" stroke="#fff" stroke-width="3"/>');
  I.mStage = svg('<rect x="6" y="20" width="12" height="62" rx="5" fill="#ff4d4d"/><rect x="22" y="25" width="12" height="52" rx="5" fill="#ff9f1c"/><rect x="38" y="30" width="12" height="42" rx="5" fill="#ffd23f"/>' +
    '<rect x="54" y="35" width="12" height="32" rx="5" fill="#3ddc84"/><rect x="70" y="40" width="12" height="22" rx="5" fill="#4d96ff"/><path d="M84 30l12-12M90 36l8-4" stroke="#fff" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="92" cy="14" r="6" fill="#fff"/>');

  /* Sound-out badge mascot: a smiling star with a speech bubble feel */
  I.badgeStar = svg(A.star);

  /* Star jar with n stars inside (max shown 40) */
  I.jar = function (n) {
    var stars = '', shown = Math.min(n, 40);
    for (var i = 0; i < shown; i++) {
      var row = Math.floor(i / 5), col = i % 5, x = 24 + col * 13 + (row % 2) * 6, y = 136 - row * 12;
      stars += '<path transform="translate(' + x + ' ' + y + ') scale(.16) translate(-50 -50)" d="M50 6l13 28 30 3-23 20 7 30-27-16-27 16 7-30-23-20 30-3z" fill="' + ['#ffd23f', '#ff9f1c', '#ff7eb6', '#4dc3ff', '#3ddc84'][i % 5] + '"/>';
    }
    return '<svg viewBox="0 0 100 160" aria-hidden="true"><rect x="28" y="6" width="44" height="14" rx="6" fill="#ff7eb6"/>' +
      '<path d="M22 22h56q8 0 8 10v112q0 12-12 12H26q-12 0-12-12V32q0-10 8-10z" fill="#e8f7ff" stroke="#9fd8ff" stroke-width="4"/>' + stars +
      '<path d="M24 34v100" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>';
  };

  /* Stickers: 4 modes × 5 languages. Each is a framed character. */
  var frames = { letters: '#ff7eb6', builder: '#4d96ff', bubbles: '#3ddc84', stage: '#9b5de5' };
  var stickerPics = {
    en: { letters: 'apple', builder: 'frog', bubbles: 'whale', stage: 'kite' },
    he: { letters: 'lion', builder: 'camel', bubbles: 'fish', stage: 'peacock' },
    el: { letters: 'star', builder: 'dolphin', bubbles: 'seahorse', stage: 'butterfly' },
    th: { letters: 'elephant', builder: 'turtle', bubbles: 'giant', stage: 'tiger' },
    es: { letters: 'sun', builder: 'giraffe', bubbles: 'iguana', stage: 'bear' }
  };
  I.sticker = function (lang, mode) {
    var p = (stickerPics[lang] || stickerPics.es)[mode];
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="' + frames[mode] + '"/><circle cx="50" cy="50" r="40" fill="#fff"/>' +
      '<g transform="translate(14 14) scale(.72)">' + (A[p] || A.star) + '</g>' +
      '<path d="M84 8l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#ffd23f"/></svg>';
  };
  I.modeIcon = { letters: I.mLetters, builder: I.mBuilder, bubbles: I.mBubbles, stage: I.mStage };
})(window.ART);

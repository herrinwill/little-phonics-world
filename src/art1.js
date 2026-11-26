/* Inline SVG art — part 1: helpers + animal faces. viewBox 0 0 100 100. No external assets. */
window.ART = window.ART || {};
(function (A) {
  var INK = '#2b2350';
  function eye(x, y, r) { r = r || 4; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + (x + r * .35) + '" cy="' + (y - r * .35) + '" r="' + (r * .38) + '" fill="#fff"/>'; }
  function eyes(cx, y, g, r) { return eye(cx - g, y, r) + eye(cx + g, y, r); }
  function smile(cx, y, w) { w = w || 8; return '<path d="M' + (cx - w) + ' ' + y + ' Q' + cx + ' ' + (y + w * .9) + ' ' + (cx + w) + ' ' + y + '" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>'; }
  function cheeks(cx, y, g) { return '<circle cx="' + (cx - g) + '" cy="' + y + '" r="4" fill="#ff8fab" opacity=".7"/><circle cx="' + (cx + g) + '" cy="' + y + '" r="4" fill="#ff8fab" opacity=".7"/>'; }
  function face(cx, cy, g) { g = g || 10; return eyes(cx, cy, g) + cheeks(cx, cy + 9, g + 5) + smile(cx, cy + 9, 7); }
  A._h = { eye: eye, eyes: eyes, smile: smile, cheeks: cheeks, face: face, INK: INK };

  var mane = '';
  for (var i = 0; i < 12; i++) {
    var a = i / 12 * Math.PI * 2;
    mane += '<circle cx="' + (50 + Math.cos(a) * 32).toFixed(1) + '" cy="' + (52 + Math.sin(a) * 32).toFixed(1) + '" r="13" fill="#ff8c1a"/>';
  }
  A.lion = mane + '<circle cx="50" cy="52" r="34" fill="#ff9f1c"/><circle cx="30" cy="30" r="8" fill="#ffd23f"/><circle cx="70" cy="30" r="8" fill="#ffd23f"/>' +
    '<circle cx="50" cy="54" r="25" fill="#ffd23f"/>' + eyes(50, 48, 9) + '<path d="M45 57h10l-5 5z" fill="#ff5a8a"/>' + smile(50, 63, 6) + cheeks(50, 60, 15);

  A.cat = '<path d="M22 44 L26 12 L44 30Z M78 44 L74 12 L56 30Z" fill="#a9a6d6"/><path d="M27 36 L29 20 L39 30Z M73 36 L71 20 L61 30Z" fill="#ffb3c7"/>' +
    '<ellipse cx="50" cy="56" rx="34" ry="30" fill="#b9b6e3"/>' + eyes(50, 50, 12, 5) + '<path d="M46 60h8l-4 4z" fill="#ff5a8a"/>' + smile(50, 65, 6) +
    '<path d="M14 58h20M14 66l20-3M86 58H66M86 66l-20-3" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>';

  A.dog = '<ellipse cx="50" cy="54" rx="30" ry="29" fill="#ffe0a3"/><ellipse cx="22" cy="48" rx="11" ry="22" fill="#f4a259" transform="rotate(15 22 48)"/>' +
    '<ellipse cx="78" cy="48" rx="11" ry="22" fill="#f4a259" transform="rotate(-15 78 48)"/><circle cx="62" cy="44" r="9" fill="#f4a259" opacity=".7"/>' +
    eyes(50, 47, 11) + '<ellipse cx="50" cy="62" rx="12" ry="9" fill="#fff4dc"/><ellipse cx="50" cy="58" rx="6" ry="4.5" fill="' + INK + '"/>' +
    smile(50, 64, 6) + '<path d="M47 70q3 9 6 0z" fill="#ff5a8a"/>';

  A.monkey = '<circle cx="18" cy="48" r="12" fill="#f08a3c"/><circle cx="82" cy="48" r="12" fill="#f08a3c"/><circle cx="18" cy="48" r="6" fill="#ffd1a6"/><circle cx="82" cy="48" r="6" fill="#ffd1a6"/>' +
    '<circle cx="50" cy="50" r="32" fill="#f08a3c"/><path d="M50 30c-20 0-24 14-20 22-6 6-4 26 20 26s26-20 20-26c4-8 0-22-20-22z" fill="#ffd1a6"/>' +
    eyes(50, 46, 8) + '<circle cx="46" cy="58" r="1.8" fill="' + INK + '"/><circle cx="54" cy="58" r="1.8" fill="' + INK + '"/>' + smile(50, 64, 9);

  A.mouse = '<circle cx="24" cy="30" r="18" fill="#b8bfd6"/><circle cx="76" cy="30" r="18" fill="#b8bfd6"/><circle cx="24" cy="30" r="10" fill="#ffb3c7"/><circle cx="76" cy="30" r="10" fill="#ffb3c7"/>' +
    '<ellipse cx="50" cy="58" rx="28" ry="26" fill="#c9cfe3"/>' + eyes(50, 52, 10) + '<circle cx="50" cy="64" r="4" fill="#ff5a8a"/>' + smile(50, 68, 5) +
    '<path d="M20 62h18M22 70l16-4M80 62H62M78 70l-16-4" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round"/>';

  A.rabbit = '<ellipse cx="36" cy="24" rx="9" ry="22" fill="#f4f1ff"/><ellipse cx="64" cy="24" rx="9" ry="22" fill="#f4f1ff"/><ellipse cx="36" cy="24" rx="4.5" ry="15" fill="#ffb3c7"/><ellipse cx="64" cy="24" rx="4.5" ry="15" fill="#ffb3c7"/>' +
    '<ellipse cx="50" cy="62" rx="28" ry="26" fill="#f4f1ff" stroke="#d9d3ff" stroke-width="2"/>' + eyes(50, 56, 10) + cheeks(50, 66, 16) +
    '<path d="M46 66h8l-4 4z" fill="#ff5a8a"/><rect x="46" y="72" width="8" height="7" rx="2" fill="#fff" stroke="#d9d3ff"/>';

  A.bear = '<circle cx="24" cy="28" r="13" fill="#f2b33d"/><circle cx="76" cy="28" r="13" fill="#f2b33d"/><circle cx="24" cy="28" r="6" fill="#ffd98a"/><circle cx="76" cy="28" r="6" fill="#ffd98a"/>' +
    '<circle cx="50" cy="54" r="32" fill="#f2b33d"/>' + eyes(50, 46, 12) + '<ellipse cx="50" cy="64" rx="14" ry="11" fill="#ffe3a8"/><ellipse cx="50" cy="59" rx="6" ry="4" fill="' + INK + '"/>' + smile(50, 66, 5);

  A.tiger = '<circle cx="24" cy="28" r="11" fill="#ff8c1a"/><circle cx="76" cy="28" r="11" fill="#ff8c1a"/><circle cx="24" cy="28" r="5" fill="#fff"/><circle cx="76" cy="28" r="5" fill="#fff"/>' +
    '<circle cx="50" cy="54" r="32" fill="#ff8c1a"/><path d="M50 22v12M40 24l3 10M60 24l-3 10M18 50h12M18 60l12-3M82 50H70M82 60l-12-3" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
    '<ellipse cx="50" cy="66" rx="16" ry="12" fill="#fff"/>' + eyes(50, 48, 11) + '<path d="M45 60h10l-5 5z" fill="#ff5a8a"/>' + smile(50, 67, 6);

  A.cow = '<path d="M26 30q-10-12-4-20M74 30q10-12 4-20" stroke="#ffd23f" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="18" cy="42" rx="11" ry="6" fill="#fff" stroke="#e0dcf5" stroke-width="2"/><ellipse cx="82" cy="42" rx="11" ry="6" fill="#fff" stroke="#e0dcf5" stroke-width="2"/>' +
    '<ellipse cx="50" cy="50" rx="28" ry="30" fill="#fff" stroke="#e0dcf5" stroke-width="2"/><path d="M30 34q8-8 14 2-4 10-14 4z" fill="' + INK + '"/><circle cx="68" cy="40" r="6" fill="' + INK + '"/>' +
    eyes(50, 46, 11) + '<ellipse cx="50" cy="68" rx="20" ry="13" fill="#ffb3c7"/><ellipse cx="43" cy="68" rx="3" ry="4" fill="#e0607e"/><ellipse cx="57" cy="68" rx="3" ry="4" fill="#e0607e"/>';

  A.buffalo = '<path d="M30 34Q6 34 8 14q8 12 26 10M70 34q24 0 22-20-8 12-26 10" fill="#e9e4d0" stroke="#c9c2a8" stroke-width="2"/>' +
    '<ellipse cx="50" cy="54" rx="28" ry="30" fill="#7d8597"/><ellipse cx="22" cy="46" rx="9" ry="5" fill="#7d8597"/><ellipse cx="78" cy="46" rx="9" ry="5" fill="#7d8597"/>' +
    eyes(50, 48, 11) + '<ellipse cx="50" cy="70" rx="18" ry="12" fill="#a4abbb"/><circle cx="44" cy="70" r="3" fill="' + INK + '"/><circle cx="56" cy="70" r="3" fill="' + INK + '"/>';

  A.zebra = '<path d="M38 18l6 14M62 18l-6 14" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M38 18l6 14M62 18l-6 14" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M50 14v18" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/><ellipse cx="50" cy="56" rx="22" ry="32" fill="#fff" stroke="#e0dcf5" stroke-width="2"/>' +
    '<path d="M29 44h12M28 54h10M71 44H59M72 54H62M38 30l6 6M62 30l-6 6" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
    eyes(50, 50, 10) + '<ellipse cx="50" cy="76" rx="17" ry="12" fill="#c9c2ee"/><circle cx="44" cy="76" r="2.5" fill="' + INK + '"/><circle cx="56" cy="76" r="2.5" fill="' + INK + '"/>';

  A.horse = '<path d="M36 22l4 14M64 22l-4 14" stroke="#f4b860" stroke-width="9" stroke-linecap="round"/><path d="M40 14q10 6 20 0v16H40z" fill="#9b5de5"/>' +
    '<ellipse cx="50" cy="56" rx="22" ry="32" fill="#f4b860"/><path d="M42 26q8 10 16 0" fill="#9b5de5"/>' + eyes(50, 48, 10) +
    '<ellipse cx="50" cy="76" rx="17" ry="12" fill="#ffd9a3"/><circle cx="44" cy="76" r="2.5" fill="' + INK + '"/><circle cx="56" cy="76" r="2.5" fill="' + INK + '"/>' + smile(50, 82, 4);

  A.camel = '<ellipse cx="46" cy="60" rx="30" ry="16" fill="#f2c879"/><path d="M26 56q8-26 18-4q6-24 18 0z" fill="#f2c879"/>' +
    '<path d="M70 58q10-6 10-26" stroke="#f2c879" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="84" cy="30" rx="11" ry="8" fill="#f2c879"/>' +
    '<rect x="24" y="68" width="6" height="22" rx="3" fill="#e5b65d"/><rect x="36" y="70" width="6" height="20" rx="3" fill="#e5b65d"/><rect x="54" y="70" width="6" height="20" rx="3" fill="#e5b65d"/><rect x="64" y="68" width="6" height="22" rx="3" fill="#e5b65d"/>' +
    eye(84, 27, 3) + smile(88, 32, 3) + '<path d="M78 22l-2-5" stroke="#e5b65d" stroke-width="4" stroke-linecap="round"/><path d="M14 58q-6 6-2 12" stroke="#e5b65d" stroke-width="3" fill="none"/>';

  A.giraffe = '<path d="M40 92V44q0-14 12-22" stroke="#ffd23f" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="36" cy="60" r="4" fill="#ff9f1c"/><circle cx="44" cy="74" r="4.5" fill="#ff9f1c"/><circle cx="38" cy="84" r="3.5" fill="#ff9f1c"/><circle cx="46" cy="48" r="3.5" fill="#ff9f1c"/>' +
    '<ellipse cx="62" cy="24" rx="18" ry="12" fill="#ffd23f"/><path d="M56 13V4M66 13V4" stroke="#ff9f1c" stroke-width="3"/><circle cx="56" cy="4" r="3" fill="#ff9f1c"/><circle cx="66" cy="4" r="3" fill="#ff9f1c"/>' +
    eye(60, 21, 3.4) + '<ellipse cx="74" cy="28" rx="6" ry="5" fill="#ffe58a"/>' + smile(70, 30, 3) + '<ellipse cx="46" cy="18" rx="6" ry="3" fill="#ffd23f"/>';

  A.elephant = '<ellipse cx="22" cy="46" rx="20" ry="24" fill="#8fa8d8"/><ellipse cx="78" cy="46" rx="20" ry="24" fill="#8fa8d8"/><ellipse cx="22" cy="46" rx="12" ry="16" fill="#ffb3c7"/><ellipse cx="78" cy="46" rx="12" ry="16" fill="#ffb3c7"/>' +
    '<circle cx="50" cy="46" r="26" fill="#a3b9e6"/><path d="M50 58q0 18 0 22q0 10 10 8" stroke="#a3b9e6" stroke-width="12" fill="none" stroke-linecap="round"/>' +
    eyes(50, 42, 10) + cheeks(50, 52, 16) + '<path d="M38 62l-6 8M62 62l6 8" stroke="#fff" stroke-width="5" stroke-linecap="round"/>';
})(window.ART);

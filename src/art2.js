/* Inline SVG art — part 2: creatures & people. */
(function (A) {
  var h = A._h, INK = h.INK, eye = h.eye, eyes = h.eyes, smile = h.smile, cheeks = h.cheeks;

  A.fish = '<path d="M70 50l24-18v36z" fill="#ff7eb6"/><ellipse cx="46" cy="50" rx="32" ry="24" fill="#ff9f1c"/>' +
    '<path d="M40 28q10-14 22 0M40 72q10 12 20 0" fill="#ff7eb6"/><path d="M52 36q8 14 0 28M62 38q6 12 0 24" stroke="#ffd23f" stroke-width="4" fill="none"/>' +
    eye(30, 44, 5) + smile(30, 56, 5) + '<circle cx="12" cy="30" r="4" fill="none" stroke="#9fd8ff" stroke-width="2"/><circle cx="8" cy="18" r="2.5" fill="none" stroke="#9fd8ff" stroke-width="2"/>';

  A.snake = '<path d="M16 80q0-16 18-16h30q16 0 16-14T64 36H40q-14 0-14-12" stroke="#3ddc84" stroke-width="16" fill="none" stroke-linecap="round"/>' +
    '<path d="M24 80q0-8 10-8M50 64v0M70 50" stroke="#ffd23f" stroke-width="4" stroke-dasharray="4 10" fill="none"/><ellipse cx="30" cy="20" rx="16" ry="12" fill="#3ddc84"/>' +
    eyes(30, 17, 6, 3.5) + smile(30, 24, 5) + '<path d="M14 22H6l-3-3M6 22l-3 3" stroke="#ff5a5f" stroke-width="2.5" fill="none" stroke-linecap="round"/>';

  A.turtle = '<ellipse cx="24" cy="78" rx="8" ry="6" fill="#7ee0a0"/><ellipse cx="72" cy="78" rx="8" ry="6" fill="#7ee0a0"/><circle cx="86" cy="58" r="12" fill="#7ee0a0"/>' +
    '<path d="M12 70q2-46 38-46t36 46z" fill="#2ec4b6"/><path d="M30 46l10-10h16l10 10-6 14H36zM12 70h74" stroke="#1a8f86" stroke-width="3" fill="none"/>' +
    eye(88, 55, 3.4) + smile(88, 61, 4) + '<path d="M8 66l-6 4" stroke="#7ee0a0" stroke-width="5" stroke-linecap="round"/>';

  A.bird = '<ellipse cx="48" cy="56" rx="30" ry="26" fill="#4d96ff"/><path d="M30 54q16 20 32 0q-16 8-32 0z" fill="#9fd8ff"/>' +
    '<path d="M76 50l16 4-16 6z" fill="#ffd23f"/>' + eye(64, 46, 4.5) + '<path d="M40 22q6 6 4 14M48 20q2 8-2 14" stroke="#4d96ff" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<path d="M40 82v10M54 82v10M36 92h8M50 92h8" stroke="#ff9f1c" stroke-width="3" stroke-linecap="round"/><path d="M18 50L4 42l6 14z" fill="#3b7de0"/>';

  A.duck = '<path d="M10 90q40 10 80 0" stroke="#9fd8ff" stroke-width="4" fill="none"/><ellipse cx="46" cy="66" rx="34" ry="20" fill="#ffd23f"/>' +
    '<circle cx="66" cy="34" r="17" fill="#ffd23f"/><path d="M80 34q14-2 16 4-6 6-16 4z" fill="#ff9f1c"/>' + eye(68, 30, 4) + cheeks(66, 40, 8) +
    '<path d="M26 62q14 14 30 0" stroke="#f2b33d" stroke-width="4" fill="none" stroke-linecap="round"/>';

  A.chicken = '<path d="M40 22q4-12 10-4 4-10 10 0 6-6 6 6" fill="#ff5a5f"/><ellipse cx="50" cy="58" rx="30" ry="28" fill="#fff" stroke="#e8e2fb" stroke-width="2"/>' +
    '<path d="M78 46l12 5-12 5z" fill="#ff9f1c"/><path d="M76 58q4 8 0 12-5-3 0-12z" fill="#ff5a5f"/>' + eyes(56, 44, 9, 4) +
    '<path d="M22 56q10 12 22 6" stroke="#e8e2fb" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M42 86v8M58 86v8" stroke="#ff9f1c" stroke-width="4" stroke-linecap="round"/>';

  A.peacock = '';
  var cols = ['#2ec4b6', '#4d96ff', '#3ddc84', '#9b5de5', '#2ec4b6', '#4d96ff', '#3ddc84'];
  for (var i = 0; i < 7; i++) {
    var a = Math.PI + (i + .5) / 7 * Math.PI, x = 50 + Math.cos(a) * 34, y = 66 + Math.sin(a) * 34;
    A.peacock += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="10" ry="16" fill="' + cols[i] + '" transform="rotate(' + ((a * 180 / Math.PI) + 90).toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>' +
      '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.5" fill="#ffd23f"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2" fill="#1a3b8f"/>';
  }
  A.peacock += '<ellipse cx="50" cy="70" rx="13" ry="18" fill="#3b5fe0"/><circle cx="50" cy="44" r="10" fill="#3b5fe0"/><path d="M46 34l-2-8M50 34v-9M54 34l2-8" stroke="#3b5fe0" stroke-width="2"/>' +
    '<circle cx="44" cy="25" r="2.5" fill="#ffd23f"/><circle cx="50" cy="24" r="2.5" fill="#ffd23f"/><circle cx="56" cy="25" r="2.5" fill="#ffd23f"/>' + eyes(50, 43, 4, 2.5) + '<path d="M48 48h4l-2 4z" fill="#ff9f1c"/>';

  A.seahorse = '<path d="M50 20q20 0 20 18 0 14-12 20-8 6-6 16 2 10 12 10 8 0 8-8" stroke="#ff9f1c" stroke-width="16" fill="none" stroke-linecap="round"/>' +
    '<path d="M44 26L20 22l2 10z" fill="#ff9f1c"/><path d="M60 14l4-8 4 10 4-6 2 10" stroke="#ff7eb6" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M70 44q12 2 14 10-8 2-14-2z" fill="#ffd23f"/>' + eye(52, 26, 4) + '<circle cx="18" cy="60" r="4" fill="none" stroke="#9fd8ff" stroke-width="2"/><circle cx="24" cy="74" r="3" fill="none" stroke="#9fd8ff" stroke-width="2"/>';

  A.dolphin = '<path d="M10 66q14-40 54-36 22 2 28 14-10-2-16 2 4 10-6 18-28 18-60 2z" fill="#4d96ff"/><path d="M14 66q30 18 58 0-26 10-58 0z" fill="#cfe6ff"/>' +
    '<path d="M48 32l8-16 6 18z" fill="#3b7de0"/><path d="M12 64L2 56l4 14-4 12 12-10z" fill="#3b7de0"/>' + eye(70, 42, 3.5) + smile(80, 50, 4) +
    '<path d="M4 92q12-6 24 0t24 0 24 0 24 0" stroke="#9fd8ff" stroke-width="4" fill="none"/>';

  A.iguana = '<path d="M14 66q-10 10 4 20 20 8 34-4" stroke="#3ddc84" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="62" rx="26" ry="12" fill="#3ddc84"/>' +
    '<path d="M30 52l4-8 4 8 4-8 4 8 4-8 4 8 4-8 4 8" fill="#2aa866"/><ellipse cx="80" cy="54" rx="14" ry="10" fill="#3ddc84"/>' +
    '<path d="M34 72l-6 12M44 72l-2 12M60 72l4 12M68 70l8 10" stroke="#2aa866" stroke-width="5" stroke-linecap="round"/>' + eye(82, 50, 3.6) + smile(88, 57, 3) + '<circle cx="74" cy="62" r="4" fill="#ffd23f"/>';

  A.butterfly = '<path d="M50 50Q20 6 10 30q-6 18 40 20z" fill="#ff7eb6"/><path d="M50 50Q80 6 90 30q6 18-40 20z" fill="#9b5de5"/>' +
    '<path d="M50 52Q22 60 22 78q4 12 28-20z" fill="#ffd23f"/><path d="M50 52Q78 60 78 78q-4 12-28-20z" fill="#2ec4b6"/>' +
    '<circle cx="28" cy="32" r="6" fill="#fff" opacity=".6"/><circle cx="72" cy="32" r="6" fill="#fff" opacity=".6"/>' +
    '<ellipse cx="50" cy="56" rx="5" ry="22" fill="#5b3fa8"/><circle cx="50" cy="32" r="7" fill="#5b3fa8"/><path d="M47 26q-6-12-10-12M53 26q6-12 10-12" stroke="#5b3fa8" stroke-width="2.5" fill="none"/>' +
    '<circle cx="47" cy="31" r="1.6" fill="#fff"/><circle cx="53" cy="31" r="1.6" fill="#fff"/>';

  /* Friendly giant (ยักษ์) — bright green guardian with horns, a big smile and a crown. */
  A.giant = '<path d="M30 30l-8-20 16 12zM70 30l8-20-16 12z" fill="#ffd23f"/><path d="M34 22l8-12 8 10 8-10 8 12z" fill="#ff9f1c"/>' +
    '<rect x="22" y="22" width="56" height="62" rx="26" fill="#3ddc84"/>' + eyes(50, 46, 12, 6) +
    '<path d="M34 62q16 16 32 0z" fill="#fff" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M38 63l3 6 3-5M62 63l-3 6-3-5" fill="' + INK + '"/>' +
    cheeks(50, 58, 22) + '<rect x="30" y="82" width="12" height="12" rx="5" fill="#2aa866"/><rect x="58" y="82" width="12" height="12" rx="5" fill="#2aa866"/>';

  function person(skin, hair, shirt, extra) {
    return '<rect x="22" y="70" width="56" height="30" rx="20" fill="' + shirt + '"/><circle cx="50" cy="44" r="26" fill="' + skin + '"/>' + hair +
      eyes(50, 46, 10) + cheeks(50, 55, 16) + smile(50, 56, 7) + (extra || '');
  }
  A.mom = person('#ffd9b8', '<path d="M22 50q-6-34 28-34t28 34q-4 24 6 34H16q10-10 6-34z" fill="#ff7eb6" opacity="0"/><path d="M24 46q0-28 26-28t26 28q-8-16-26-16t-26 16z" fill="#e0605e"/><path d="M24 44q-6 22 0 40h8V48zM76 44q6 22 0 40h-8V48z" fill="#e0605e"/>', '#ff7eb6',
    '<path d="M38 18q12-8 24 0l-4 6H42z" fill="#ffd23f"/><circle cx="50" cy="16" r="3" fill="#ff5a8a"/>');
  A.dad = person('#f5c79a', '<path d="M24 42q0-26 26-26t26 26q-6-10-26-12-20 2-26 12z" fill="#5b3fa8"/>', '#4d96ff',
    '<path d="M38 64q12 8 24 0" stroke="#5b3fa8" stroke-width="0"/><rect x="34" y="40" width="14" height="10" rx="4" fill="none" stroke="' + INK + '" stroke-width="2"/><rect x="52" y="40" width="14" height="10" rx="4" fill="none" stroke="' + INK + '" stroke-width="2"/><path d="M48 44h4" stroke="' + INK + '" stroke-width="2"/>');
  A.child = person('#ffe0c2', '<path d="M26 40q4-24 24-24t24 24q-10-8-16-4-6-8-14 0-8-4-18 4z" fill="#ff9f1c"/><path d="M50 16q4-10 10-6" stroke="#ff9f1c" stroke-width="4" fill="none" stroke-linecap="round"/>', '#3ddc84',
    '<path d="M36 80l6 8M64 80l-6 8" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/>');
})(window.ART);

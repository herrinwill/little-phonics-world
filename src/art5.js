/* Inline SVG art — part 5: English pictures (queen, van, whale, fox, yo-yo, bus, frog). */
(function (A) {
  var h = A._h, INK = h.INK, eyes = h.eyes, smile = h.smile, face = h.face, cheeks = h.cheeks;

  A.queen = '<path d="M20 60q-4-34 30-36 34 2 30 36l4 30H16z" fill="#ff9f1c"/>' +
    '<circle cx="50" cy="56" r="25" fill="#ffd9b8"/>' + face(50, 54, 10) +
    '<path d="M26 34l4-24 10 14 10-18 10 18 10-14 4 24z" fill="#ffd23f" stroke="#ff9f1c" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle cx="50" cy="26" r="4" fill="#ff4d6d"/><circle cx="36" cy="28" r="3" fill="#4d96ff"/><circle cx="64" cy="28" r="3" fill="#3ddc84"/>' +
    '<path d="M30 84q20 12 40 0v12H30z" fill="#9b5de5"/>';

  A.van = '<path d="M8 72V34q0-8 8-8h46q8 0 14 8l14 18q4 4 4 10v10z" fill="#3ddc84"/>' +
    '<path d="M64 32h8l12 18H64z" fill="#cfefff"/><rect x="16" y="32" width="18" height="16" rx="3" fill="#cfefff"/><rect x="40" y="32" width="18" height="16" rx="3" fill="#cfefff"/>' +
    '<path d="M8 58h86" stroke="#fff" stroke-width="4"/><circle cx="90" cy="64" r="3" fill="#ffd23f"/>' +
    '<circle cx="28" cy="74" r="11" fill="' + INK + '"/><circle cx="28" cy="74" r="4.5" fill="#e0dcf5"/><circle cx="72" cy="74" r="11" fill="' + INK + '"/><circle cx="72" cy="74" r="4.5" fill="#e0dcf5"/>';

  A.whale = '<path d="M50 22q-2-12-8-14M50 22q2-12 10-12M50 22v-14" stroke="#4dc3ff" stroke-width="4" stroke-linecap="round" fill="none"/>' +
    '<path d="M8 58q0-30 40-30 36 0 40 26l8-14q4 18-6 26 2 4-4 4-10 22-46 20Q8 88 8 58z" fill="#4d96ff"/>' +
    '<path d="M14 66q30 16 70 0-8 18-36 18-26 0-34-18z" fill="#cfe3ff"/>' + h.eye(28, 52, 4.5) + smile(30, 62, 6) +
    '<circle cx="20" cy="60" r="4" fill="#ff8fab" opacity=".7"/>';

  A.fox = '<path d="M16 46L20 8l26 24zM84 46L80 8 54 32z" fill="#ff7a1c"/><path d="M22 36l2-18 12 12zM78 36l-2-18-12 12z" fill="#fff"/>' +
    '<path d="M14 40q36-20 72 0-4 26-36 46Q18 66 14 40z" fill="#ff8c1a"/>' +
    '<path d="M26 56q12 6 24 30 12-24 24-30-10-4-24 0-14-4-24 0z" fill="#fff"/>' + eyes(50, 46, 14, 4.5) +
    '<ellipse cx="50" cy="76" rx="5" ry="4" fill="' + INK + '"/>' + cheeks(50, 58, 24);

  A.yoyo = '<path d="M50 4v30" stroke="#7a6fb0" stroke-width="3"/><circle cx="50" cy="6" r="4" fill="none" stroke="#7a6fb0" stroke-width="3"/>' +
    '<circle cx="50" cy="62" r="34" fill="#ff5a8a"/><circle cx="50" cy="62" r="24" fill="#ffd23f"/>' +
    '<path d="M34 50a20 20 0 0 1 10-10" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>' + eyes(50, 56, 9, 3) + smile(50, 70, 5);

  A.bus = '<rect x="8" y="16" width="84" height="62" rx="12" fill="#ffd23f"/><rect x="8" y="16" width="84" height="10" rx="5" fill="#ff9f1c"/>' +
    [16, 36, 56].map(function (x) { return '<rect x="' + x + '" y="32" width="16" height="16" rx="3" fill="#cfefff"/>'; }).join('') +
    '<rect x="76" y="32" width="12" height="34" rx="3" fill="#9fd8ff"/><path d="M8 56h66" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="14" cy="66" r="3" fill="#fff"/><circle cx="26" cy="80" r="10" fill="' + INK + '"/><circle cx="26" cy="80" r="4" fill="#e0dcf5"/>' +
    '<circle cx="72" cy="80" r="10" fill="' + INK + '"/><circle cx="72" cy="80" r="4" fill="#e0dcf5"/>';

  A.frog = '<circle cx="30" cy="30" r="14" fill="#3ddc84"/><circle cx="70" cy="30" r="14" fill="#3ddc84"/>' +
    '<ellipse cx="50" cy="60" rx="40" ry="30" fill="#3ddc84"/><ellipse cx="50" cy="70" rx="26" ry="16" fill="#b8f5cf"/>' +
    '<circle cx="30" cy="30" r="8" fill="#fff"/><circle cx="70" cy="30" r="8" fill="#fff"/>' + h.eye(30, 31, 4.5) + h.eye(70, 31, 4.5) +
    '<path d="M30 56q20 16 40 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>' + cheeks(50, 52, 26);
})(window.ART);

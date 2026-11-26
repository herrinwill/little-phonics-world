/* Inline SVG art — part 3: things & nature. */
(function (A) {
  var h = A._h, INK = h.INK, eyes = h.eyes, smile = h.smile, face = h.face;

  A.house = '<path d="M10 50L50 14l40 36z" fill="#ff5a5f"/><rect x="20" y="48" width="60" height="44" rx="4" fill="#ffd23f"/><rect x="42" y="64" width="16" height="28" rx="8" fill="#9b5de5"/>' +
    '<rect x="26" y="56" width="12" height="12" rx="2" fill="#9fd8ff"/><rect x="62" y="56" width="12" height="12" rx="2" fill="#9fd8ff"/><rect x="66" y="22" width="9" height="18" fill="#ff9f1c"/><circle cx="54" cy="79" r="1.8" fill="#ffd23f"/>';
  A.mountain = '<circle cx="78" cy="22" r="10" fill="#ffd23f"/><path d="M4 90L38 26l22 38 10-14 26 40z" fill="#7b8cde"/><path d="M38 26l-10 18 6-2 4 6 5-6 6 4z" fill="#fff"/><path d="M0 90h100v10H0z" fill="#3ddc84"/>';
  A.rose = '<path d="M50 54v40" stroke="#2aa866" stroke-width="5"/><path d="M50 76q-16-2-18-14 14 0 18 14zM50 70q14-4 18-14-14 0-18 14z" fill="#3ddc84"/>' +
    '<circle cx="50" cy="36" r="22" fill="#ff4d6d"/><path d="M50 22q12 4 8 16-6 8-14 2-4-8 6-10" stroke="#c9184a" stroke-width="3" fill="none"/><path d="M34 30q4 18 18 22M66 28q0 18-14 24" stroke="#c9184a" stroke-width="2.5" fill="none"/>';
  A.flower = '<path d="M50 56v38" stroke="#2aa866" stroke-width="5"/><path d="M50 80q-16-2-18-14 14 0 18 14z" fill="#3ddc84"/>' +
    [0, 72, 144, 216, 288].map(function (d) { return '<ellipse cx="50" cy="22" rx="11" ry="16" fill="#ff7eb6" transform="rotate(' + d + ' 50 38)"/>'; }).join('') +
    '<circle cx="50" cy="38" r="12" fill="#ffd23f"/>' + eyes(50, 36, 4, 2) + smile(50, 41, 3);
  A.sun = (function () { var r = ''; for (var i = 0; i < 12; i++) r += '<rect x="47" y="2" width="6" height="16" rx="3" fill="#ff9f1c" transform="rotate(' + (i * 30) + ' 50 50)"/>'; return r; })() +
    '<circle cx="50" cy="50" r="28" fill="#ffd23f"/>' + face(50, 46, 10);
  A.moon = '<path d="M62 10a40 40 0 1 0 28 62A32 32 0 0 1 62 10z" fill="#ffe066"/>' + h.eye(36, 46, 4) + h.eye(52, 50, 4) + smile(44, 60, 6) +
    '<path d="M80 18l2 5 5 1-5 2-2 5-2-5-5-2 5-1z" fill="#ffd23f"/><circle cx="88" cy="40" r="2.5" fill="#ffd23f"/>';
  A.star = '<path d="M50 6l13 28 30 3-23 20 7 30-27-16-27 16 7-30-23-20 30-3z" fill="#ffd23f" stroke="#ff9f1c" stroke-width="4" stroke-linejoin="round"/>' + face(50, 50, 9);
  A.ball = '<circle cx="50" cy="52" r="38" fill="#4d96ff"/><path d="M12 52h76" stroke="#fff" stroke-width="8"/><path d="M50 14a38 38 0 0 1 0 76" fill="#ff5a5f" opacity=".0"/>' +
    '<path d="M26 22a38 38 0 0 0 0 60" stroke="#ffd23f" stroke-width="8" fill="none"/><path d="M74 22a38 38 0 0 1 0 60" stroke="#ff5a5f" stroke-width="8" fill="none"/><circle cx="36" cy="32" r="6" fill="#fff" opacity=".6"/>';
  A.heart = '<path d="M50 88S10 62 10 36a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 26-40 52-40 52z" fill="#ff4d6d"/>' + face(50, 46, 10) + '<ellipse cx="28" cy="32" rx="5" ry="8" fill="#fff" opacity=".5"/>';
  A.car = '<path d="M8 62q0-12 12-12h8l12-16h26l14 16h6q8 0 8 12v8H8z" fill="#ff5a5f"/><path d="M34 48l8-10h10v10zM58 48V38h6l9 10z" fill="#9fd8ff"/>' +
    '<circle cx="28" cy="72" r="11" fill="' + INK + '"/><circle cx="72" cy="72" r="11" fill="' + INK + '"/><circle cx="28" cy="72" r="4" fill="#ddd"/><circle cx="72" cy="72" r="4" fill="#ddd"/><circle cx="88" cy="58" r="3" fill="#ffd23f"/>';
  A.train = '<rect x="8" y="40" width="50" height="34" rx="6" fill="#4d96ff"/><rect x="40" y="22" width="22" height="52" rx="5" fill="#ff5a5f"/><rect x="45" y="28" width="12" height="12" rx="2" fill="#9fd8ff"/>' +
    '<path d="M62 50h22l8 24H62z" fill="#ffd23f"/><rect x="14" y="20" width="10" height="20" fill="' + INK + '"/><circle cx="18" cy="12" r="6" fill="#e0e0f5"/><circle cx="28" cy="6" r="4" fill="#e0e0f5"/>' +
    '<circle cx="22" cy="80" r="9" fill="' + INK + '"/><circle cx="50" cy="80" r="9" fill="' + INK + '"/><circle cx="76" cy="80" r="9" fill="' + INK + '"/>';
  A.tree = '<rect x="43" y="56" width="14" height="36" rx="5" fill="#d9a066"/><circle cx="50" cy="38" r="28" fill="#3ddc84"/><circle cx="30" cy="50" r="16" fill="#2fcf78"/><circle cx="70" cy="50" r="16" fill="#2fcf78"/>' +
    '<circle cx="38" cy="32" r="4" fill="#ff5a5f"/><circle cx="62" cy="40" r="4" fill="#ff5a5f"/><circle cx="50" cy="22" r="4" fill="#ff5a5f"/>';
  A.apple = '<path d="M50 28q-6-14 4-20" stroke="#2aa866" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M54 22q14-12 24 0-12 8-24 0z" fill="#3ddc84"/>' +
    '<path d="M50 30c-14-10-40-6-40 22 0 24 18 42 30 40 6-1 8-3 10-3s4 2 10 3c12 2 30-16 30-40 0-28-26-32-40-22z" fill="#ff4d4d"/>' + face(50, 52, 10) + '<ellipse cx="28" cy="44" rx="5" ry="9" fill="#fff" opacity=".5"/>';
  A.boat = '<path d="M50 12v52" stroke="' + INK + '" stroke-width="3"/><path d="M52 14l30 44H52z" fill="#fff" stroke="#e0dcf5" stroke-width="2"/><path d="M48 22L24 58h24z" fill="#ffd23f"/>' +
    '<path d="M8 64h84l-12 20H20z" fill="#ff5a5f"/><path d="M0 88q12-6 25 0t25 0 25 0 25 0v12H0z" fill="#4d96ff"/>';
  A.sea = '<rect width="100" height="100" rx="20" fill="#cfefff"/><circle cx="78" cy="24" r="10" fill="#ffd23f"/>' +
    '<path d="M0 50q12-10 25 0t25 0 25 0 25 0v50H0z" fill="#4d96ff"/><path d="M0 68q12-10 25 0t25 0 25 0 25 0v32H0z" fill="#2e7bea"/><path d="M0 84q12-8 25 0t25 0 25 0 25 0v16H0z" fill="#1a5fc9"/>';
  A.water = '<path d="M50 8C38 32 22 46 22 64a28 28 0 0 0 56 0c0-18-16-32-28-56z" fill="#4dc3ff"/>' + face(50, 64, 9) + '<ellipse cx="36" cy="56" rx="4" ry="8" fill="#fff" opacity=".6"/>';
  A.log = '<rect x="10" y="36" width="70" height="36" rx="8" fill="#e5a964"/><path d="M20 46h30M30 60h40" stroke="#c98b4a" stroke-width="3" stroke-linecap="round"/>' +
    '<ellipse cx="80" cy="54" rx="12" ry="18" fill="#ffd9a3"/><ellipse cx="80" cy="54" rx="7" ry="11" fill="none" stroke="#e5a964" stroke-width="2.5"/><ellipse cx="80" cy="54" rx="2.5" ry="4" fill="#e5a964"/>' +
    '<path d="M36 36q0-14 12-14" stroke="#2aa866" stroke-width="3" fill="none"/><ellipse cx="50" cy="20" rx="6" ry="4" fill="#3ddc84"/>';
  A.umbrella = '<path d="M50 50v30q0 10-10 10t-10-8" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M6 52a44 40 0 0 1 88 0q-7-8-14 0-8-8-15 0-7-8-15 0-7-8-15 0-7-8-15 0-7-8-14 0z" fill="#9b5de5"/><path d="M50 12q-14 20-15 40M50 12q14 20 15 40" stroke="#ff7eb6" stroke-width="4" fill="none"/>' +
    '<path d="M20 14l-2 6M80 14l2 6M30 4l-2 6" stroke="#4dc3ff" stroke-width="3" stroke-linecap="round"/>';
  A.clock = '<circle cx="22" cy="18" r="12" fill="#ffd23f"/><circle cx="78" cy="18" r="12" fill="#ffd23f"/><circle cx="50" cy="54" r="38" fill="#ff5a5f"/><circle cx="50" cy="54" r="30" fill="#fff"/>' +
    '<path d="M50 54V34M50 54l14 8" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="54" r="4" fill="' + INK + '"/>' +
    [0, 90, 180, 270].map(function (d) { return '<rect x="48" y="27" width="4" height="7" rx="2" fill="#9b5de5" transform="rotate(' + d + ' 50 54)"/>'; }).join('');
  A.cheese = '<path d="M8 70l76-40 8 14v34H8z" fill="#ffd23f"/><path d="M8 70h84v8H8z" fill="#f2b33d"/><path d="M8 70l76-40 8 14z" fill="#ffe680"/>' +
    '<circle cx="30" cy="62" r="5" fill="#f2b33d"/><circle cx="66" cy="54" r="6" fill="#f2b33d"/><circle cx="80" cy="66" r="4" fill="#f2b33d"/>' + eyes(46, 60, 7, 3) + smile(46, 66, 4);
  A.submarine = '<path d="M0 80q12-6 25 0t25 0 25 0 25 0" stroke="#9fd8ff" stroke-width="3" fill="none"/><rect x="40" y="22" width="18" height="18" rx="4" fill="#ff9f1c"/><path d="M50 22V10h10" stroke="' + INK + '" stroke-width="3" fill="none"/>' +
    '<ellipse cx="48" cy="54" rx="40" ry="20" fill="#ffd23f"/><circle cx="32" cy="54" r="7" fill="#9fd8ff" stroke="#ff9f1c" stroke-width="3"/><circle cx="52" cy="54" r="7" fill="#9fd8ff" stroke="#ff9f1c" stroke-width="3"/>' +
    '<path d="M88 46l10-8v32l-10-8z" fill="#ff9f1c"/><circle cx="20" cy="30" r="3" fill="none" stroke="#9fd8ff" stroke-width="2"/>';
  A.egg = '<ellipse cx="50" cy="56" rx="30" ry="38" fill="#fff8e7" stroke="#f2e2b8" stroke-width="3"/>' + face(50, 58, 10) + '<ellipse cx="36" cy="38" rx="5" ry="9" fill="#fff" />';
  A.plate = '<ellipse cx="50" cy="58" rx="44" ry="30" fill="#fff" stroke="#c9c2ee" stroke-width="3"/><ellipse cx="50" cy="58" rx="30" ry="19" fill="none" stroke="#9fd8ff" stroke-width="4"/>' +
    '<circle cx="42" cy="54" r="7" fill="#ff5a5f"/><ellipse cx="58" cy="58" rx="9" ry="6" fill="#3ddc84"/><circle cx="50" cy="64" r="5" fill="#ffd23f"/>';
  A.leaf = '<path d="M20 84Q14 30 80 14q8 56-60 70z" fill="#3ddc84"/><path d="M20 84Q46 50 72 24" stroke="#2aa866" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 60l-4-14M52 48l-2-14M40 60l14 2M52 48l14 0" stroke="#2aa866" stroke-width="3" stroke-linecap="round"/>';
  /* พาน — footed offering tray with flowers */
  A.tray = '<path d="M14 46h72l-8 12H22z" fill="#ffd23f"/><rect x="42" y="58" width="16" height="16" fill="#f2b33d"/><path d="M26 84l12-12h24l12 12z" fill="#ffd23f"/>' +
    '<path d="M30 46q20-40 40 0z" fill="#ff7eb6"/><circle cx="40" cy="36" r="5" fill="#fff"/><circle cx="52" cy="28" r="5" fill="#fff"/><circle cx="60" cy="38" r="5" fill="#fff"/><circle cx="50" cy="16" r="5" fill="#ffd23f"/>';
  A.tooth = '<path d="M24 26q0-16 16-16 6 0 10 4 4-4 10-4 16 0 16 16 0 16-6 30-4 30-12 30t-8-16q-2-4-4 0 0 16-8 16t-12-30q-6-14-6-30z" fill="#fff" stroke="#c9c2ee" stroke-width="3"/>' + face(50, 34, 9) + '<path d="M70 18l3 3M76 12l2 6" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>';
  A.ring = '<circle cx="50" cy="62" r="28" fill="none" stroke="#ffd23f" stroke-width="10"/><path d="M36 26l14-16 14 16-14 14z" fill="#7fdcff" stroke="#4d96ff" stroke-width="3"/>' +
    '<path d="M18 20l2 5 5 1-5 2-2 5-2-5-5-2 5-1zM82 30l2 4 4 1-4 2-2 4-2-4-4-2 4-1z" fill="#ff7eb6"/>';
  A.chest = '<path d="M12 46q0-26 38-26t38 26z" fill="#ff5a5f"/><rect x="12" y="46" width="76" height="40" rx="4" fill="#ff7a5f"/><path d="M12 46h76" stroke="#ffd23f" stroke-width="6"/>' +
    '<path d="M28 22v64M72 22v64" stroke="#ffd23f" stroke-width="6"/><rect x="42" y="42" width="16" height="18" rx="4" fill="#ffd23f"/><circle cx="50" cy="51" r="3" fill="' + INK + '"/>' +
    '<path d="M50 6l2 5 5 1-5 2-2 5-2-5-5-2 5-1z" fill="#ffd23f"/>';
  A.basin = '<ellipse cx="50" cy="46" rx="42" ry="12" fill="#2e7bea"/><path d="M8 46q4 40 42 40t42-40" fill="#4d96ff"/><ellipse cx="50" cy="46" rx="34" ry="8" fill="#9fd8ff"/>' +
    '<circle cx="36" cy="30" r="6" fill="none" stroke="#9fd8ff" stroke-width="2.5"/><circle cx="58" cy="22" r="8" fill="none" stroke="#9fd8ff" stroke-width="2.5"/><circle cx="70" cy="34" r="4" fill="none" stroke="#9fd8ff" stroke-width="2.5"/>' + eyes(50, 64, 10, 3.5) + smile(50, 72, 5);
  A.mango = '<path d="M60 14q4-8 12-8" stroke="#2aa866" stroke-width="4" fill="none"/><path d="M62 14q16-6 22 6-14 4-22-6z" fill="#3ddc84"/>' +
    '<path d="M60 16C30 14 12 40 18 66s40 30 56 10 14-58-14-60z" fill="#ffb627"/><path d="M60 16C76 20 86 40 74 76" stroke="#ff7a1c" stroke-width="0" fill="#ff9f1c" opacity=".5"/>' + face(46, 52, 9);
  A.watermelon = '<path d="M6 40a44 44 0 0 0 88 0z" fill="#3ddc84"/><path d="M12 40a38 38 0 0 0 76 0z" fill="#fff"/><path d="M16 40a34 34 0 0 0 68 0z" fill="#ff4d6d"/>' +
    '<ellipse cx="34" cy="52" rx="2.5" ry="4" fill="' + INK + '"/><ellipse cx="50" cy="62" rx="2.5" ry="4" fill="' + INK + '"/><ellipse cx="66" cy="52" rx="2.5" ry="4" fill="' + INK + '"/><ellipse cx="42" cy="66" rx="2" ry="3.5" fill="' + INK + '"/><ellipse cx="58" cy="66" rx="2" ry="3.5" fill="' + INK + '"/>';
  A.cloud = '<path d="M24 78a18 18 0 0 1 0-36 24 24 0 0 1 46-6 20 20 0 0 1 8 42z" fill="#fff" stroke="#bfe0ff" stroke-width="3"/>' + face(50, 56, 10) +
    '<path d="M30 86l-3 8M50 86l-3 8M70 86l-3 8" stroke="#4dc3ff" stroke-width="3" stroke-linecap="round"/>';
  A.grapes = '<path d="M50 20q0-10 8-14" stroke="#2aa866" stroke-width="4" fill="none"/><path d="M52 16q18-10 26 2-14 6-26-2z" fill="#3ddc84"/>' +
    [[38, 30], [54, 30], [70, 30], [30, 46], [46, 46], [62, 46], [38, 62], [54, 62], [46, 78]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="#9b5de5"/><circle cx="' + (p[0] - 3) + '" cy="' + (p[1] - 3) + '" r="3" fill="#fff" opacity=".5"/>'; }).join('');
  A.shoe = '<path d="M10 70V40q0-8 8-8h18q4 14 20 16l26 6q12 4 12 16H10z" fill="#ff5a5f"/><path d="M8 70h86v10H8z" fill="#fff" stroke="#e0dcf5" stroke-width="2" rx="4"/>' +
    '<path d="M38 40l8 8M44 36l8 8M50 34l8 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="50" r="5" fill="#ffd23f"/>';
})(window.ART);

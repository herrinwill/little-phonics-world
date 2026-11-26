/* Inline SVG art — part 4: English alphabet pictures (goat, hat, igloo, jam, kite, nest, octopus, pig). */
(function (A) {
  var h = A._h, INK = h.INK, eyes = h.eyes, smile = h.smile, face = h.face, cheeks = h.cheeks;

  A.goat = '<path d="M34 24q-10-16-22-14 8 6 14 18zM66 24q10-16 22-14-8 6-14 18z" fill="#c9c3ef"/>' +
    '<ellipse cx="20" cy="44" rx="12" ry="6" fill="#f2efff" transform="rotate(-20 20 44)"/><ellipse cx="80" cy="44" rx="12" ry="6" fill="#f2efff" transform="rotate(20 80 44)"/>' +
    '<path d="M28 34q22-14 44 0v30q-22 20-44 0z" fill="#ffffff" stroke="#e0dcf5" stroke-width="3"/>' + eyes(50, 46, 10, 4.5) +
    '<ellipse cx="50" cy="62" rx="10" ry="7" fill="#ffd1dc"/><circle cx="46" cy="61" r="1.8" fill="' + INK + '"/><circle cx="54" cy="61" r="1.8" fill="' + INK + '"/>' +
    '<path d="M44 80q6 14 12 0" fill="#f2efff" stroke="#e0dcf5" stroke-width="2"/>' + cheeks(50, 54, 17);

  A.hat = '<ellipse cx="50" cy="74" rx="44" ry="12" fill="#4d96ff"/><path d="M26 72V36q0-16 24-16t24 16v36z" fill="#4d96ff"/>' +
    '<path d="M26 58h48v12H26z" fill="#ff5a8a"/><circle cx="64" cy="64" r="5" fill="#ffd23f"/><ellipse cx="38" cy="36" rx="5" ry="9" fill="#fff" opacity=".35"/>';

  A.igloo = '<path d="M8 84a42 42 0 0 1 84 0z" fill="#eaf6ff" stroke="#9fd8ff" stroke-width="3"/>' +
    '<path d="M16 66h68M12 76h76M30 48h40M22 56h56M50 42v14M36 56v10M64 56v10M28 66v10M50 66v10M72 66v10" stroke="#9fd8ff" stroke-width="2.5"/>' +
    '<path d="M36 84v-10a14 14 0 0 1 28 0v10z" fill="#4d96ff"/><path d="M0 84h100v12H0z" fill="#fff" stroke="#cfefff" stroke-width="2"/>' +
    '<path d="M82 14l2 5 5 1-5 2-2 5-2-5-5-2 5-1z" fill="#ffd23f"/>';

  A.jam = '<rect x="26" y="20" width="48" height="14" rx="5" fill="#ff9f1c"/><path d="M24 34h52v-6H24z" fill="#ffd23f"/>' +
    '<path d="M24 34q-6 0-6 10v36q0 12 12 12h40q12 0 12-12V44q0-10-6-10z" fill="#ff4d6d"/>' +
    '<rect x="30" y="50" width="40" height="26" rx="8" fill="#fff"/><path d="M50 72s-12-7-12-14a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 7-12 14-12 14z" fill="#ff4d6d"/>' +
    '<ellipse cx="28" cy="52" rx="3" ry="10" fill="#fff" opacity=".45"/>';

  A.kite = '<path d="M50 6L82 40 50 74 18 40z" fill="#ff5a8a"/><path d="M50 6v68M18 40h64" stroke="#fff" stroke-width="3"/>' +
    '<path d="M50 6L82 40H50z" fill="#ffd23f"/><path d="M50 74L18 40h32z" fill="#4d96ff"/>' + eyes(50, 34, 9, 3.5) + smile(50, 46, 5) +
    '<path d="M50 74q-8 8 0 14t-4 12" stroke="#7a6fb0" stroke-width="2.5" fill="none"/>' +
    '<path d="M44 82l6 4-6 4zM56 90l-6 4 6 4z" fill="#3ddc84"/>';

  A.nest = '<ellipse cx="38" cy="56" rx="10" ry="12" fill="#cfefff"/><ellipse cx="62" cy="56" rx="10" ry="12" fill="#9fd8ff"/><ellipse cx="50" cy="52" rx="10" ry="12" fill="#e8f7ff"/>' +
    '<path d="M10 58q40 12 80 0-4 30-40 30T10 58z" fill="#e8a33d"/>' +
    '<path d="M14 64q36 10 72 0M18 72q32 9 64 0M26 80q24 6 48 0" stroke="#f7c873" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M12 58l-6-6M88 58l6-6M20 62l-8 2M80 62l8 2" stroke="#e8a33d" stroke-width="3" stroke-linecap="round"/>';

  A.octopus = [18, 32, 46, 60, 74].map(function (x, i) {
    return '<path d="M' + (x + 4) + ' 60q-6 18 ' + (i % 2 ? 6 : -6) + ' 30" stroke="#9b5de5" stroke-width="9" fill="none" stroke-linecap="round"/>';
  }).join('') +
    '<ellipse cx="50" cy="42" rx="32" ry="30" fill="#b388ff"/><ellipse cx="38" cy="26" rx="6" ry="9" fill="#fff" opacity=".35"/>' + face(50, 46, 11);

  A.pig = '<path d="M24 32L18 12l20 12zM76 32l6-20-20 12z" fill="#ff8fab"/>' +
    '<circle cx="50" cy="52" r="34" fill="#ffb3c7"/>' + eyes(50, 42, 13, 4.5) +
    '<ellipse cx="50" cy="60" rx="14" ry="10" fill="#ff8fab"/><ellipse cx="45" cy="60" rx="3" ry="4" fill="#d9486f"/><ellipse cx="55" cy="60" rx="3" ry="4" fill="#d9486f"/>' +
    smile(50, 74, 6) + cheeks(50, 56, 24);
})(window.ART);

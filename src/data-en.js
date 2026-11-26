/* American English — the default language. Short-vowel phonics, A–Z with a picture word each. */
window.LPW_DATA = window.LPW_DATA || {};
window.LPW_DATA.en = {
  code: 'en', name: 'English', en: 'English', glyph: 'Aa', color: '#7c5cff', dir: 'ltr',
  speech: ['en-US', 'en'], hello: 'Hi there!', helloTr: 'Hi there!',
  letters: [
    { ch: 'Aa', name: 'A', nameTr: 'A (ay)', snd: '/a/ as in apple',      word: 'apple',    tr: 'AP-ul',     en: 'apple',    pic: 'apple' },
    { ch: 'Bb', name: 'B', nameTr: 'B (bee)', snd: '/b/ as in bear',      word: 'bear',     tr: 'bair',      en: 'bear',     pic: 'bear' },
    { ch: 'Cc', name: 'C', nameTr: 'C (see)', snd: '/k/ as in cat',       word: 'cat',      tr: 'kat',       en: 'cat',      pic: 'cat' },
    { ch: 'Dd', name: 'D', nameTr: 'D (dee)', snd: '/d/ as in dog',       word: 'dog',      tr: 'dawg',      en: 'dog',      pic: 'dog' },
    { ch: 'Ee', name: 'E', nameTr: 'E (ee)', snd: '/e/ as in elephant',   word: 'elephant', tr: 'EL-uh-funt', en: 'elephant', pic: 'elephant' },
    { ch: 'Ff', name: 'F', nameTr: 'F (eff)', snd: '/f/ as in fish',      word: 'fish',     tr: 'fish',      en: 'fish',     pic: 'fish' },
    { ch: 'Gg', name: 'G', nameTr: 'G (jee)', snd: '/g/ as in goat',      word: 'goat',     tr: 'goht',      en: 'goat',     pic: 'goat' },
    { ch: 'Hh', name: 'H', nameTr: 'H (aych)', snd: '/h/ as in hat',      word: 'hat',      tr: 'hat',       en: 'hat',      pic: 'hat' },
    { ch: 'Ii', name: 'I', nameTr: 'I (eye)', snd: '/i/ as in igloo',     word: 'igloo',    tr: 'IG-loo',    en: 'igloo',    pic: 'igloo' },
    { ch: 'Jj', name: 'J', nameTr: 'J (jay)', snd: '/j/ as in jam',       word: 'jam',      tr: 'jam',       en: 'jam',      pic: 'jam' },
    { ch: 'Kk', name: 'K', nameTr: 'K (kay)', snd: '/k/ as in kite',      word: 'kite',     tr: 'kyte',      en: 'kite',     pic: 'kite' },
    { ch: 'Ll', name: 'L', nameTr: 'L (ell)', snd: '/l/ as in lion',      word: 'lion',     tr: 'LY-un',     en: 'lion',     pic: 'lion' },
    { ch: 'Mm', name: 'M', nameTr: 'M (em)', snd: '/m/ as in moon',       word: 'moon',     tr: 'moon',      en: 'moon',     pic: 'moon' },
    { ch: 'Nn', name: 'N', nameTr: 'N (en)', snd: '/n/ as in nest',       word: 'nest',     tr: 'nest',      en: 'nest',     pic: 'nest' },
    { ch: 'Oo', name: 'O', nameTr: 'O (oh)', snd: '/o/ as in octopus',    word: 'octopus',  tr: 'OK-tuh-pus', en: 'octopus', pic: 'octopus' },
    { ch: 'Pp', name: 'P', nameTr: 'P (pee)', snd: '/p/ as in pig',       word: 'pig',      tr: 'pig',       en: 'pig',      pic: 'pig' },
    { ch: 'Qq', name: 'Q', nameTr: 'Q (kyoo)', snd: '/kw/ as in queen',   word: 'queen',    tr: 'kween',     en: 'queen',    pic: 'queen' },
    { ch: 'Rr', name: 'R', nameTr: 'R (ar)', snd: '/r/ as in rabbit',     word: 'rabbit',   tr: 'RAB-it',    en: 'rabbit',   pic: 'rabbit' },
    { ch: 'Ss', name: 'S', nameTr: 'S (ess)', snd: '/s/ as in sun',       word: 'sun',      tr: 'sun',       en: 'sun',      pic: 'sun' },
    { ch: 'Tt', name: 'T', nameTr: 'T (tee)', snd: '/t/ as in turtle',    word: 'turtle',   tr: 'TUR-tul',   en: 'turtle',   pic: 'turtle' },
    { ch: 'Uu', name: 'U', nameTr: 'U (yoo)', snd: '/u/ as in umbrella',  word: 'umbrella', tr: 'um-BREL-uh', en: 'umbrella', pic: 'umbrella' },
    { ch: 'Vv', name: 'V', nameTr: 'V (vee)', snd: '/v/ as in van',       word: 'van',      tr: 'van',       en: 'van',      pic: 'van' },
    { ch: 'Ww', name: 'W', nameTr: 'W (DUB-ul-yoo)', snd: '/w/ as in whale', word: 'whale', tr: 'wayl',      en: 'whale',    pic: 'whale' },
    { ch: 'Xx', name: 'X', nameTr: 'X (ex)', snd: '/ks/ as in fox',       word: 'fox',      tr: 'foks',      en: 'fox',      pic: 'fox' },
    { ch: 'Yy', name: 'Y', nameTr: 'Y (why)', snd: '/y/ as in yo-yo',     word: 'yo-yo',    tr: 'YOH-yoh',   en: 'yo-yo',    pic: 'yoyo' },
    { ch: 'Zz', name: 'Z', nameTr: 'Z (zee)', snd: '/z/ as in zebra',     word: 'zebra',    tr: 'ZEE-bruh',  en: 'zebra',    pic: 'zebra' }
  ],
  /* syl = the sounds spoken when the word is finished (c-a-t … cat). */
  words: [
    { w: 'cat',  tiles: ['c', 'a', 't'],      syl: ['kuh', 'aah', 'tuh'],        sylTr: 'c - a - t',     tr: 'cat',  en: 'cat',  pic: 'cat' },
    { w: 'dog',  tiles: ['d', 'o', 'g'],      syl: ['duh', 'aw', 'guh'],         sylTr: 'd - o - g',     tr: 'dog',  en: 'dog',  pic: 'dog' },
    { w: 'sun',  tiles: ['s', 'u', 'n'],      syl: ['sss', 'uh', 'nnn'],         sylTr: 's - u - n',     tr: 'sun',  en: 'sun',  pic: 'sun' },
    { w: 'pig',  tiles: ['p', 'i', 'g'],      syl: ['puh', 'ih', 'guh'],         sylTr: 'p - i - g',     tr: 'pig',  en: 'pig',  pic: 'pig' },
    { w: 'hat',  tiles: ['h', 'a', 't'],      syl: ['huh', 'aah', 'tuh'],        sylTr: 'h - a - t',     tr: 'hat',  en: 'hat',  pic: 'hat' },
    { w: 'bus',  tiles: ['b', 'u', 's'],      syl: ['buh', 'uh', 'sss'],         sylTr: 'b - u - s',     tr: 'bus',  en: 'bus',  pic: 'bus' },
    { w: 'fox',  tiles: ['f', 'o', 'x'],      syl: ['fff', 'aw', 'ks'],          sylTr: 'f - o - x',     tr: 'fox',  en: 'fox',  pic: 'fox' },
    { w: 'mom',  tiles: ['m', 'o', 'm'],      syl: ['mmm', 'aw', 'mmm'],         sylTr: 'm - o - m',     tr: 'mom',  en: 'mom',  pic: 'mom' },
    { w: 'dad',  tiles: ['d', 'a', 'd'],      syl: ['duh', 'aah', 'duh'],        sylTr: 'd - a - d',     tr: 'dad',  en: 'dad',  pic: 'dad' },
    { w: 'frog', tiles: ['f', 'r', 'o', 'g'], syl: ['fff', 'rrr', 'aw', 'guh'],  sylTr: 'f - r - o - g', tr: 'frog', en: 'frog', pic: 'frog' }
  ],
  /* Tiles say a sound-friendly name (the letter's sound), not the alphabet name. */
  tileSay: {
    a: 'aah', b: 'buh', c: 'kuh', d: 'duh', e: 'eh', f: 'fff', g: 'guh', h: 'huh', i: 'ih', j: 'juh', k: 'kuh', l: 'lll', m: 'mmm',
    n: 'nnn', o: 'aw', p: 'puh', q: 'kwuh', r: 'rrr', s: 'sss', t: 'tuh', u: 'uh', v: 'vvv', w: 'wuh', x: 'ks', y: 'yuh', z: 'zzz'
  },
  tileTr: {
    a: '/a/', b: '/b/', c: '/k/', d: '/d/', e: '/e/', f: '/f/', g: '/g/', h: '/h/', i: '/i/', j: '/j/', k: '/k/', l: '/l/', m: '/m/',
    n: '/n/', o: '/o/', p: '/p/', q: '/kw/', r: '/r/', s: '/s/', t: '/t/', u: '/u/', v: '/v/', w: '/w/', x: '/ks/', y: '/y/', z: '/z/'
  },
  numbers: [
    { w: 'one', tr: 'one' }, { w: 'two', tr: 'two' }, { w: 'three', tr: 'three' }, { w: 'four', tr: 'four' }, { w: 'five', tr: 'five' },
    { w: 'six', tr: 'six' }, { w: 'seven', tr: 'seven' }, { w: 'eight', tr: 'eight' }, { w: 'nine', tr: 'nine' }, { w: 'ten', tr: 'ten' }
  ],
  colors: [
    { w: 'red', tr: 'red', en: 'red', hex: '#ff4d4d' },
    { w: 'orange', tr: 'orange', en: 'orange', hex: '#ff9f1c' },
    { w: 'yellow', tr: 'yellow', en: 'yellow', hex: '#ffd23f' },
    { w: 'green', tr: 'green', en: 'green', hex: '#3ddc84' },
    { w: 'blue', tr: 'blue', en: 'blue', hex: '#4d96ff' },
    { w: 'purple', tr: 'purple', en: 'purple', hex: '#9b5de5' },
    { w: 'pink', tr: 'pink', en: 'pink', hex: '#ff7eb6' }
  ],
  animals: [
    { w: 'dog', tr: 'dog', en: 'dog', pic: 'dog' },
    { w: 'cat', tr: 'cat', en: 'cat', pic: 'cat' },
    { w: 'cow', tr: 'cow', en: 'cow', pic: 'cow' },
    { w: 'pig', tr: 'pig', en: 'pig', pic: 'pig' },
    { w: 'duck', tr: 'duck', en: 'duck', pic: 'duck' },
    { w: 'horse', tr: 'horse', en: 'horse', pic: 'horse' },
    { w: 'frog', tr: 'frog', en: 'frog', pic: 'frog' },
    { w: 'whale', tr: 'whale', en: 'whale', pic: 'whale' }
  ]
};

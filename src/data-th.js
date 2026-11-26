/* Thai — ภาษาไทย. Classic consonant + picture-word tradition (ก ไก่, ข ไข่ ...).
   Word-builder tiles are whole grapheme clusters / syllables so vowel & tone marks never detach. */
window.LPW_DATA = window.LPW_DATA || {};
window.LPW_DATA.th = {
  code: 'th', name: 'ภาษาไทย', en: 'Thai', glyph: 'ก', color: '#ff9f1c', dir: 'ltr',
  speech: ['th'], hello: 'สวัสดี', helloTr: 'sa-wat-DEE',
  letters: [
    { ch: 'ก', name: 'กอ ไก่',    nameTr: 'gor gài',      snd: 'g',  word: 'ไก่',    tr: 'gài',        en: 'chicken',  pic: 'chicken' },
    { ch: 'ข', name: 'ขอ ไข่',    nameTr: 'khŏr khài',    snd: 'kh', word: 'ไข่',    tr: 'khài',       en: 'egg',      pic: 'egg' },
    { ch: 'ค', name: 'คอ ควาย',   nameTr: 'khor khwaai',  snd: 'kh', word: 'ควาย',   tr: 'khwaai',     en: 'buffalo',  pic: 'buffalo' },
    { ch: 'ง', name: 'งอ งู',     nameTr: 'ngor nguu',    snd: 'ng', word: 'งู',     tr: 'nguu',       en: 'snake',    pic: 'snake' },
    { ch: 'จ', name: 'จอ จาน',    nameTr: 'jor jaan',     snd: 'j',  word: 'จาน',    tr: 'jaan',       en: 'plate',    pic: 'plate' },
    { ch: 'ช', name: 'ชอ ช้าง',   nameTr: 'chor cháang',  snd: 'ch', word: 'ช้าง',   tr: 'cháang',     en: 'elephant', pic: 'elephant' },
    { ch: 'ด', name: 'ดอ เด็ก',   nameTr: 'dor dèk',      snd: 'd',  word: 'เด็ก',   tr: 'dèk',        en: 'child',    pic: 'child' },
    { ch: 'ต', name: 'ตอ เต่า',   nameTr: 'dtor dtào',    snd: 'dt', word: 'เต่า',   tr: 'dtào',       en: 'turtle',   pic: 'turtle' },
    { ch: 'น', name: 'นอ หนู',    nameTr: 'nor nŭu',      snd: 'n',  word: 'หนู',    tr: 'nŭu',        en: 'mouse',    pic: 'mouse' },
    { ch: 'บ', name: 'บอ ใบไม้',  nameTr: 'bor bai-máai', snd: 'b',  word: 'ใบไม้',  tr: 'bai-máai',   en: 'leaf',     pic: 'leaf' },
    { ch: 'ป', name: 'ปอ ปลา',    nameTr: 'bpor bplaa',   snd: 'bp', word: 'ปลา',    tr: 'bplaa',      en: 'fish',     pic: 'fish' },
    { ch: 'พ', name: 'พอ พาน',    nameTr: 'phor phaan',   snd: 'ph', word: 'พาน',    tr: 'phaan',      en: 'offering tray', pic: 'tray' },
    { ch: 'ฟ', name: 'ฟอ ฟัน',    nameTr: 'for fan',      snd: 'f',  word: 'ฟัน',    tr: 'fan',        en: 'tooth',    pic: 'tooth' },
    { ch: 'ม', name: 'มอ ม้า',    nameTr: 'mor máa',      snd: 'm',  word: 'ม้า',    tr: 'máa',        en: 'horse',    pic: 'horse' },
    { ch: 'ย', name: 'ยอ ยักษ์',  nameTr: 'yor yák',      snd: 'y',  word: 'ยักษ์',  tr: 'yák',        en: 'giant',    pic: 'giant' },
    { ch: 'ร', name: 'รอ เรือ',   nameTr: 'ror ruea',     snd: 'r',  word: 'เรือ',   tr: 'ruea',       en: 'boat',     pic: 'boat' },
    { ch: 'ล', name: 'ลอ ลิง',    nameTr: 'lor ling',     snd: 'l',  word: 'ลิง',    tr: 'ling',       en: 'monkey',   pic: 'monkey' },
    { ch: 'ว', name: 'วอ แหวน',   nameTr: 'wor wăen',     snd: 'w',  word: 'แหวน',   tr: 'wăen',       en: 'ring',     pic: 'ring' },
    { ch: 'ส', name: 'สอ เสือ',   nameTr: 'sŏr sŭea',     snd: 's',  word: 'เสือ',   tr: 'sŭea',       en: 'tiger',    pic: 'tiger' },
    { ch: 'ห', name: 'หอ หีบ',    nameTr: 'hŏr hìip',     snd: 'h',  word: 'หีบ',    tr: 'hìip',       en: 'chest',    pic: 'chest' },
    { ch: 'อ', name: 'ออ อ่าง',   nameTr: 'or àang',      snd: 'o (vowel carrier)', word: 'อ่าง', tr: 'àang', en: 'basin', pic: 'basin' }
  ],
  words: [
    { w: 'ปลา',     tiles: ['ป', 'ลา'],       say: ['ปอ', 'ลา'],       tr: 'bplaa',      en: 'fish',       pic: 'fish' },
    { w: 'แมว',     tiles: ['แม', 'ว'],       say: ['แม', 'วอ'],       tr: 'maeo',       en: 'cat',        pic: 'cat' },
    { w: 'ลิง',     tiles: ['ลิ', 'ง'],       say: ['ลิ', 'งอ'],       tr: 'ling',       en: 'monkey',     pic: 'monkey' },
    { w: 'ช้าง',    tiles: ['ช้า', 'ง'],      say: ['ช้า', 'งอ'],      tr: 'cháang',     en: 'elephant',   pic: 'elephant' },
    { w: 'กระต่าย', tiles: ['กระ', 'ต่าย'],   say: ['กระ', 'ต่าย'],    tr: 'grà-dtàai',  en: 'rabbit',     pic: 'rabbit' },
    { w: 'ผีเสื้อ',  tiles: ['ผี', 'เสื้อ'],   say: ['ผี', 'เสื้อ'],     tr: 'phĭi-sûea',  en: 'butterfly',  pic: 'butterfly' },
    { w: 'มะม่วง',  tiles: ['มะ', 'ม่วง'],    say: ['มะ', 'ม่วง'],     tr: 'má-mûang',   en: 'mango',      pic: 'mango' },
    { w: 'แตงโม',   tiles: ['แตง', 'โม'],     say: ['แตง', 'โม'],      tr: 'dtaeng-moo', en: 'watermelon', pic: 'watermelon' },
    { w: 'นาฬิกา',  tiles: ['นา', 'ฬิ', 'กา'], say: ['นา', 'ลิ', 'กา'], tr: 'naa-lí-gaa', en: 'clock',      pic: 'clock' }
  ],
  tileSay: {},
  tileTr: {
    'ป': 'bpor', 'ลา': 'laa', 'แม': 'mae', 'ว': 'wor', 'ลิ': 'lí', 'ง': 'ngor', 'ช้า': 'cháa', 'กระ': 'grà',
    'ต่าย': 'dtàai', 'ผี': 'phĭi', 'เสื้อ': 'sûea', 'มะ': 'má', 'ม่วง': 'mûang', 'แตง': 'dtaeng', 'โม': 'moo',
    'นา': 'naa', 'ฬิ': 'lí', 'กา': 'gaa'
  },
  digits: ['๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙', '๑๐'],
  numbers: [
    { w: 'หนึ่ง', tr: 'nùeng' }, { w: 'สอง', tr: 'sŏng' }, { w: 'สาม', tr: 'săam' }, { w: 'สี่', tr: 'sìi' },
    { w: 'ห้า', tr: 'hâa' }, { w: 'หก', tr: 'hòk' }, { w: 'เจ็ด', tr: 'jèt' }, { w: 'แปด', tr: 'bpàet' },
    { w: 'เก้า', tr: 'gâo' }, { w: 'สิบ', tr: 'sìp' }
  ],
  colors: [
    { w: 'สีแดง', tr: 'sĭi daeng', en: 'red', hex: '#ff4d4d' },
    { w: 'สีส้ม', tr: 'sĭi sôm', en: 'orange', hex: '#ff9f1c' },
    { w: 'สีเหลือง', tr: 'sĭi lŭeang', en: 'yellow', hex: '#ffd23f' },
    { w: 'สีเขียว', tr: 'sĭi khĭao', en: 'green', hex: '#3ddc84' },
    { w: 'สีฟ้า', tr: 'sĭi fáa', en: 'blue (sky blue)', hex: '#4d96ff' },
    { w: 'สีม่วง', tr: 'sĭi mûang', en: 'purple', hex: '#9b5de5' },
    { w: 'สีชมพู', tr: 'sĭi chom-phuu', en: 'pink', hex: '#ff7eb6' }
  ],
  animals: [
    { w: 'หมา', tr: 'măa', en: 'dog', pic: 'dog' },
    { w: 'แมว', tr: 'maeo', en: 'cat', pic: 'cat' },
    { w: 'วัว', tr: 'wua', en: 'cow', pic: 'cow' },
    { w: 'ปลา', tr: 'bplaa', en: 'fish', pic: 'fish' },
    { w: 'นก', tr: 'nók', en: 'bird', pic: 'bird' },
    { w: 'สิงโต', tr: 'sĭng-dtoo', en: 'lion', pic: 'lion' },
    { w: 'ช้าง', tr: 'cháang', en: 'elephant', pic: 'elephant' },
    { w: 'กระต่าย', tr: 'grà-dtàai', en: 'rabbit', pic: 'rabbit' }
  ]
};

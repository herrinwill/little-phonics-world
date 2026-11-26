/* Spanish — Español. Includes syllable sound-out (ma-má, ga-to, pe-rro). */
window.LPW_DATA = window.LPW_DATA || {};
window.LPW_DATA.es = {
  code: 'es', name: 'Español', en: 'Spanish', glyph: 'Ñ', color: '#ff5a5f', dir: 'ltr',
  speech: ['es'], hello: '¡Hola!', helloTr: 'OH-la',
  letters: [
    { ch: 'Aa', name: 'a',    nameTr: 'ah',    snd: 'ah',  word: 'árbol',    syl: 'ár-bol',      tr: 'AR-bol',        en: 'tree',     pic: 'tree' },
    { ch: 'Bb', name: 'be',   nameTr: 'beh',   snd: 'b',   word: 'barco',    syl: 'bar-co',      tr: 'BAR-koh',       en: 'boat',     pic: 'boat' },
    { ch: 'Cc', name: 'ce',   nameTr: 'seh / theh', snd: 'k (ca, co, cu)', word: 'casa', syl: 'ca-sa', tr: 'KAH-sah', en: 'house', pic: 'house' },
    { ch: 'Dd', name: 'de',   nameTr: 'deh',   snd: 'd',   word: 'delfín',   syl: 'del-fín',     tr: 'del-FEEN',      en: 'dolphin',  pic: 'dolphin' },
    { ch: 'Ee', name: 'e',    nameTr: 'eh',    snd: 'eh',  word: 'elefante', syl: 'e-le-fan-te', tr: 'eh-leh-FAHN-teh', en: 'elephant', pic: 'elephant' },
    { ch: 'Ff', name: 'efe',  nameTr: 'EH-feh', snd: 'f',  word: 'flor',     syl: 'flor',        tr: 'flor',          en: 'flower',   pic: 'flower' },
    { ch: 'Gg', name: 'ge',   nameTr: 'heh',   snd: 'g (ga, go, gu)', word: 'gato', syl: 'ga-to', tr: 'GAH-toh',   en: 'cat',      pic: 'cat' },
    { ch: 'Ii', name: 'i',    nameTr: 'ee',    snd: 'ee',  word: 'iguana',   syl: 'i-gua-na',    tr: 'ee-GWAH-nah',   en: 'iguana',   pic: 'iguana' },
    { ch: 'Jj', name: 'jota', nameTr: 'HO-tah', snd: 'h (throaty)', word: 'jirafa', syl: 'ji-ra-fa', tr: 'hee-RAH-fah', en: 'giraffe', pic: 'giraffe' },
    { ch: 'Ll', name: 'ele',  nameTr: 'EH-leh', snd: 'l',  word: 'luna',     syl: 'lu-na',       tr: 'LOO-nah',       en: 'moon',     pic: 'moon' },
    { ch: 'Mm', name: 'eme',  nameTr: 'EH-meh', snd: 'm',  word: 'mamá',     syl: 'ma-má',       tr: 'mah-MAH',       en: 'mom',      pic: 'mom' },
    { ch: 'Nn', name: 'ene',  nameTr: 'EH-neh', snd: 'n',  word: 'nube',     syl: 'nu-be',       tr: 'NOO-beh',       en: 'cloud',    pic: 'cloud' },
    { ch: 'Ññ', name: 'eñe',  nameTr: 'EH-nyeh', snd: 'ny', word: 'ñandú',   syl: 'ñan-dú',      tr: 'nyahn-DOO',     en: 'rhea (big bird)', pic: 'bird' },
    { ch: 'Oo', name: 'o',    nameTr: 'oh',    snd: 'oh',  word: 'oso',      syl: 'o-so',        tr: 'OH-soh',        en: 'bear',     pic: 'bear' },
    { ch: 'Pp', name: 'pe',   nameTr: 'peh',   snd: 'p',   word: 'perro',    syl: 'pe-rro',      tr: 'PEH-rroh',      en: 'dog',      pic: 'dog' },
    { ch: 'Rr', name: 'erre', nameTr: 'EH-rreh', snd: 'r (rolled)', word: 'ratón', syl: 'ra-tón', tr: 'rrah-TOHN',   en: 'mouse',    pic: 'mouse' },
    { ch: 'Ss', name: 'ese',  nameTr: 'EH-seh', snd: 's',  word: 'sol',      syl: 'sol',         tr: 'sohl',          en: 'sun',      pic: 'sun' },
    { ch: 'Tt', name: 'te',   nameTr: 'teh',   snd: 't',   word: 'tortuga',  syl: 'tor-tu-ga',   tr: 'tor-TOO-gah',   en: 'turtle',   pic: 'turtle' },
    { ch: 'Uu', name: 'u',    nameTr: 'oo',    snd: 'oo',  word: 'uva',      syl: 'u-va',        tr: 'OO-bah',        en: 'grape',    pic: 'grapes' },
    { ch: 'Vv', name: 'uve',  nameTr: 'OO-beh', snd: 'b',  word: 'vaca',     syl: 'va-ca',       tr: 'BAH-kah',       en: 'cow',      pic: 'cow' },
    { ch: 'Zz', name: 'zeta', nameTr: 'SEH-tah / THEH-tah', snd: 's / th', word: 'zapato', syl: 'za-pa-to', tr: 'sah-PAH-toh', en: 'shoe', pic: 'shoe' }
  ],
  words: [
    { w: 'sol',  tiles: ['s', 'o', 'l'],      syl: ['sol'],      tr: 'sohl',     en: 'sun',   pic: 'sun' },
    { w: 'oso',  tiles: ['o', 's', 'o'],      syl: ['o', 'so'],  tr: 'OH-soh',   en: 'bear',  pic: 'bear' },
    { w: 'uva',  tiles: ['u', 'v', 'a'],      syl: ['u', 'va'],  tr: 'OO-bah',   en: 'grape', pic: 'grapes' },
    { w: 'gato', tiles: ['g', 'a', 't', 'o'], syl: ['ga', 'to'], tr: 'GAH-toh',  en: 'cat',   pic: 'cat' },
    { w: 'casa', tiles: ['c', 'a', 's', 'a'], syl: ['ca', 'sa'], tr: 'KAH-sah',  en: 'house', pic: 'house' },
    { w: 'luna', tiles: ['l', 'u', 'n', 'a'], syl: ['lu', 'na'], tr: 'LOO-nah',  en: 'moon',  pic: 'moon' },
    { w: 'mamá', tiles: ['m', 'a', 'm', 'á'], syl: ['ma', 'má'], tr: 'mah-MAH',  en: 'mom',   pic: 'mom' },
    { w: 'papá', tiles: ['p', 'a', 'p', 'á'], syl: ['pa', 'pá'], tr: 'pah-PAH',  en: 'dad',   pic: 'dad' },
    { w: 'pato', tiles: ['p', 'a', 't', 'o'], syl: ['pa', 'to'], tr: 'PAH-toh',  en: 'duck',  pic: 'duck' },
    { w: 'vaca', tiles: ['v', 'a', 'c', 'a'], syl: ['va', 'ca'], tr: 'BAH-kah',  en: 'cow',   pic: 'cow' }
  ],
  /* Vowels say their sound; consonants say their letter name. */
  tileSay: {
    'a': 'a', 'á': 'a', 'e': 'e', 'i': 'i', 'o': 'o', 'u': 'u', 'b': 'be', 'c': 'ce', 'd': 'de', 'f': 'efe',
    'g': 'ge', 'j': 'jota', 'l': 'ele', 'm': 'eme', 'n': 'ene', 'ñ': 'eñe', 'p': 'pe', 'r': 'erre', 's': 'ese',
    't': 'te', 'v': 'uve', 'z': 'zeta'
  },
  tileTr: {
    'a': 'ah', 'á': 'AH (stressed)', 'e': 'eh', 'i': 'ee', 'o': 'oh', 'u': 'oo', 'b': 'beh', 'c': 'seh', 'd': 'deh', 'f': 'EH-feh',
    'g': 'heh', 'j': 'HO-tah', 'l': 'EH-leh', 'm': 'EH-meh', 'n': 'EH-neh', 'ñ': 'EH-nyeh', 'p': 'peh', 'r': 'EH-rreh', 's': 'EH-seh',
    't': 'teh', 'v': 'OO-beh', 'z': 'SEH-tah'
  },
  numbers: [
    { w: 'uno', tr: 'OO-noh' }, { w: 'dos', tr: 'dohs' }, { w: 'tres', tr: 'trehs' }, { w: 'cuatro', tr: 'KWAH-troh' },
    { w: 'cinco', tr: 'SEEN-koh' }, { w: 'seis', tr: 'says' }, { w: 'siete', tr: 'SYEH-teh' }, { w: 'ocho', tr: 'OH-choh' },
    { w: 'nueve', tr: 'NWEH-beh' }, { w: 'diez', tr: 'dyehs' }
  ],
  colors: [
    { w: 'rojo', tr: 'RROH-hoh', en: 'red', hex: '#ff4d4d' },
    { w: 'naranja', tr: 'nah-RAHN-hah', en: 'orange', hex: '#ff9f1c' },
    { w: 'amarillo', tr: 'ah-mah-REE-yoh', en: 'yellow', hex: '#ffd23f' },
    { w: 'verde', tr: 'BEHR-deh', en: 'green', hex: '#3ddc84' },
    { w: 'azul', tr: 'ah-SOOL', en: 'blue', hex: '#4d96ff' },
    { w: 'morado', tr: 'moh-RAH-doh', en: 'purple', hex: '#9b5de5' },
    { w: 'rosa', tr: 'RROH-sah', en: 'pink', hex: '#ff7eb6' }
  ],
  animals: [
    { w: 'perro', tr: 'PEH-rroh', en: 'dog', pic: 'dog' },
    { w: 'gato', tr: 'GAH-toh', en: 'cat', pic: 'cat' },
    { w: 'vaca', tr: 'BAH-kah', en: 'cow', pic: 'cow' },
    { w: 'pez', tr: 'pehs', en: 'fish', pic: 'fish' },
    { w: 'pájaro', tr: 'PAH-hah-roh', en: 'bird', pic: 'bird' },
    { w: 'león', tr: 'leh-OHN', en: 'lion', pic: 'lion' },
    { w: 'elefante', tr: 'eh-leh-FAHN-teh', en: 'elephant', pic: 'elephant' },
    { w: 'conejo', tr: 'koh-NEH-hoh', en: 'rabbit', pic: 'rabbit' }
  ]
};

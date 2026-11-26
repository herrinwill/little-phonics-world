/* Hebrew — עברית. All words carry nikud; displayed with dir="rtl". */
window.LPW_DATA = window.LPW_DATA || {};
window.LPW_DATA.he = {
  code: 'he', name: 'עברית', en: 'Hebrew', glyph: 'א', color: '#4d96ff', dir: 'rtl',
  speech: ['he', 'iw'], hello: 'שָׁלוֹם', helloTr: 'sha-LOM',
  letters: [
    { ch: 'א', name: 'אָלֶף',  nameTr: 'AH-lef',  snd: 'silent (carries a vowel)', word: 'אַרְיֵה',  tr: 'ar-YEH',     en: 'lion',     pic: 'lion' },
    { ch: 'בּ', name: 'בֵּית',  nameTr: 'bet',     snd: 'b',  word: 'בַּיִת',    tr: 'BA-yit',     en: 'house',    pic: 'house' },
    { ch: 'ג', name: 'גִּימֶל', nameTr: 'GHEE-mel', snd: 'g',  word: 'גָּמָל',    tr: 'ga-MAL',     en: 'camel',    pic: 'camel' },
    { ch: 'ד', name: 'דָּלֶת',  nameTr: 'DA-let',  snd: 'd',  word: 'דָּג',      tr: 'dahg',       en: 'fish',     pic: 'fish' },
    { ch: 'ה', name: 'הֵא',    nameTr: 'hey',     snd: 'h',  word: 'הַר',      tr: 'har',        en: 'mountain', pic: 'mountain' },
    { ch: 'ו', name: 'וָו',    nameTr: 'vav',     snd: 'v',  word: 'וֶרֶד',     tr: 'VEH-red',    en: 'rose',     pic: 'rose' },
    { ch: 'ז', name: 'זַיִן',   nameTr: 'ZA-yin',  snd: 'z',  word: 'זֶבְּרָה',   tr: 'ZEB-rah',    en: 'zebra',    pic: 'zebra' },
    { ch: 'ח', name: 'חֵית',   nameTr: 'khet',    snd: 'kh (throaty)', word: 'חָתוּל', tr: 'kha-TOOL', en: 'cat',  pic: 'cat' },
    { ch: 'ט', name: 'טֵית',   nameTr: 'tet',     snd: 't',  word: 'טַוָּס',    tr: 'ta-VAHS',    en: 'peacock',  pic: 'peacock' },
    { ch: 'י', name: 'יוֹד',   nameTr: 'yod',     snd: 'y',  word: 'יָרֵחַ',    tr: 'ya-REH-akh', en: 'moon',     pic: 'moon' },
    { ch: 'כּ', name: 'כַּף',   nameTr: 'kahf',    snd: 'k',  word: 'כַּדּוּר',   tr: 'ka-DOOR',    en: 'ball',     pic: 'ball' },
    { ch: 'ל', name: 'לָמֶד',  nameTr: 'LA-med',  snd: 'l',  word: 'לֵב',      tr: 'lev',        en: 'heart',    pic: 'heart' },
    { ch: 'מ', name: 'מֵם',    nameTr: 'mem',     snd: 'm',  word: 'מְכוֹנִית',  tr: 'meh-kho-NEET', en: 'car',    pic: 'car' },
    { ch: 'נ', name: 'נוּן',   nameTr: 'noon',    snd: 'n',  word: 'נָחָשׁ',    tr: 'na-KHAHSH',  en: 'snake',    pic: 'snake' },
    { ch: 'ס', name: 'סָמֶךְ',  nameTr: 'SA-mekh', snd: 's',  word: 'סוּס',     tr: 'soos',       en: 'horse',    pic: 'horse' },
    { ch: 'ע', name: 'עַיִן',   nameTr: 'AH-yin',  snd: 'silent (carries a vowel)', word: 'עֵץ', tr: 'ets', en: 'tree', pic: 'tree' },
    { ch: 'פּ', name: 'פֵּא',   nameTr: 'peh',     snd: 'p',  word: 'פִּיל',     tr: 'peel',       en: 'elephant', pic: 'elephant' },
    { ch: 'צ', name: 'צָדִי',  nameTr: 'TSA-dee', snd: 'ts', word: 'צָב',      tr: 'tsahv',      en: 'turtle',   pic: 'turtle' },
    { ch: 'ק', name: 'קוֹף',   nameTr: 'kof',     snd: 'k',  word: 'קוֹף',     tr: 'kof',        en: 'monkey',   pic: 'monkey' },
    { ch: 'ר', name: 'רֵישׁ',  nameTr: 'resh',    snd: 'r',  word: 'רַכֶּבֶת',  tr: 'ra-KEH-vet', en: 'train',    pic: 'train' },
    { ch: 'שׁ', name: 'שִׁין',  nameTr: 'sheen',   snd: 'sh', word: 'שֶׁמֶשׁ',   tr: 'SHEH-mesh',  en: 'sun',      pic: 'sun' },
    { ch: 'ת', name: 'תָּו',   nameTr: 'tahv',    snd: 't',  word: 'תַּפּוּחַ',  tr: 'ta-POO-akh', en: 'apple',    pic: 'apple' }
  ],
  /* Word Builder: tiles are plain letters in reading order (first = rightmost on screen). */
  /* sk = letter-SOUND clip key per tile (audio/sound/he); null = tile says its letter name instead
     (ו/י as vowels, silent final א, word-final ב = v, final ף = f: no matching sound clip). */
  words: [
    { w: 'סוּס',  tiles: ['ס', 'ו', 'ס'],      sk: ['ס', null, 'ס'],       tr: 'soos',     en: 'horse',    pic: 'horse' },
    { w: 'פִּיל',  tiles: ['פ', 'י', 'ל'],      sk: ['פּ', null, 'ל'],       tr: 'peel',     en: 'elephant', pic: 'elephant' },
    { w: 'גָּמָל', tiles: ['ג', 'מ', 'ל'],      sk: ['ג', 'מ', 'ל'],        tr: 'ga-MAL',   en: 'camel',    pic: 'camel' },
    { w: 'כֶּלֶב', tiles: ['כ', 'ל', 'ב'],      sk: ['כּ', 'ל', null],       tr: 'KEH-lev',  en: 'dog',      pic: 'dog' },
    { w: 'אִמָּא', tiles: ['א', 'מ', 'א'],      sk: [null, 'מ', null],      tr: 'EE-ma',    en: 'mom',      pic: 'mom' },
    { w: 'אַבָּא', tiles: ['א', 'ב', 'א'],      sk: ['א', 'בּ', null],       tr: 'AH-ba',    en: 'dad',      pic: 'dad' },
    { w: 'בַּיִת', tiles: ['ב', 'י', 'ת'],      sk: ['בּ', 'י', 'ת'],        tr: 'BA-yit',   en: 'house',    pic: 'house' },
    { w: 'קוֹף',  tiles: ['ק', 'ו', 'ף'],      sk: ['ק', null, null],      tr: 'kof',      en: 'monkey',   pic: 'monkey' },
    { w: 'חָתוּל', tiles: ['ח', 'ת', 'ו', 'ל'], sk: ['ח', 'ת', null, 'ל'],  tr: 'kha-TOOL', en: 'cat',      pic: 'cat' }
  ],
  /* What each tile says when tapped (letter names; final forms say "final ..."). */
  tileSay: {
    'א': 'אָלֶף', 'ב': 'בֵּית', 'ג': 'גִּימֶל', 'ד': 'דָּלֶת', 'ה': 'הֵא', 'ו': 'וָו', 'ז': 'זַיִן',
    'ח': 'חֵית', 'ט': 'טֵית', 'י': 'יוֹד', 'כ': 'כַּף', 'ל': 'לָמֶד', 'מ': 'מֵם', 'נ': 'נוּן',
    'ס': 'סָמֶךְ', 'ע': 'עַיִן', 'פ': 'פֵּא', 'צ': 'צָדִי', 'ק': 'קוֹף', 'ר': 'רֵישׁ', 'ש': 'שִׁין', 'ת': 'תָּו',
    'ך': 'כַּף סוֹפִית', 'ם': 'מֵם סוֹפִית', 'ן': 'נוּן סוֹפִית', 'ף': 'פֵּא סוֹפִית', 'ץ': 'צָדִי סוֹפִית'
  },
  tileTr: {
    'א': 'AH-lef', 'ב': 'bet', 'ג': 'GHEE-mel', 'ד': 'DA-let', 'ה': 'hey', 'ו': 'vav', 'ז': 'ZA-yin',
    'ח': 'khet', 'ט': 'tet', 'י': 'yod', 'כ': 'kahf', 'ל': 'LA-med', 'מ': 'mem', 'נ': 'noon',
    'ס': 'SA-mekh', 'ע': 'AH-yin', 'פ': 'peh', 'צ': 'TSA-dee', 'ק': 'kof', 'ר': 'resh', 'ש': 'sheen', 'ת': 'tahv',
    'ך': 'kahf so-FEET', 'ם': 'mem so-FEET', 'ן': 'noon so-FEET', 'ף': 'peh so-FEET', 'ץ': 'TSA-dee so-FEET'
  },
  /* Counting uses the everyday (feminine) number forms. */
  numbers: [
    { w: 'אַחַת', tr: 'a-KHAT' }, { w: 'שְׁתַּיִם', tr: 'SHTA-yim' }, { w: 'שָׁלוֹשׁ', tr: 'sha-LOSH' },
    { w: 'אַרְבַּע', tr: 'AR-ba' }, { w: 'חָמֵשׁ', tr: 'kha-MESH' }, { w: 'שֵׁשׁ', tr: 'shesh' },
    { w: 'שֶׁבַע', tr: 'SHEH-va' }, { w: 'שְׁמוֹנֶה', tr: 'shmo-NEH' }, { w: 'תֵּשַׁע', tr: 'TEH-sha' },
    { w: 'עֶשֶׂר', tr: 'EH-ser' }
  ],
  colors: [
    { w: 'אָדֹם', tr: 'a-DOM', en: 'red', hex: '#ff4d4d' },
    { w: 'כָּתֹם', tr: 'ka-TOM', en: 'orange', hex: '#ff9f1c' },
    { w: 'צָהֹב', tr: 'tsa-HOV', en: 'yellow', hex: '#ffd23f' },
    { w: 'יָרֹק', tr: 'ya-ROK', en: 'green', hex: '#3ddc84' },
    { w: 'כָּחֹל', tr: 'ka-KHOL', en: 'blue', hex: '#4d96ff' },
    { w: 'סָגֹל', tr: 'sa-GOL', en: 'purple', hex: '#9b5de5' },
    { w: 'וָרֹד', tr: 'va-ROD', en: 'pink', hex: '#ff7eb6' }
  ],
  animals: [
    { w: 'כֶּלֶב', tr: 'KEH-lev', en: 'dog', pic: 'dog' },
    { w: 'חָתוּל', tr: 'kha-TOOL', en: 'cat', pic: 'cat' },
    { w: 'פָּרָה', tr: 'pa-RAH', en: 'cow', pic: 'cow' },
    { w: 'דָּג', tr: 'dahg', en: 'fish', pic: 'fish' },
    { w: 'צִפּוֹר', tr: 'tsi-POR', en: 'bird', pic: 'bird' },
    { w: 'אַרְיֵה', tr: 'ar-YEH', en: 'lion', pic: 'lion' },
    { w: 'פִּיל', tr: 'peel', en: 'elephant', pic: 'elephant' },
    { w: 'אַרְנָב', tr: 'ar-NAHV', en: 'rabbit', pic: 'rabbit' }
  ]
};

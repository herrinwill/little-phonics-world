# Little Phonics World 🌈

A joyful, picture-first phonics and early-language game for little learners (ages 4+), made for a child who **can't read yet** to play with a grown-up reading along.

It has **zero external dependencies**: no CDNs, web fonts or third-party requests. All pictures are inline SVG and sound effects are synthesised with the Web Audio API. **All 5 languages now have natural, pre-recorded native voices**: English (119 clips in `audio/en/`), Hebrew, Greek, Thai and Spanish (native neural voices in `audio/he/`, `audio/el/`, `audio/th/`, `audio/es/`).

## How to play

- **Online:** open the GitHub Pages URL for this repository. It serves `index.html`, which loads every voice clip from `./audio/<language>/`.
- **Offline / to share:** double-click `Little-Phonics-World.html`. It is a single file (about 1.3 MB) with every English voice clip embedded, so it works from `file://` with no internet and needs no other files. The Hebrew, Greek, Thai and Spanish voices are streamed from this game's website when you are online. Offline, those languages quietly fall back to the device voice or the sound-out badge.

Tap the big picture buttons. Nothing has to be read, there are no timers and no lives, and a wrong tap only makes a giggle.

## Five languages (American English is the default)

The game starts in **American English** for every new visitor, and English is the first language button. Saved progress carries over between visits; if a saved language is missing or invalid, the game falls back to English.

| | Language | Letters | Highlights |
|---|---|---|---|
| Aa | **English (American)** | all 26 letters A–Z | Classic phonics with short-vowel sounds: A apple, B bear, C cat … X fox, Y yo-yo, Z zebra. Each letter says its name and its word in a natural voice ("B! B is for bear.") |
| א | **Hebrew (עברית)** | all 22 letters | Words with full nikud (אַרְיֵה, בַּיִת, גָּמָל, דָּג…), right-to-left text, final letters (ף ץ) handled |
| Α | **Greek (Ελληνικά)** | all 24 letters | Monotonic accents (αστέρι, βάρκα, γάτα, δέντρο…), final sigma ς |
| ก | **Thai (ภาษาไทย)** | 21 classic consonants | The traditional ก ไก่, ข ไข่, ค ควาย… rhyme, Thai digits ๑–๑๐ |
| Ñ | **Spanish (Español)** | 21 letters incl. Ñ | Syllable sound-out (ma-má, ga-to, pe-rro) |

Each language also has word-builder words, numbers 1–10, 7 colors and 8 animals. English Word Builder uses short CVC words (cat, dog, sun, pig, hat, bus, fox, mom, dad, frog). Each tile says its letter, and the finished word is spelled and then spoken ("C, A, T... Cat!").

**English meanings everywhere:** in Hebrew, Greek, Thai and Spanish, every spotlight word, builder word, bubble, number, color and animal shows a small, always-visible English caption (e.g. "= cat"). An American child and parent always know what the word means.

## Four games and a sticker book

1. **Letter & Sound Factory**: letter friends with blinking eyes. Tap one and it dances, says its name and an example word, its picture pops up, and you earn a star.
2. **Word Builder Monsters**: bouncing letter monsters. Tap or drag them into the glowing slots. Each tile says its letter, and a finished word gets confetti, is spoken aloud and earns stars. A tile in the wrong slot gently bounces back. Hebrew fills from right to left, and Thai uses whole-syllable tiles so vowel and tone marks never break apart.
3. **Listen & Pop Bubble Hunt**: hear a word and pop the matching picture bubble. Wrong taps only giggle and wiggle. After two wrong taps the word is replayed and the right bubble glows.
4. **Rainbow Sound Stage** (free play): a rainbow xylophone for numbers 1–10 (each bar plays a note and says the number), plus color and animal boards.
- **Sticker Book & Star Jar**: stars fill a jar, and 20 stickers (4 games × 5 languages) unlock as you play. Progress is saved on the device (`localStorage`), and the game still works in private mode.

## Parent notes

- **Parent Info button** (top right, two people): shows transliterations, letter sounds (e.g. "/a/ as in apple") and English meanings, so you can read along and model the pronunciation.
- **English voice:** natural pre-recorded clips. Only one clip ever plays at a time: a new tap or a screen change stops the previous one. Isolated letter sounds ("kuh", "sss") are not spoken because they sound robotic; Parent Info shows them instead (e.g. "/a/ as in apple"). If a clip can't play, the game falls back to the device voice, preferring natural/neural English voices.
- **Hebrew, Greek, Thai, Spanish:** each word, letter name, syllable sound-out and number plays its native-speaker clip, in order, with the same one-clip-at-a-time rule. The sound-out badge still pops up so a parent can read along.
- **Fallback (no clip / offline):** the game only speaks with a voice in the right language (`he-IL`, `el-GR`, `th-TH`, `es-ES`/`es-MX`), at a slow, kid-friendly rate. If your device has no voice for a language, it never uses a wrong-language voice. Instead a bouncing **sound-out badge** shows the pronunciation (e.g. "ar-YEH") with a chime, so you can say it together. Voices for Thai, Hebrew and Greek can be added in your OS speech settings.
- Respects **reduced-motion** settings. Every tap target is at least 64 px, and the layout fits phones, tablets and desktops in portrait and landscape.
- The **house button** (top left) always goes back home.

## Inspired by

Classic, research-backed early-literacy games: **LeapFrog Letter Factory** and **Starfall ABCs** (letters that come alive), **Endless Alphabet** (dragging letter monsters into words), **Gus on the Go** and **Duolingo ABC** (picture matching with gentle, no-penalty feedback), and **Hooked on Phonics** (repetition with letter, sound, word and picture shown together). All characters, art and code here are original.

## Development

```
src/            source files (CSS, per-language data, SVG art, audio, modes, app)
audio/en/       natural English voice clips (MP3) + manifest.json (key -> spoken text)
audio/he|el|th|es/  native voice clips NNN.mp3 + manifest.json (exact spoken text -> file; embedded into both builds)
build.mjs       builds index.html (clips by relative URL) and Little-Phonics-World.html (clips embedded) from the same source
tests/          headless-Chrome smoke tests (Playwright): index.html over a local HTTP server, the standalone file over file://
```

```
node build.mjs
node tests/smoke.mjs        # screenshots go to screenshots/
```

A small test hook is exposed as `window.LPW` (`setLang(code)`, `goMode(name)`, `state()`, `audioState()`).

## Credits

Original game, characters, art and code, built with Claude.

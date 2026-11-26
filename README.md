# Little Phonics World 🌈

A joyful, picture-first phonics and early-language game for little learners (ages 4+), made for a child who **can't read yet** to play with a grown-up reading along.

It's one self-contained HTML file with **zero external dependencies**: no CDNs, web fonts, images or network requests. All pictures are inline SVG, sounds are synthesised with the Web Audio API, and words are spoken with the browser's built-in speech (Web Speech API).

## How to play

- **Online:** open the GitHub Pages URL for this repository (it serves `index.html`).
- **Offline:** double-click `Little-Phonics-World.html` (or `index.html`). It works from `file://` with no internet.

Tap the big picture buttons. Nothing has to be read, there are no timers and no lives, and a wrong tap only makes a giggle.

## Four languages

| | Language | Letters | Highlights |
|---|---|---|---|
| א | **Hebrew (עברית)** | all 22 letters | Words with full nikud (אַרְיֵה, בַּיִת, גָּמָל, דָּג…), right-to-left text, final letters (ף ץ) handled |
| Α | **Greek (Ελληνικά)** | all 24 letters | Monotonic accents (αστέρι, βάρκα, γάτα, δέντρο…), final sigma ς |
| ก | **Thai (ภาษาไทย)** | 21 classic consonants | The traditional ก ไก่, ข ไข่, ค ควาย… rhyme, Thai digits ๑–๑๐ |
| Ñ | **Spanish (Español)** | 21 letters incl. Ñ | Syllable sound-out (ma-má, ga-to, pe-rro) |

Each language also has word-builder words, numbers 1–10, 7 colours and 8 animals.

## Four games and a sticker book

1. **Letter & Sound Factory**: letter friends with blinking eyes. Tap one and it dances, says its name and an example word, its picture pops up, and you earn a star.
2. **Word Builder Monsters**: bouncing letter monsters. Tap or drag them into the glowing slots. Each tile says its letter, and a finished word gets confetti, is spoken aloud and earns stars. A tile in the wrong slot gently bounces back. Hebrew fills from right to left, and Thai uses whole-syllable tiles so vowel and tone marks never break apart.
3. **Listen & Pop Bubble Hunt**: hear a word and pop the matching picture bubble. Wrong taps only giggle and wiggle. After two wrong taps the word is replayed and the right bubble glows.
4. **Rainbow Sound Stage** (free play): a rainbow xylophone for numbers 1–10 (each bar plays a note and says the number), plus colour and animal boards.
- **Sticker Book & Star Jar**: stars fill a jar, and 16 stickers (4 games × 4 languages) unlock as you play. Progress is saved on the device (`localStorage`), and the game still works in private mode.

## Parent notes

- **Parent Info button** (top right, two people): shows transliterations, letter sounds and English meanings, so you can read along and model the pronunciation.
- **Speech:** the game only speaks with a voice in the right language (`he-IL`, `el-GR`, `th-TH`, `es-ES`/`es-MX`), at a slow, kid-friendly rate. If your device has no voice for a language, it never uses a wrong-language voice. Instead a bouncing **sound-out badge** shows the pronunciation (e.g. "ar-YEH") with a chime, so you can say it together. Voices for Thai, Hebrew and Greek can be added in your OS speech settings.
- Respects **reduced-motion** settings. Every tap target is at least 64 px, and the layout fits phones, tablets and desktops in portrait and landscape.
- The **house button** (top left) always goes back home.

## Inspired by

Classic, research-backed early-literacy games: **LeapFrog Letter Factory** and **Starfall ABCs** (letters that come alive), **Endless Alphabet** (dragging letter monsters into words), **Gus on the Go** and **Duolingo ABC** (picture matching with gentle, no-penalty feedback), and **Hooked on Phonics** (repetition with letter, sound, word and picture shown together). All characters, art and code here are original.

## Development

```
src/            source files (CSS, per-language data, SVG art, audio, modes, app)
build.mjs       inlines src/ into index.html + Little-Phonics-World.html (node, no deps)
tests/smoke.mjs headless-Chrome smoke test (Playwright)
```

```
node build.mjs
node tests/smoke.mjs        # screenshots go to screenshots/
```

A small test hook is exposed as `window.LPW` (`setLang(code)`, `goMode(name)`, `state()`).

## Credits

Built by Claude for Innit2WinniT.

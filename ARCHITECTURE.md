# 🏗 Brain Sprint — Architecture & Flow Reference

> This document is a full reference for developers jumping back into the project.
> It covers the screen flow, component responsibilities, data model, and design decisions.

---

## 📐 High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       index.html                         │
│   (Google Fonts, meta tags, #app mount point)            │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                       main.js                            │
│   (Creates Vue app, imports global CSS)                  │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                       App.vue                            │
│   ┌──────────────────────────────────────────────────┐   │
│   │  Screen State Machine (ref: currentScreen)       │   │
│   │                                                  │   │
│   │  'home' ──▶ 'levelSelect' ──▶ 'game' ──▶ 'gameOver' │
│   │    │                            ▲          │     │   │
│   │    ▼                            │          ▼     │   │
│   │  'scoreboard'              playAgain    'home'   │   │
│   └──────────────────────────────────────────────────┘   │
│                                                          │
│   + Ambient gradient background blobs (fixed, z-0)       │
│   + Fade transitions between screens                     │
└──────────────────────────────────────────────────────────┘
```

---

## 🖥 Screen Flow

```
    ┌─────────────┐
    │  HomeScreen  │
    │             │
    │ [Start Sprint] ──────▶ LevelSelect
    │ [Scoreboard]  ──────▶ ScoreBoard
    └─────────────┘

    ┌──────────────┐
    │ LevelSelect  │
    │              │
    │ [Level 1] ──────┐
    │ [Level 2] ──────┼──▶ GameArena (with selected level)
    │ [Level 3] ──────┘
    │ [← Back]  ──────▶ HomeScreen
    └──────────────┘

    ┌──────────────┐
    │  GameArena   │
    │              │
    │ Countdown (3..2..1)
    │     ▼
    │ Question Loop:
    │   Show question + 4 option buttons
    │   Timer counting down
    │     ├── Correct → score += points, next question
    │     ├── Wrong   → save score, → GameOver (reason: wrong)
    │     └── Timeout → save score, → GameOver (reason: timeout)
    │
    │ [Quit] → save score if > 0, → HomeScreen
    └──────────────┘

    ┌──────────────┐
    │   GameOver   │
    │              │
    │ Shows: score, questions answered, best streak, level
    │ Confetti if new high score
    │
    │ [Play Again]    ──▶ GameArena (same level)
    │ [Change Level]  ──▶ LevelSelect
    │ [Home]          ──▶ HomeScreen
    └──────────────┘

    ┌──────────────┐
    │  ScoreBoard  │
    │              │
    │ Tabs: Level 1 | Level 2 | Level 3
    │ Shows ranked history per level
    │ [Clear All Scores] with confirmation
    │ [← Back] ──▶ HomeScreen
    └──────────────┘
```

---

## 🧩 Component Breakdown

### `App.vue` — Root Screen Router

| Concern         | Detail                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| **State**       | `currentScreen` (string), `selectedLevel` (number), `gameResult` (object) |
| **Role**        | Routes between screens via `v-if`, passes props & listens to events       |
| **Background**  | 3 fixed blurred gradient blobs for ambient effect                         |
| **Transitions** | Vue `<Transition>` with fade + translateY                                 |

### `HomeScreen.vue` — Landing Page

| Concern    | Detail                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| **Shows**  | Animated logo, gradient title, stats badges (if games played), level previews |
| **Events** | `@start` → go to LevelSelect, `@scoreboard` → go to ScoreBoard                |
| **Data**   | Reads `getTotalGamesPlayed()` and `getHighScore()` on mount                   |

### `LevelSelect.vue` — Level Picker

| Concern    | Detail                                                                     |
| ---------- | -------------------------------------------------------------------------- |
| **Shows**  | 3 detailed cards with level info, examples, timer, high score, best streak |
| **Events** | `@select(levelId)` → start game, `@back` → go home                         |
| **Data**   | Reads `getHighScore()` and `getBestStreak()` per level on mount            |
| **Design** | Glassmorphism cards with hover effects and staggered slide-up animation    |

### `GameArena.vue` — Core Game Engine ⭐

| Concern            | Detail                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Props**          | `level` (1, 2, or 3)                                                                                                       |
| **States**         | `countdown` → `playing` → `ended`                                                                                          |
| **Question Flow**  | `generateQuestion(level)` → display + 4 option buttons → pick = final answer                                               |
| **Timer**          | Interval-based, updates `timeLeft` (percentage) every 50ms. Color shifts green → yellow → red                              |
| **Scoring**        | `basePoints + timeBonus + streakBonus` (see formula below)                                                                 |
| **On Correct**     | Score up, streak up, flash green, load next question after 600ms                                                           |
| **On Wrong**       | Flash red + shake, highlight correct answer green, save to localStorage, emit `game-over` after 1500ms                     |
| **On Timeout**     | Same as wrong but with "Time's up!" message                                                                                |
| **Option Buttons** | 2×2 grid with A/B/C/D badges. Disabled after selection. Visual feedback: green for correct, red for wrong, fade for others |

### `GameOver.vue` — Results Screen

| Concern      | Detail                                                       |
| ------------ | ------------------------------------------------------------ |
| **Props**    | `result` (score, questionsAnswered, streak, reason), `level` |
| **Shows**    | Reason icon, final score, stats grid, performance message    |
| **Confetti** | 30 random colored particles if new high score detected       |
| **Events**   | `@play-again`, `@change-level`, `@home`                      |

### `ScoreBoard.vue` — Score History

| Concern      | Detail                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Shows**    | Overview cards (best per level), tabbed history list, ranked entries                          |
| **Features** | Relative timestamps ("2m ago"), rank badges (gold/silver/bronze), clear all with confirmation |
| **Data**     | Reads from `getAllScores()`, `getHighScore()`, `getBestStreak()`                              |

---

## 📦 Library Modules

### `lib/questions.js` — Question Generator

```
generateQuestion(level)
    ├── Level 1: generateLevel1()
    │   └── Random +, −, × with numbers 1-20
    │
    ├── Level 2: generateLevel2()
    │   ├── generateFillBlank()    →  "6 × ? = 42" (type: options)
    │   └── generateComparison()   →  "15+4 ? 3×7" (type: comparison, options: <, =, >)
    │
    └── Level 3: generateLevel3()
        ├── generatePEMDAS()       →  "2 + 5 × 3"   (order of operations)
        ├── generateNegatives()    →  "10 − (−4)"    (double negatives)
        └── generateSquareRoot()   →  "√49 + 3"      (perfect squares)
```

**Every question returns:**

```js
{
  display: string,       // The question text shown to user
  answer: number|string, // The correct answer
  options: array,        // 4 shuffled choices (1 correct + 3 distractors)
  type: 'options' | 'comparison',
  timeLimit: number,     // Milliseconds (5000 / 8000 / 10000)
}
```

**Distractor generation:**

- Creates 3 plausible wrong answers near the correct value
- Uses mixed strategies: close offset (±1–5), medium offset (±3–10), common mistakes (±1–2), proportional offset
- Guarantees uniqueness via Set + fallback loop
- Fisher-Yates shuffle for random option order

### `lib/scores.js` — Score Persistence

**localStorage key:** `brain-sprint-scores`

**Data shape:**

```js
{
  level1: [ { score, questionsAnswered, streak, date }, ... ],
  level2: [ ... ],
  level3: [ ... ],
}
```

**API:**
| Function | Returns | Purpose |
|---|---|---|
| `addScore(level, result)` | void | Saves a game result (keeps last 50 per level) |
| `getHighScore(level)` | number | Highest score for a level |
| `getBestStreak(level)` | number | Longest streak for a level |
| `getLevelScores(level)` | array | All history for a level |
| `getAllScores()` | object | Full data object |
| `getTotalGamesPlayed()` | number | Sum across all levels |
| `clearAllScores()` | void | Wipes localStorage |

---

## 🎨 Styling Architecture

### CSS Layers (`main.css`)

```
1. @import "tailwindcss"         — TailwindCSS v4 base
2. Custom @keyframes             — 12 animations (float, shake, slide-up, confetti, etc.)
3. Utility classes               — .animate-*, .glass, .glass-strong
4. Browser resets                 — Scrollbar, number input arrows
5. Typography                    — font-family assignments (Inter, Space Grotesk)
```

### Design Tokens (via Tailwind)

| Element              | Value                                        |
| -------------------- | -------------------------------------------- |
| **Background**       | `bg-slate-950` (#020617)                     |
| **Primary gradient** | `from-violet-600 to-blue-600`                |
| **Text gradient**    | `from-violet-400 via-blue-400 to-indigo-400` |
| **Glass bg**         | `rgba(255,255,255, 0.05)` with `blur(20px)`  |
| **Glass border**     | `rgba(255,255,255, 0.1)`                     |
| **Body font**        | Inter (300–900)                              |
| **Heading font**     | Space Grotesk (400–700)                      |

### Key Animation Classes

| Class                | Effect                    | Used In             |
| -------------------- | ------------------------- | ------------------- |
| `.animate-float`     | Gentle up-down bob        | Home logo icon      |
| `.animate-gradient`  | Background position shift | Title text          |
| `.animate-countdown` | Pulse scale               | 3-2-1 countdown     |
| `.animate-shake`     | Horizontal shake          | Wrong answer card   |
| `.animate-correct`   | Green flash bg            | Correct answer card |
| `.animate-score-pop` | Quick scale bounce        | Score counter       |
| `.animate-slide-up`  | Fade + translateY up      | Screen entry        |
| `.animate-confetti`  | Fall + rotate             | High score confetti |

---

## 🔧 Dev Environment

| Tool        | Config File                                                           |
| ----------- | --------------------------------------------------------------------- |
| Vite        | `vite.config.js` — Vue plugin + TailwindCSS plugin + `@` alias        |
| TailwindCSS | Loaded via `@tailwindcss/vite` plugin (v4, no tailwind.config needed) |
| Node        | Engines: `^20.19.0 \|\| >=22.12.0`                                    |

### Scripts

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

## 🔄 Data Flow Diagram

```
User clicks "Start Sprint"
         │
         ▼
    LevelSelect
    (user picks level)
         │
         ▼
    GameArena mounted
         │
    ┌────▼─────┐
    │ Countdown │ (3 → 2 → 1)
    └────┬─────┘
         │
    ┌────▼──────────────────────────────┐
    │        QUESTION LOOP              │
    │                                   │
    │  generateQuestion(level)          │
    │         │                         │
    │         ▼                         │
    │  Display question + options       │
    │  Start timer countdown            │
    │         │                         │
    │    ┌────┴────┐                    │
    │    │ User    │ Timer              │
    │    │ picks   │ hits 0             │
    │    │ option  │                    │
    │    ▼         ▼                    │
    │  ┌─────┐  ┌────────┐             │
    │  │Check│  │Timeout │             │
    │  │answer│ │handler │             │
    │  └──┬──┘  └───┬────┘             │
    │     │         │                   │
    │  ┌──┴──┐   ┌──┴──┐               │
    │  │     │   │     │               │
    │  ▼     ▼   ▼     │               │
    │ ✅    ❌  ❌     │               │
    │ score  │   │      │               │
    │ +pts   │   │      │               │
    │ next Q │   │      │               │
    │  │     │   │      │               │
    │  └─────┤   │      │               │
    │     ┌──┘   │      │               │
    │     │      │      │               │
    └─────│──────│──────┘               │
          │      │                      │
          ▼      ▼                      │
    ┌─────────────────┐                 │
    │  addScore()     │ ◀───────────────┘
    │  (localStorage) │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │    GameOver      │
    │  (show results)  │
    └─────────────────┘
```

---

## 📝 Quick Reference: Adding a New Level

1. **`lib/questions.js`** — Create a `generateLevelN()` function that returns `makeOptionsQuestion(display, answer, timeLimit)`
2. **`lib/questions.js`** — Add `case N:` to `generateQuestion()` switch
3. **`GameArena.vue`** — Add entry to `levelMeta` computed
4. **`LevelSelect.vue`** — Add a new object to the `levels` ref array
5. **`GameOver.vue`** — Add entry to `levelMeta` computed
6. **`ScoreBoard.vue`** — Add tab to `tabs` array
7. **`lib/scores.js`** — Add `levelN: []` to default in `getScores()`

---

_Last updated: February 2026_

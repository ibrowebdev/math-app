# ⚡ Brain Sprint — Math Speed Trainer

A fast-paced, premium math training app built to sharpen mental calculation speed. Students pick one of three difficulty levels, then race against the clock answering questions. One wrong answer or timeout and the game is over.

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## 🎮 Gameplay

1. **Choose a Level** — Pick from three difficulty tiers
2. **Answer Fast** — Each question is multiple-choice (4 options). One tap = final answer
3. **Stay Alive** — Any wrong answer or timeout ends the game instantly
4. **Beat Your Score** — Scores are saved locally and tracked per level

### 🔥 Level 1 — The Reflex _(5s timer)_

> Pure speed. Single-step arithmetic the brain should know by heart.

- Addition, Subtraction, Multiplication (up to 20)
- Examples: `8 + 7`, `13 − 6`, `9 × 4`

### 🧠 Level 2 — The Logic Gap _(8s timer)_

> Working backward. Find the missing piece or compare two values.

- Fill-in-the-blank: `6 × ? = 42`
- Comparison: `15 + 4  [?]  3 × 7` → pick `<`, `=`, or `>`

### ⚡ Level 3 — Order of Chaos _(10s timer)_

> High-pressure rule following. PEMDAS/BODMAS, negatives, and square roots.

- `2 + 5 × 3 = ?` (Answer: 17, not 21)
- `10 − (−4)` | `(−3) × 5` | `√49 + 3`

---

## ✨ Features

- **Multiple-choice answers** — 4 option buttons, instant feedback on tap
- **Scoring system** — Base points + time bonus + streak multiplier
- **Streak tracking** — Consecutive correct answers earn bonus points
- **localStorage persistence** — All scores saved per level with history
- **High score detection** — Confetti celebration on new records 🎉
- **Premium UI** — Glassmorphism, gradient text, micro-animations, responsive design
- **Dark mode** — Full dark theme with blue-purple gradient palette

---

## 🛠 Tech Stack

| Technology        | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| **Vue 3**         | Reactive UI framework (Composition API + `<script setup>`) |
| **Vite 7**        | Lightning-fast dev server & build tool                     |
| **TailwindCSS 4** | Utility-first CSS with `@tailwindcss/vite` plugin          |
| **localStorage**  | Client-side score persistence                              |
| **Google Fonts**  | Inter (body) + Space Grotesk (headings)                    |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0`
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd math-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/` (or the next available port).

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
math-app/
├── index.html              # Entry HTML with Google Fonts & meta tags
├── vite.config.js          # Vite + Vue + TailwindCSS config
├── package.json            # Dependencies & scripts
├── ARCHITECTURE.md         # Detailed architecture documentation
│
└── src/
    ├── main.js             # App entry point
    ├── App.vue             # Root component (screen router + ambient bg)
    │
    ├── assets/
    │   └── main.css        # TailwindCSS imports, animations, utilities
    │
    ├── components/
    │   ├── HomeScreen.vue  # Landing page with title & stats
    │   ├── LevelSelect.vue # Level picker with detail cards
    │   ├── GameArena.vue   # Core game engine (timer + questions + options)
    │   ├── GameOver.vue    # Results screen with confetti
    │   └── ScoreBoard.vue  # Score history with tabs & ranking
    │
    └── lib/
        ├── questions.js    # Question generators for all 3 levels
        └── scores.js       # localStorage score management
```

---

## 🧮 Scoring Formula

```
Points per question = (Level × 10) + Time Bonus + Streak Bonus

Time Bonus  = floor(timeRemainingPercent / 10)   → max 10
Streak Bonus = min(currentStreak × 2, 20)        → max 20
```

| Level | Base | Max Time Bonus | Max Streak | Max per Question |
| ----- | ---- | -------------- | ---------- | ---------------- |
| 1     | 10   | 10             | 20         | 40               |
| 2     | 20   | 10             | 20         | 50               |
| 3     | 30   | 10             | 20         | 60               |

---

## 👤 Author

**Yusuf Ibrohim** — [yusufikeolapo2002@gmail.com](mailto:yusufikeolapo2002@gmail.com)

---

## 📄 License

This project is open source and available for educational purposes.

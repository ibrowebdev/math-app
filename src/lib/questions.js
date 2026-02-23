/**
 * Question generators for each level of Brain Sprint
 * All questions return multiple-choice options (no text input)
 */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate 3 unique distractors near the correct answer
 */
function generateDistractors(correctAnswer, count = 3) {
  const distractors = new Set()
  const isNegativeRange = correctAnswer < 0

  // Strategy: generate nearby wrong answers that look plausible
  let attempts = 0
  while (distractors.size < count && attempts < 50) {
    attempts++
    let distractor

    // Mix of strategies for realistic wrong answers
    const strategy = randomInt(0, 3)
    switch (strategy) {
      case 0: // Close offset (±1 to ±5)
        distractor = correctAnswer + randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1)
        break
      case 1: // Medium offset (±3 to ±10)
        distractor = correctAnswer + randomInt(3, 10) * (Math.random() > 0.5 ? 1 : -1)
        break
      case 2: // Common mistake: ±1 or ±2
        distractor = correctAnswer + (randomInt(0, 1) === 0 ? randomInt(1, 2) : -randomInt(1, 2))
        break
      case 3: // Larger offset for bigger numbers
        const offset = Math.max(1, Math.floor(Math.abs(correctAnswer) * 0.2))
        distractor = correctAnswer + randomInt(1, offset + 3) * (Math.random() > 0.5 ? 1 : -1)
        break
    }

    // Round to integer
    distractor = Math.round(distractor)

    // Must not equal the correct answer
    if (distractor !== correctAnswer) {
      distractors.add(distractor)
    }
  }

  // Fallback: if we still don't have enough, force unique values
  let fallback = 1
  while (distractors.size < count) {
    if (correctAnswer + fallback !== correctAnswer && !distractors.has(correctAnswer + fallback)) {
      distractors.add(correctAnswer + fallback)
    }
    if (distractors.size < count && correctAnswer - fallback !== correctAnswer && !distractors.has(correctAnswer - fallback)) {
      distractors.add(correctAnswer - fallback)
    }
    fallback++
  }

  return Array.from(distractors).slice(0, count)
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build a standard options question
 */
function makeOptionsQuestion(display, answer, timeLimit) {
  const distractors = generateDistractors(answer, 3)
  const options = shuffle([answer, ...distractors])

  return {
    display,
    answer,
    options,
    type: 'options',
    timeLimit,
  }
}

// ─── LEVEL 1: The Reflex ─────────────────────────────────────────
export function generateLevel1() {
  const ops = ['+', '−', '×']
  const op = ops[randomInt(0, 2)]
  let a, b, answer, display

  switch (op) {
    case '+':
      a = randomInt(1, 20)
      b = randomInt(1, 20)
      answer = a + b
      display = `${a} + ${b}`
      break
    case '−':
      a = randomInt(1, 20)
      b = randomInt(1, a)
      answer = a - b
      display = `${a} − ${b}`
      break
    case '×':
      a = randomInt(1, 10)
      b = randomInt(1, 10)
      answer = a * b
      display = `${a} × ${b}`
      break
  }

  return makeOptionsQuestion(display, answer, 5000)
}

// ─── LEVEL 2: The Logic Gap ──────────────────────────────────────
export function generateLevel2() {
  const questionType = randomInt(0, 1)

  if (questionType === 0) {
    return generateFillBlank()
  } else {
    return generateComparison()
  }
}

function generateFillBlank() {
  const ops = ['+', '−', '×']
  const op = ops[randomInt(0, 2)]
  let a, b, answer, display

  switch (op) {
    case '+':
      a = randomInt(1, 15)
      b = randomInt(1, 15)
      answer = b
      display = `${a} + ? = ${a + b}`
      break
    case '−':
      a = randomInt(5, 20)
      b = randomInt(1, a)
      answer = b
      display = `${a} − ? = ${a - b}`
      break
    case '×':
      a = randomInt(2, 10)
      b = randomInt(2, 10)
      answer = b
      display = `${a} × ? = ${a * b}`
      break
  }

  return makeOptionsQuestion(display, answer, 8000)
}

function generateComparison() {
  const makeExpr = () => {
    const ops = ['+', '−', '×']
    const op = ops[randomInt(0, 2)]
    let a, b, value, text

    switch (op) {
      case '+':
        a = randomInt(1, 15)
        b = randomInt(1, 15)
        value = a + b
        text = `${a} + ${b}`
        break
      case '−':
        a = randomInt(5, 20)
        b = randomInt(1, a)
        value = a - b
        text = `${a} − ${b}`
        break
      case '×':
        a = randomInt(1, 10)
        b = randomInt(1, 10)
        value = a * b
        text = `${a} × ${b}`
        break
    }
    return { value, text }
  }

  const left = makeExpr()
  const right = makeExpr()

  let answer
  if (left.value > right.value) answer = '>'
  else if (left.value < right.value) answer = '<'
  else answer = '='

  return {
    display: `${left.text}  ?  ${right.text}`,
    answer,
    options: ['<', '=', '>'],
    type: 'comparison',
    timeLimit: 8000,
  }
}

// ─── LEVEL 3: The Order of Chaos ─────────────────────────────────
export function generateLevel3() {
  const questionType = randomInt(0, 2)

  switch (questionType) {
    case 0: return generatePEMDAS()
    case 1: return generateNegatives()
    case 2: return generateSquareRoot()
  }
}

function generatePEMDAS() {
  const patterns = [
    () => {
      const a = randomInt(1, 10)
      const b = randomInt(1, 10)
      const c = randomInt(1, 10)
      return { display: `${a} + ${b} × ${c}`, answer: a + b * c }
    },
    () => {
      const a = randomInt(1, 10)
      const b = randomInt(1, 10)
      const c = randomInt(1, 10)
      return { display: `${a} × ${b} + ${c}`, answer: a * b + c }
    },
    () => {
      const a = randomInt(2, 10)
      const b = randomInt(1, 10)
      const c = randomInt(1, a * b)
      return { display: `${a} × ${b} − ${c}`, answer: a * b - c }
    },
    () => {
      const a = randomInt(10, 30)
      const b = randomInt(1, 5)
      const c = randomInt(1, 5)
      return { display: `${a} − ${b} × ${c}`, answer: a - b * c }
    },
  ]

  const { display, answer } = patterns[randomInt(0, patterns.length - 1)]()
  return makeOptionsQuestion(display, answer, 10000)
}

function generateNegatives() {
  const patterns = [
    () => {
      const a = randomInt(1, 20)
      const b = randomInt(1, 15)
      return { display: `${a} − (−${b})`, answer: a + b }
    },
    () => {
      const a = randomInt(1, 15)
      const b = randomInt(1, 15)
      return { display: `−${a} + ${b}`, answer: -a + b }
    },
    () => {
      const a = randomInt(1, 10)
      const b = randomInt(1, 10)
      return { display: `(−${a}) × ${b}`, answer: -a * b }
    },
  ]

  const { display, answer } = patterns[randomInt(0, patterns.length - 1)]()
  return makeOptionsQuestion(display, answer, 10000)
}

function generateSquareRoot() {
  const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
  const sq = perfectSquares[randomInt(0, perfectSquares.length - 1)]
  const root = Math.sqrt(sq)
  const extra = randomInt(1, 10)
  const addOrSub = randomInt(0, 1)

  if (addOrSub === 0) {
    return makeOptionsQuestion(`√${sq} + ${extra}`, root + extra, 10000)
  } else {
    return makeOptionsQuestion(`√${sq} − ${extra}`, root - extra, 10000)
  }
}

// Master generator
export function generateQuestion(level) {
  switch (level) {
    case 1: return generateLevel1()
    case 2: return generateLevel2()
    case 3: return generateLevel3()
    default: return generateLevel1()
  }
}

/**
 * Practice Generator — Topic-based math question engine
 * Generates random questions per topic and difficulty (easy / medium / hard)
 * No backend needed — pure frontend logic
 */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) { [a, b] = [b, a % b] }
  return a
}

// ─────────────────────────────────────────────────────────
// TOPIC DEFINITIONS
// ─────────────────────────────────────────────────────────
export const TOPICS = [
  { id: 'arithmetic', name: 'Arithmetic', emoji: '➕', description: 'Addition, subtraction, multiplication, division' },
  { id: 'fractions', name: 'Fractions & Decimals', emoji: '🍕', description: 'Operations with fractions and decimals' },
  { id: 'percentages', name: 'Percentages', emoji: '💯', description: 'Percent of, increase, decrease, conversions' },
  { id: 'ratios', name: 'Ratios & Proportions', emoji: '⚖️', description: 'Simplify ratios, solve proportions, sharing' },
  { id: 'integers', name: 'Integers', emoji: '🔢', description: 'Operations with positive and negative integers' },
  { id: 'algebra', name: 'Algebra', emoji: '🔤', description: 'Linear equations, expressions, simplification' },
  { id: 'indices', name: 'Indices / Powers', emoji: '📐', description: 'Exponents, laws of indices, evaluation' },
  { id: 'quadratics', name: 'Quadratic Equations', emoji: '📈', description: 'Factoring, solving basic quadratics' },
  { id: 'wordproblems', name: 'Word Problems', emoji: '📝', description: 'Real-world math scenarios' },
]

export const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', emoji: '🟢', color: 'emerald' },
  { id: 'medium', name: 'Medium', emoji: '🟡', color: 'amber' },
  { id: 'hard', name: 'Hard', emoji: '🔴', color: 'rose' },
]

// ─────────────────────────────────────────────────────────
// GENERATORS
// ─────────────────────────────────────────────────────────

function generateArithmetic(difficulty) {
  const ops = ['+', '−', '×', '÷']

  if (difficulty === 'easy') {
    const op = pick(['+', '−', '×'])
    let a, b, answer, display
    if (op === '+') {
      a = randomInt(1, 50); b = randomInt(1, 50)
      answer = a + b; display = `${a} + ${b}`
    } else if (op === '−') {
      a = randomInt(10, 99); b = randomInt(1, a)
      answer = a - b; display = `${a} − ${b}`
    } else {
      a = randomInt(2, 12); b = randomInt(2, 12)
      answer = a * b; display = `${a} × ${b}`
    }
    return { display, answer, hint: `Basic ${op === '+' ? 'addition' : op === '−' ? 'subtraction' : 'multiplication'}` }
  }

  if (difficulty === 'medium') {
    const op = pick(ops)
    let a, b, answer, display
    if (op === '+') {
      a = randomInt(100, 999); b = randomInt(100, 999)
      answer = a + b; display = `${a} + ${b}`
    } else if (op === '−') {
      a = randomInt(200, 999); b = randomInt(100, a)
      answer = a - b; display = `${a} − ${b}`
    } else if (op === '×') {
      a = randomInt(10, 50); b = randomInt(2, 20)
      answer = a * b; display = `${a} × ${b}`
    } else {
      b = randomInt(2, 12); answer = randomInt(5, 30)
      a = b * answer; display = `${a} ÷ ${b}`
    }
    return { display, answer, hint: `Multi-digit arithmetic` }
  }

  // hard
  const type = randomInt(0, 2)
  if (type === 0) {
    const a = randomInt(100, 999); const b = randomInt(10, 99); const c = randomInt(10, 99)
    return { display: `${a} + ${b} × ${c}`, answer: a + b * c, hint: 'Remember BODMAS/PEMDAS: multiply first' }
  } else if (type === 1) {
    const b = randomInt(12, 50); const answer = randomInt(10, 50)
    const a = b * answer
    return { display: `${a} ÷ ${b}`, answer, hint: 'Large division' }
  } else {
    const a = randomInt(1000, 9999); const b = randomInt(1000, 9999)
    return { display: `${a} + ${b}`, answer: a + b, hint: 'Large number addition' }
  }
}

function generateFractions(difficulty) {
  if (difficulty === 'easy') {
    // Add simple fractions with same denominator
    const d = pick([2, 3, 4, 5, 6, 8, 10])
    const n1 = randomInt(1, d - 1)
    const n2 = randomInt(1, d - 1)
    const resultNum = n1 + n2
    const g = gcd(resultNum, d)
    const simplifiedNum = resultNum / g
    const simplifiedDen = d / g

    if (simplifiedDen === 1) {
      return { display: `${n1}/${d} + ${n2}/${d}`, answer: simplifiedNum, answerDisplay: `${simplifiedNum}`, hint: 'Add numerators, keep denominator, then simplify' }
    }
    return { display: `${n1}/${d} + ${n2}/${d}`, answer: `${simplifiedNum}/${simplifiedDen}`, hint: 'Add numerators, keep denominator, then simplify' }
  }

  if (difficulty === 'medium') {
    // Different denominators
    const d1 = pick([2, 3, 4, 5, 6])
    const d2 = pick([2, 3, 4, 5, 6].filter(x => x !== d1))
    const n1 = randomInt(1, d1 - 1)
    const n2 = randomInt(1, d2 - 1)
    const commonD = d1 * d2 / gcd(d1, d2)
    const resultNum = n1 * (commonD / d1) + n2 * (commonD / d2)
    const g = gcd(resultNum, commonD)
    const sn = resultNum / g
    const sd = commonD / g

    if (sd === 1) {
      return { display: `${n1}/${d1} + ${n2}/${d2}`, answer: `${sn}`, hint: 'Find LCD, convert, add, simplify' }
    }
    return { display: `${n1}/${d1} + ${n2}/${d2}`, answer: `${sn}/${sd}`, hint: 'Find LCD, convert, add, simplify' }
  }

  // hard — multiply fractions
  const n1 = randomInt(1, 7); const d1 = randomInt(2, 9)
  const n2 = randomInt(1, 7); const d2 = randomInt(2, 9)
  const rn = n1 * n2; const rd = d1 * d2
  const g = gcd(rn, rd)
  const sn = rn / g; const sd = rd / g

  if (sd === 1) {
    return { display: `${n1}/${d1} × ${n2}/${d2}`, answer: `${sn}`, hint: 'Multiply numerators and denominators, then simplify' }
  }
  return { display: `${n1}/${d1} × ${n2}/${d2}`, answer: `${sn}/${sd}`, hint: 'Multiply numerators and denominators, then simplify' }
}

function generatePercentages(difficulty) {
  if (difficulty === 'easy') {
    const percent = pick([10, 20, 25, 50, 75])
    const whole = pick([40, 50, 60, 80, 100, 120, 200])
    const answer = (percent / 100) * whole
    return { display: `What is ${percent}% of ${whole}?`, answer, hint: `${percent}% means ${percent}/100` }
  }

  if (difficulty === 'medium') {
    const type = randomInt(0, 1)
    if (type === 0) {
      const percent = randomInt(5, 95)
      const whole = pick([50, 80, 120, 150, 200, 250, 400])
      const answer = (percent / 100) * whole
      return { display: `What is ${percent}% of ${whole}?`, answer, hint: `Multiply ${whole} by ${percent}/100` }
    } else {
      // What percent is X of Y?
      const whole = pick([50, 80, 100, 200, 250])
      const part = randomInt(1, whole - 1)
      const answer = Math.round((part / whole) * 100 * 100) / 100
      return { display: `What percent is ${part} of ${whole}?`, answer, hint: `(${part} ÷ ${whole}) × 100`, answerSuffix: '%' }
    }
  }

  // hard — percentage increase/decrease
  const original = pick([80, 100, 120, 150, 200, 250])
  const percentChange = pick([10, 15, 20, 25, 30, 40])
  const increase = randomInt(0, 1) === 0
  const change = (percentChange / 100) * original
  const answer = increase ? original + change : original - change

  return {
    display: `${increase ? 'Increase' : 'Decrease'} ${original} by ${percentChange}%`,
    answer,
    hint: `${percentChange}% of ${original} = ${change}. Then ${increase ? 'add' : 'subtract'}.`
  }
}

function generateRatios(difficulty) {
  if (difficulty === 'easy') {
    // Simplify ratio
    const factor = randomInt(2, 6)
    const a = randomInt(1, 5) * factor
    const b = randomInt(1, 5) * factor
    const g = gcd(a, b)
    return { display: `Simplify the ratio ${a} : ${b}`, answer: `${a/g}:${b/g}`, hint: `Divide both by their GCD (${g})` }
  }

  if (difficulty === 'medium') {
    // Share in ratio
    const a = randomInt(1, 5); const b = randomInt(1, 5)
    const total = (a + b) * randomInt(5, 15)
    const shareA = (a / (a + b)) * total
    const shareB = (b / (a + b)) * total
    return { display: `Share ${total} in the ratio ${a}:${b}. What is the larger share?`, answer: Math.max(shareA, shareB), hint: `Total parts = ${a + b}. One part = ${total}/${a + b} = ${total / (a + b)}` }
  }

  // hard — proportion
  const a = randomInt(2, 8); const b = randomInt(2, 12)
  const c = a * randomInt(2, 6)
  const answer = (b * c) / a
  return { display: `If ${a}:${b} = ${c}:x, find x`, answer, hint: `Cross multiply: ${a} × x = ${b} × ${c}` }
}

function generateIntegers(difficulty) {
  if (difficulty === 'easy') {
    const op = pick(['+', '−'])
    const a = randomInt(-20, 20)
    const b = randomInt(-20, 20)
    const answer = op === '+' ? a + b : a - b
    const display = op === '+' ? `(${a}) + (${b})` : `(${a}) − (${b})`
    return { display, answer, hint: `Apply integer ${op === '+' ? 'addition' : 'subtraction'} rules` }
  }

  if (difficulty === 'medium') {
    const op = pick(['×', '÷'])
    if (op === '×') {
      const a = randomInt(-12, 12)
      const b = randomInt(-12, 12)
      return { display: `(${a}) × (${b})`, answer: a * b, hint: 'Same signs → positive, different signs → negative' }
    } else {
      const b = randomInt(-10, -2) || randomInt(2, 10)
      const answer = randomInt(-10, 10)
      const a = b * answer
      return { display: `(${a}) ÷ (${b})`, answer, hint: 'Same signs → positive result, different → negative' }
    }
  }

  // hard — combined operations
  const a = randomInt(-15, 15)
  const b = randomInt(-10, 10)
  const c = randomInt(-10, 10)
  const op1 = pick(['+', '−'])
  const op2 = pick(['×'])
  const answer = op1 === '+' ? a + b * c : a - b * c
  return { display: `(${a}) ${op1 === '+' ? '+' : '−'} (${b}) × (${c})`, answer, hint: 'Multiply first (BODMAS), then add/subtract' }
}

function generateAlgebra(difficulty) {
  if (difficulty === 'easy') {
    // x + a = b
    const answer = randomInt(1, 20)
    const a = randomInt(1, 15)
    const b = answer + a
    return { display: `Solve: x + ${a} = ${b}`, answer, hint: `x = ${b} − ${a}` }
  }

  if (difficulty === 'medium') {
    // ax + b = c
    const x = randomInt(1, 10)
    const a = randomInt(2, 8)
    const b = randomInt(1, 20)
    const c = a * x + b
    return { display: `Solve: ${a}x + ${b} = ${c}`, answer: x, hint: `${a}x = ${c} − ${b} = ${c - b}, so x = ${(c - b) / a}` }
  }

  // hard — ax + b = cx + d
  const x = randomInt(-5, 10)
  const a = randomInt(2, 7)
  const c = randomInt(1, a - 1)
  const b = randomInt(-10, 10)
  const d = (a - c) * x + b
  return { display: `Solve: ${a}x + ${b < 0 ? `(${b})` : b} = ${c}x + ${d < 0 ? `(${d})` : d}`, answer: x, hint: `Collect x terms: ${a - c}x = ${d - b}, x = ${(d - b) / (a - c)}` }
}

function generateIndices(difficulty) {
  if (difficulty === 'easy') {
    const base = randomInt(2, 10)
    const exp = randomInt(2, 3)
    return { display: `${base}${exp === 2 ? '²' : '³'} = ?`, answer: Math.pow(base, exp), hint: `${base} × ${base}${exp === 3 ? ` × ${base}` : ''} = ${Math.pow(base, exp)}` }
  }

  if (difficulty === 'medium') {
    const type = randomInt(0, 1)
    if (type === 0) {
      // Multiply same base: a^m × a^n
      const base = randomInt(2, 5)
      const m = randomInt(1, 4)
      const n = randomInt(1, 4)
      const answer = m + n
      return { display: `Simplify: ${base}${superscript(m)} × ${base}${superscript(n)}. Write the exponent.`, answer, hint: `When multiplying same base, add exponents: ${m} + ${n}` }
    } else {
      // (a^m)^n
      const base = randomInt(2, 4)
      const m = randomInt(2, 3)
      const n = randomInt(2, 3)
      return { display: `Simplify: (${base}${superscript(m)})${superscript(n)}. Write the final exponent.`, answer: m * n, hint: `Power of a power: multiply exponents: ${m} × ${n}` }
    }
  }

  // hard — negative or zero exponent
  const type = randomInt(0, 1)
  if (type === 0) {
    const base = randomInt(2, 10)
    return { display: `${base}⁰ = ?`, answer: 1, hint: 'Anything to the power 0 is 1' }
  } else {
    const base = randomInt(2, 5)
    return { display: `${base}⁻² = ? (give as a fraction)`, answer: `1/${base * base}`, hint: `Negative exponent means reciprocal: 1/${base}² = 1/${base * base}` }
  }
}

function superscript(n) {
  const supers = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
  return String(n).split('').map(c => supers[c] || c).join('')
}

function generateQuadratics(difficulty) {
  if (difficulty === 'easy') {
    // x² = a (perfect square)
    const x = randomInt(1, 12)
    return { display: `x² = ${x * x}. Find the positive value of x.`, answer: x, hint: `x = √${x * x}` }
  }

  if (difficulty === 'medium') {
    // (x - a)(x - b) = 0, find the roots
    const a = randomInt(-5, 8)
    const b = randomInt(-5, 8)
    // a != b for two distinct roots
    const actual_b = a === b ? b + 1 : b
    const sum = -(a + actual_b)
    const product = a * actual_b
    const displayB = sum >= 0 ? `+ ${sum}` : `− ${Math.abs(sum)}`
    const displayC = product >= 0 ? `+ ${product}` : `− ${Math.abs(product)}`
    const larger = Math.max(a, actual_b)
    const smaller = Math.min(a, actual_b)
    return {
      display: `x² ${displayB}x ${displayC} = 0. Find the larger root.`,
      answer: larger,
      hint: `Factor: (x − ${a})(x − ${actual_b}) = 0, so x = ${a} or x = ${actual_b}`
    }
  }

  // hard — complete factoring
  const a = randomInt(1, 6)
  const b = randomInt(1, 6)
  const sum = a + b
  const product = a * b
  return {
    display: `x² − ${sum}x + ${product} = 0. Find the sum of both roots.`,
    answer: sum,
    hint: `(x − ${a})(x − ${b}) = 0. Roots are ${a} and ${b}. Sum = ${sum}`
  }
}

function generateWordProblems(difficulty) {
  if (difficulty === 'easy') {
    const templates = [
      () => {
        const apples = randomInt(5, 20); const more = randomInt(3, 15)
        return { display: `Sarah has ${apples} apples. She buys ${more} more. How many does she have now?`, answer: apples + more, hint: `${apples} + ${more}` }
      },
      () => {
        const total = randomInt(20, 50); const gave = randomInt(5, total - 5)
        return { display: `A shop had ${total} items. ${gave} were sold. How many are left?`, answer: total - gave, hint: `${total} − ${gave}` }
      },
      () => {
        const packs = randomInt(3, 8); const perPack = randomInt(4, 12)
        return { display: `There are ${packs} packs with ${perPack} items each. How many items in total?`, answer: packs * perPack, hint: `${packs} × ${perPack}` }
      },
    ]
    return pick(templates)()
  }

  if (difficulty === 'medium') {
    const templates = [
      () => {
        const price = randomInt(5, 30); const qty = randomInt(3, 10); const paid = price * qty + randomInt(5, 50)
        const total = price * qty
        return { display: `An item costs $${price}. You buy ${qty} and pay with $${paid}. What change do you get?`, answer: paid - total, hint: `Total = ${qty} × $${price} = $${total}. Change = $${paid} − $${total}` }
      },
      () => {
        const speed = randomInt(40, 80); const time = randomInt(2, 6)
        return { display: `A car travels at ${speed} km/h for ${time} hours. How far does it travel?`, answer: speed * time, hint: `Distance = Speed × Time = ${speed} × ${time}`, answerSuffix: ' km' }
      },
      () => {
        const workers = randomInt(3, 8); const total = workers * randomInt(50, 150)
        return { display: `${workers} workers share $${total} equally. How much does each person get?`, answer: total / workers, hint: `$${total} ÷ ${workers}`, answerSuffix: '' }
      },
    ]
    return pick(templates)()
  }

  // hard
  const templates = [
    () => {
      const rate = randomInt(10, 25); const hours = randomInt(6, 12); const bonus = randomInt(20, 100)
      const answer = rate * hours + bonus
      return { display: `A worker earns $${rate}/hour. She works ${hours} hours and gets a $${bonus} bonus. What is her total pay?`, answer, hint: `($${rate} × ${hours}) + $${bonus}` }
    },
    () => {
      const percent = pick([10, 15, 20, 25])
      const original = pick([80, 100, 120, 150, 200])
      const discount = (percent / 100) * original
      return { display: `A $${original} item is discounted by ${percent}%. What is the sale price?`, answer: original - discount, hint: `Discount = ${percent}% of $${original} = $${discount}` }
    },
    () => {
      const a = randomInt(20, 50); const b = randomInt(10, 30)
      const total = a + b
      const diff = a - b
      return { display: `Two numbers add up to ${total} and differ by ${diff}. What is the larger number?`, answer: a, hint: `Larger = (${total} + ${diff}) / 2` }
    },
  ]
  return pick(templates)()
}

// ─────────────────────────────────────────────────────────
// MASTER GENERATOR
// ─────────────────────────────────────────────────────────
const generators = {
  arithmetic: generateArithmetic,
  fractions: generateFractions,
  percentages: generatePercentages,
  ratios: generateRatios,
  integers: generateIntegers,
  algebra: generateAlgebra,
  indices: generateIndices,
  quadratics: generateQuadratics,
  wordproblems: generateWordProblems,
}

/**
 * Generate a practice question
 * @param {string} topicId - Topic identifier
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {{ display: string, answer: number|string, hint?: string, answerSuffix?: string }}
 */
export function generatePracticeQuestion(topicId, difficulty) {
  const generator = generators[topicId]
  if (!generator) throw new Error(`Unknown topic: ${topicId}`)
  return generator(difficulty)
}

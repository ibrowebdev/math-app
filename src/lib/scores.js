/**
 * Score management via localStorage
 */

const STORAGE_KEY = 'brain-sprint-scores'

function getScores() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : { level1: [], level2: [], level3: [] }
  } catch {
    return { level1: [], level2: [], level3: [] }
  }
}

function saveScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

/**
 * Add a new game result
 * @param {number} level - 1, 2, or 3
 * @param {object} result - { score, questionsAnswered, date }
 */
export function addScore(level, result) {
  const scores = getScores()
  const key = `level${level}`
  
  scores[key].unshift({
    score: result.score,
    questionsAnswered: result.questionsAnswered,
    date: new Date().toISOString(),
    streak: result.streak || 0,
  })

  // Keep only last 50 records per level
  if (scores[key].length > 50) {
    scores[key] = scores[key].slice(0, 50)
  }

  saveScores(scores)
}

/**
 * Get high score for a level
 */
export function getHighScore(level) {
  const scores = getScores()
  const key = `level${level}`
  
  if (scores[key].length === 0) return 0
  return Math.max(...scores[key].map(s => s.score))
}

/**
 * Get all scores for a level
 */
export function getLevelScores(level) {
  const scores = getScores()
  return scores[`level${level}`] || []
}

/**
 * Get all scores
 */
export function getAllScores() {
  return getScores()
}

/**
 * Clear all scores
 */
export function clearAllScores() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Get best streak for a level
 */
export function getBestStreak(level) {
  const scores = getScores()
  const key = `level${level}`
  
  if (scores[key].length === 0) return 0
  return Math.max(...scores[key].map(s => s.streak || 0))
}

/**
 * Get total games played
 */
export function getTotalGamesPlayed() {
  const scores = getScores()
  return scores.level1.length + scores.level2.length + scores.level3.length
}

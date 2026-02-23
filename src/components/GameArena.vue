<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { generateQuestion } from '@/lib/questions.js'
import { addScore } from '@/lib/scores.js'

const props = defineProps({
  level: { type: Number, required: true }
})

const emit = defineEmits(['game-over', 'quit'])

// Game state
const gameState = ref('countdown') // countdown, playing, ended
const countdownNumber = ref(3)
const score = ref(0)
const questionsAnswered = ref(0)
const streak = ref(0)
const maxStreak = ref(0)

// Question state
const currentQuestion = ref(null)
const selectedOption = ref(null)
const timeLeft = ref(100) // percentage
const feedbackState = ref('') // '', 'correct', 'wrong'
const feedbackText = ref('')

// Timers
let timerInterval = null
let countdownInterval = null
let feedbackTimeout = null
let timerStartTime = null
let timerDuration = null

// Level meta
const levelMeta = computed(() => {
  const metas = {
    1: { name: 'The Reflex', emoji: '🔥', gradient: 'from-violet-600 to-purple-600', color: 'violet' },
    2: { name: 'The Logic Gap', emoji: '🧠', gradient: 'from-blue-600 to-cyan-600', color: 'blue' },
    3: { name: 'Order of Chaos', emoji: '⚡', gradient: 'from-indigo-600 to-violet-600', color: 'indigo' },
  }
  return metas[props.level] || metas[1]
})

const timerColorClass = computed(() => {
  if (timeLeft.value > 50) return 'bg-gradient-to-r from-green-500 to-emerald-500'
  if (timeLeft.value > 25) return 'bg-gradient-to-r from-yellow-500 to-amber-500'
  return 'bg-gradient-to-r from-red-500 to-rose-500'
})

const timerGlowClass = computed(() => {
  if (timeLeft.value > 50) return 'shadow-green-500/30'
  if (timeLeft.value > 25) return 'shadow-yellow-500/30'
  return 'shadow-red-500/30'
})

// ─── Countdown ───────────────────────────────────────────────────
onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  clearAllTimers()
})

function startCountdown() {
  gameState.value = 'countdown'
  countdownNumber.value = 3

  countdownInterval = setInterval(() => {
    countdownNumber.value--
    if (countdownNumber.value <= 0) {
      clearInterval(countdownInterval)
      countdownInterval = null
      startPlaying()
    }
  }, 800)
}

// ─── Game Loop ───────────────────────────────────────────────────
function startPlaying() {
  gameState.value = 'playing'
  loadNextQuestion()
}

function loadNextQuestion() {
  feedbackState.value = ''
  selectedOption.value = null
  currentQuestion.value = generateQuestion(props.level)
  timeLeft.value = 100
  startTimer()
}

function startTimer() {
  clearTimer()
  const duration = currentQuestion.value.timeLimit
  timerStartTime = Date.now()
  timerDuration = duration

  timerInterval = setInterval(() => {
    const elapsed = Date.now() - timerStartTime
    const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
    timeLeft.value = remaining

    if (remaining <= 0) {
      clearTimer()
      handleTimeout()
    }
  }, 50)
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function clearAllTimers() {
  clearTimer()
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout)
    feedbackTimeout = null
  }
}

// ─── Answer Handling ─────────────────────────────────────────────
function pickOption(option) {
  if (!currentQuestion.value || gameState.value !== 'playing') return
  if (selectedOption.value !== null) return // already picked

  clearTimer()
  selectedOption.value = option

  const isCorrect = (option === currentQuestion.value.answer)

  if (isCorrect) {
    handleCorrect()
  } else {
    handleWrong()
  }
}

function handleCorrect() {
  score.value += calculatePoints()
  questionsAnswered.value++
  streak.value++
  if (streak.value > maxStreak.value) maxStreak.value = streak.value
  feedbackState.value = 'correct'
  feedbackText.value = getCorrectMessage()

  feedbackTimeout = setTimeout(() => {
    loadNextQuestion()
  }, 600)
}

function handleWrong() {
  feedbackState.value = 'wrong'
  feedbackText.value = `Correct: ${currentQuestion.value.answer}`
  gameState.value = 'ended'

  addScore(props.level, {
    score: score.value,
    questionsAnswered: questionsAnswered.value,
    streak: maxStreak.value,
  })

  feedbackTimeout = setTimeout(() => {
    emit('game-over', {
      score: score.value,
      questionsAnswered: questionsAnswered.value,
      streak: maxStreak.value,
      reason: 'wrong',
    })
  }, 1500)
}

function handleTimeout() {
  feedbackState.value = 'wrong'
  feedbackText.value = `Time's up! Answer: ${currentQuestion.value.answer}`
  gameState.value = 'ended'

  addScore(props.level, {
    score: score.value,
    questionsAnswered: questionsAnswered.value,
    streak: maxStreak.value,
  })

  feedbackTimeout = setTimeout(() => {
    emit('game-over', {
      score: score.value,
      questionsAnswered: questionsAnswered.value,
      streak: maxStreak.value,
      reason: 'timeout',
    })
  }, 1500)
}

function calculatePoints() {
  const basePoints = props.level * 10
  const timeBonus = Math.round(timeLeft.value / 10)
  const streakBonus = Math.min(streak.value * 2, 20)
  return basePoints + timeBonus + streakBonus
}

function getCorrectMessage() {
  const messages = ['Perfect! ✨', 'Correct! 🎯', 'Nice! 🔥', 'Great! ⚡', 'Awesome! 💎', 'Brilliant! 🌟']
  return messages[Math.floor(Math.random() * messages.length)]
}

function getOptionClass(option) {
  if (selectedOption.value === null) {
    // Not yet selected — default hoverable state
    return 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet-500/40 hover:scale-[1.03] cursor-pointer'
  }

  // After selection
  if (option === currentQuestion.value.answer) {
    // This is the correct answer — always highlight green
    return 'bg-green-500/20 border-green-500/50 scale-[1.03] ring-2 ring-green-500/30'
  }

  if (option === selectedOption.value) {
    // This is what the user picked AND it's wrong
    return 'bg-red-500/20 border-red-500/50 animate-shake ring-2 ring-red-500/30'
  }

  // Other unselected options — fade out
  return 'bg-white/3 border-white/5 opacity-40'
}

function confirmQuit() {
  clearAllTimers()
  if (score.value > 0) {
    addScore(props.level, {
      score: score.value,
      questionsAnswered: questionsAnswered.value,
      streak: maxStreak.value,
    })
  }
  emit('quit')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8">
    <!-- COUNTDOWN STATE -->
    <div v-if="gameState === 'countdown'" class="text-center">
      <div class="mb-6">
        <span :class="['inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold', `bg-gradient-to-r ${levelMeta.gradient} text-white`]">
          {{ levelMeta.emoji }} Level {{ level }} — {{ levelMeta.name }}
        </span>
      </div>
      <div class="text-9xl font-black animate-countdown bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent" :key="countdownNumber">
        {{ countdownNumber }}
      </div>
      <p class="text-slate-400 mt-4 text-lg">Get ready...</p>
    </div>

    <!-- PLAYING STATE -->
    <div v-else-if="gameState === 'playing' || gameState === 'ended'" class="w-full max-w-lg mx-auto">
      <!-- Top Bar -->
      <div class="flex items-center justify-between mb-6 animate-slide-down">
        <button
          id="quit-game-btn"
          @click="confirmQuit"
          class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors cursor-pointer group"
        >
          <svg class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Quit
        </button>

        <div class="flex items-center gap-4">
          <!-- Streak -->
          <div v-if="streak > 0" class="flex items-center gap-1 text-amber-400 animate-score-pop">
            <span class="text-sm font-bold">{{ streak }}🔥</span>
          </div>
          <!-- Score -->
          <div class="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <span class="text-xs text-slate-500">Score</span>
            <span class="text-lg font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent" :class="{ 'animate-score-pop': feedbackState === 'correct' }">
              {{ score }}
            </span>
          </div>
        </div>
      </div>

      <!-- Timer Bar -->
      <div class="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden shadow-inner">
        <div
          :class="['h-full rounded-full transition-all duration-100 shadow-md', timerColorClass, timerGlowClass]"
          :style="{ width: timeLeft + '%' }"
        ></div>
      </div>

      <!-- Question Card -->
      <div :class="[
        'glass-strong rounded-3xl p-8 md:p-10 text-center mb-6 transition-all duration-300',
        feedbackState === 'correct' ? 'ring-2 ring-green-500/50 animate-correct' : '',
        feedbackState === 'wrong' && selectedOption === null ? 'ring-2 ring-red-500/50 animate-shake' : '',
      ]">
        <!-- Question number -->
        <div class="mb-4">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Question {{ questionsAnswered + 1 }}
          </span>
        </div>

        <!-- Question display -->
        <div class="text-3xl md:text-5xl font-bold text-white mb-4 font-mono tracking-wider leading-relaxed" v-if="currentQuestion">
          {{ currentQuestion.display }}
        </div>

        <!-- Feedback text -->
        <div v-if="feedbackState" class="animate-scale-in">
          <p :class="[
            'text-lg font-bold',
            feedbackState === 'correct' ? 'text-green-400' : 'text-red-400'
          ]">
            {{ feedbackText }}
          </p>
        </div>
      </div>

      <!-- Option Buttons -->
      <div v-if="currentQuestion" class="grid grid-cols-2 gap-3 mb-6">
        <button
          v-for="(option, idx) in currentQuestion.options"
          :key="idx"
          @click="pickOption(option)"
          :id="`option-${idx}`"
          :disabled="selectedOption !== null"
          :class="[
            'relative py-5 px-4 rounded-2xl border-2 text-center transition-all duration-200 font-bold text-xl md:text-2xl',
            getOptionClass(option),
          ]"
        >
          <!-- Option letter badge -->
          <span class="absolute top-2.5 left-3 text-[10px] font-semibold text-slate-600 uppercase">
            {{ ['A', 'B', 'C', 'D'][idx] }}
          </span>
          {{ option }}
        </button>
      </div>

      <!-- Bottom info -->
      <div class="text-center text-xs text-slate-600">
        <span>Level {{ level }} • {{ levelMeta.name }} • {{ questionsAnswered }} answered</span>
      </div>
    </div>
    <footer class="mt-16 text-center text-slate-500">
        Made with ❤️ by <a href="mailto:yusufikeolapo2002@gmail.com" target="_blank" class="text-violet-400 hover:text-violet-300 transition-colors">ibrowebdev</a>
      </footer>
  </div>
</template>

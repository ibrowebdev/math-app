<script setup>
import { ref, computed, onMounted } from 'vue'
import { TOPICS, DIFFICULTIES, generatePracticeQuestion } from '@/lib/practiceGenerator.js'

const emit = defineEmits(['back'])

const showContent = ref(false)

// Settings
const selectedTopic = ref(TOPICS[0].id)
const selectedDifficulty = ref('easy')

// Question state
const currentQuestion = ref(null)
const userAnswer = ref('')
const feedbackState = ref('') // '', 'correct', 'wrong'
const showHint = ref(false)

// Stats for current session
const sessionStats = ref({ correct: 0, wrong: 0, total: 0 })

// Persistent stats
const STORAGE_KEY = 'brain-sprint-practice-stats'

function loadStats() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch { return {} }
}

function saveSessionStats() {
  if (sessionStats.value.total === 0) return
  const all = loadStats()
  const key = `${selectedTopic.value}_${selectedDifficulty.value}`
  if (!all[key]) all[key] = { correct: 0, wrong: 0, total: 0 }
  all[key].correct += sessionStats.value.correct
  all[key].wrong += sessionStats.value.wrong
  all[key].total += sessionStats.value.total
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

// Computed
const currentTopicMeta = computed(() => TOPICS.find(t => t.id === selectedTopic.value))
const currentDifficultyMeta = computed(() => DIFFICULTIES.find(d => d.id === selectedDifficulty.value))
const accuracy = computed(() => {
  if (sessionStats.value.total === 0) return 0
  return Math.round((sessionStats.value.correct / sessionStats.value.total) * 100)
})

// Actions
function generateQuestion() {
  feedbackState.value = ''
  userAnswer.value = ''
  showHint.value = false
  currentQuestion.value = generatePracticeQuestion(selectedTopic.value, selectedDifficulty.value)
}

function checkAnswer() {
  if (!currentQuestion.value || userAnswer.value.trim() === '') return
  
  const userVal = userAnswer.value.trim().toLowerCase().replace(/\s/g, '')
  const correctVal = String(currentQuestion.value.answer).trim().toLowerCase().replace(/\s/g, '')

  sessionStats.value.total++

  if (userVal === correctVal || parseFloat(userVal) === parseFloat(correctVal)) {
    feedbackState.value = 'correct'
    sessionStats.value.correct++
  } else {
    feedbackState.value = 'wrong'
    sessionStats.value.wrong++
  }

  saveSessionStats()
}

function nextQuestion() {
  generateQuestion()
}

function resetSession() {
  sessionStats.value = { correct: 0, wrong: 0, total: 0 }
  currentQuestion.value = null
  feedbackState.value = ''
  userAnswer.value = ''
  showHint.value = false
}

function handleTopicChange() {
  resetSession()
}

function handleDifficultyChange() {
  resetSession()
}

function handleKeydown(e) {
  if (e.key === 'Enter') {
    if (feedbackState.value) {
      nextQuestion()
    } else if (currentQuestion.value) {
      checkAnswer()
    }
  }
}

function goBack() {
  saveSessionStats()
  emit('back')
}

onMounted(() => {
  setTimeout(() => { showContent.value = true }, 100)
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <!-- Header -->
    <div :class="['w-full max-w-2xl mx-auto mb-6', showContent ? 'animate-slide-down' : 'opacity-0']">
      <button
        id="back-from-practice-btn"
        @click="goBack"
        class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer group"
      >
        <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-lg">
          📚
        </div>
        <div>
          <h2 class="text-2xl md:text-3xl font-bold">
            <span class="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Practice Generator</span>
          </h2>
          <p class="text-sm text-slate-500">Topic-based math practice for all levels</p>
        </div>
      </div>
    </div>

    <div :class="['w-full max-w-2xl mx-auto', showContent ? 'animate-slide-up' : 'opacity-0']">
      <!-- Settings Panel -->
      <div class="glass-strong rounded-2xl p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Topic Selector -->
          <div>
            <label for="topic-select" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              📖 Math Topic
            </label>
            <select
              id="topic-select"
              v-model="selectedTopic"
              @change="handleTopicChange"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer appearance-none"
              style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M7%207l3%203%203-3%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 12px center; padding-right: 40px;"
            >
              <option v-for="topic in TOPICS" :key="topic.id" :value="topic.id" class="bg-slate-900">
                {{ topic.emoji }} {{ topic.name }}
              </option>
            </select>
          </div>

          <!-- Difficulty Selector -->
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              🎯 Difficulty
            </label>
            <div class="flex gap-2">
              <button
                v-for="diff in DIFFICULTIES"
                :key="diff.id"
                @click="selectedDifficulty = diff.id; handleDifficultyChange()"
                :id="`difficulty-${diff.id}-btn`"
                :class="[
                  'flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-center',
                  selectedDifficulty === diff.id
                    ? diff.id === 'easy' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : diff.id === 'medium' ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                ]"
              >
                {{ diff.emoji }} {{ diff.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Topic description -->
        <div class="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <span>{{ currentTopicMeta?.emoji }}</span>
          <span>{{ currentTopicMeta?.description }}</span>
        </div>

        <!-- Generate button -->
        <button
          id="generate-question-btn"
          @click="generateQuestion"
          class="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold hover:from-violet-500 hover:to-blue-500 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-violet-500/20 cursor-pointer text-sm"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generate Question
          </span>
        </button>
      </div>

      <!-- Session Stats -->
      <div v-if="sessionStats.total > 0" class="grid grid-cols-3 gap-3 mb-6">
        <div class="glass rounded-xl p-3 text-center">
          <p class="text-lg font-bold text-emerald-400">{{ sessionStats.correct }}</p>
          <p class="text-xs text-slate-500">Correct</p>
        </div>
        <div class="glass rounded-xl p-3 text-center">
          <p class="text-lg font-bold text-rose-400">{{ sessionStats.wrong }}</p>
          <p class="text-xs text-slate-500">Wrong</p>
        </div>
        <div class="glass rounded-xl p-3 text-center">
          <p class="text-lg font-bold" :class="accuracy >= 70 ? 'text-emerald-400' : accuracy >= 40 ? 'text-amber-400' : 'text-rose-400'">{{ accuracy }}%</p>
          <p class="text-xs text-slate-500">Accuracy</p>
        </div>
      </div>

      <!-- Question Card -->
      <div v-if="currentQuestion" :class="[
        'glass-strong rounded-2xl p-6 md:p-8 mb-6 transition-all duration-300',
        feedbackState === 'correct' ? 'ring-2 ring-emerald-500/50 animate-correct' : '',
        feedbackState === 'wrong' ? 'ring-2 ring-rose-500/50 animate-shake' : '',
      ]">
        <!-- Topic + Difficulty badge -->
        <div class="flex items-center gap-2 mb-4 flex-wrap">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300">
            {{ currentTopicMeta?.emoji }} {{ currentTopicMeta?.name }}
          </span>
          <span :class="[
            'text-xs font-semibold px-2.5 py-1 rounded-full',
            selectedDifficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-300' :
            selectedDifficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' :
            'bg-rose-500/20 text-rose-300'
          ]">
            {{ currentDifficultyMeta?.emoji }} {{ currentDifficultyMeta?.name }}
          </span>
        </div>

        <!-- Question display -->
        <div class="text-xl md:text-3xl font-bold text-white mb-6 font-mono leading-relaxed">
          {{ currentQuestion.display }}
        </div>

        <!-- Answer input -->
        <div v-if="!feedbackState" class="space-y-4">
          <div class="flex gap-3">
            <input
              v-model="userAnswer"
              type="text"
              id="practice-answer-input"
              @keydown="handleKeydown"
              class="flex-1 bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white text-lg font-medium focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600"
              placeholder="Your answer..."
              autocomplete="off"
              autofocus
            />
            <button
              id="check-answer-btn"
              @click="checkAnswer"
              :disabled="userAnswer.trim() === ''"
              :class="[
                'px-6 py-3 rounded-xl font-bold transition-all cursor-pointer text-sm',
                userAnswer.trim() !== ''
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
              ]"
            >
              Check
            </button>
          </div>

          <!-- Hint toggle -->
          <div v-if="currentQuestion.hint">
            <button
              id="show-hint-btn"
              @click="showHint = !showHint"
              class="text-xs text-slate-500 hover:text-violet-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {{ showHint ? 'Hide hint' : 'Show hint' }}
            </button>
            <Transition name="hint">
              <p v-if="showHint" class="mt-2 text-sm text-slate-400 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                💡 {{ currentQuestion.hint }}
              </p>
            </Transition>
          </div>
        </div>

        <!-- Feedback -->
        <div v-if="feedbackState" class="animate-scale-in">
          <!-- Correct -->
          <div v-if="feedbackState === 'correct'" class="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-4">
            <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg shrink-0">✅</div>
            <div>
              <p class="font-bold text-emerald-400">Correct!</p>
              <p class="text-sm text-slate-400">Great job! The answer is <span class="font-mono font-bold text-white">{{ currentQuestion.answer }}{{ currentQuestion.answerSuffix || '' }}</span></p>
            </div>
          </div>

          <!-- Wrong -->
          <div v-if="feedbackState === 'wrong'" class="flex items-center gap-3 p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 mb-4">
            <div class="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-lg shrink-0">❌</div>
            <div>
              <p class="font-bold text-rose-400">Incorrect</p>
              <p class="text-sm text-slate-400">
                Your answer: <span class="font-mono text-rose-300">{{ userAnswer }}</span>
                <br/>
                Correct answer: <span class="font-mono font-bold text-white">{{ currentQuestion.answer }}{{ currentQuestion.answerSuffix || '' }}</span>
              </p>
              <p v-if="currentQuestion.hint" class="text-xs text-slate-500 mt-1">💡 {{ currentQuestion.hint }}</p>
            </div>
          </div>

          <!-- Next question button -->
          <button
            id="next-question-btn"
            @click="nextQuestion"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold hover:from-violet-500 hover:to-blue-500 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
          >
            <span class="flex items-center justify-center gap-2">
              Next Question →
            </span>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!currentQuestion" class="glass rounded-2xl p-10 text-center">
        <div class="text-4xl mb-3">🧮</div>
        <p class="text-slate-400 font-medium mb-1">Ready to practice?</p>
        <p class="text-sm text-slate-500">Select a topic and difficulty, then click "Generate Question"</p>
      </div>

      <!-- Footer -->
      <footer class="mt-10 text-center text-slate-500 text-sm">
        Made with ❤️ by <a href="mailto:yusufikeolapo2002@gmail.com" target="_blank" class="text-violet-400 hover:text-violet-300 transition-colors">Yusuf Ibrohim</a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllScores, getHighScore, getBestStreak, clearAllScores } from '@/lib/scores.js'

const emit = defineEmits(['back'])

const showContent = ref(false)
const activeTab = ref(1)
const showClearConfirm = ref(false)

const allScores = ref({ level1: [], level2: [], level3: [] })
const highScores = ref({ 1: 0, 2: 0, 3: 0 })
const bestStreaks = ref({ 1: 0, 2: 0, 3: 0 })

const tabs = [
  { id: 1, name: 'Level 1', emoji: '🔥', label: 'The Reflex', color: 'violet' },
  { id: 2, name: 'Level 2', emoji: '🧠', label: 'The Logic Gap', color: 'blue' },
  { id: 3, name: 'Level 3', emoji: '⚡', label: 'Order of Chaos', color: 'indigo' },
]

function loadScores() {
  allScores.value = getAllScores()
  for (let i = 1; i <= 3; i++) {
    highScores.value[i] = getHighScore(i)
    bestStreaks.value[i] = getBestStreak(i)
  }
}

function handleClearScores() {
  clearAllScores()
  loadScores()
  showClearConfirm.value = false
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

function currentScores() {
  return allScores.value[`level${activeTab.value}`] || []
}

onMounted(() => {
  loadScores()
  setTimeout(() => { showContent.value = true }, 100)
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <!-- Header -->
    <div :class="['w-full max-w-2xl mx-auto mb-8', showContent ? 'animate-slide-down' : 'opacity-0']">
      <button
        id="back-from-scores-btn"
        @click="emit('back')"
        class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer group"
      >
        <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 class="text-3xl md:text-4xl font-bold mb-2">
        <span class="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Scoreboard</span>
      </h2>
      <p class="text-slate-400">Track your progress across all levels</p>
    </div>

    <div :class="['w-full max-w-2xl mx-auto', showContent ? 'animate-slide-up' : 'opacity-0']">
      <!-- Overview cards -->
      <div class="grid grid-cols-3 gap-3 mb-8">
        <div v-for="i in 3" :key="i" class="glass rounded-xl p-4 text-center">
          <p class="text-xs text-slate-500 mb-1">Level {{ i }} Best</p>
          <p class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            {{ highScores[i] || '—' }}
          </p>
          <p v-if="bestStreaks[i] > 0" class="text-xs text-amber-400 mt-1">{{ bestStreaks[i] }}🔥 streak</p>
        </div>
      </div>

      <!-- Tab buttons -->
      <div class="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :id="`tab-level-${tab.id}`"
          :class="[
            'flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            activeTab === tab.id
              ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          ]"
        >
          <span class="flex items-center justify-center gap-1.5">
            <span>{{ tab.emoji }}</span>
            <span class="hidden sm:inline">{{ tab.name }}</span>
            <span class="sm:hidden">L{{ tab.id }}</span>
          </span>
        </button>
      </div>

      <!-- Score list -->
      <div class="space-y-2">
        <div v-if="currentScores().length === 0" class="glass rounded-xl p-10 text-center">
          <p class="text-4xl mb-3">📊</p>
          <p class="text-slate-400 font-medium">No games played yet at this level</p>
          <p class="text-sm text-slate-500 mt-1">Start a sprint to see your scores here!</p>
        </div>

        <div
          v-for="(entry, index) in currentScores()"
          :key="index"
          class="glass rounded-xl px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-all"
        >
          <div class="flex items-center gap-4">
            <!-- Rank -->
            <div :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
              index === 0 ? 'bg-amber-500/20 text-amber-400' :
              index === 1 ? 'bg-slate-400/20 text-slate-300' :
              index === 2 ? 'bg-orange-500/20 text-orange-400' :
              'bg-white/5 text-slate-500'
            ]">
              {{ index + 1 }}
            </div>

            <div>
              <p class="font-bold text-white text-lg">{{ entry.score }}</p>
              <p class="text-xs text-slate-500">{{ entry.questionsAnswered }} questions</p>
            </div>
          </div>

          <div class="text-right">
            <p v-if="entry.streak > 0" class="text-sm text-amber-400 font-semibold">{{ entry.streak }}🔥</p>
            <p class="text-xs text-slate-600 mt-0.5">{{ formatDate(entry.date) }}</p>
          </div>
        </div>
      </div>

      <!-- Clear scores button -->
      <div class="mt-8 text-center">
        <button
          v-if="!showClearConfirm"
          @click="showClearConfirm = true"
          id="clear-scores-btn"
          class="text-sm text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
        >
          Clear all scores
        </button>
        <div v-else class="flex items-center justify-center gap-3">
          <span class="text-sm text-red-400">Are you sure?</span>
          <button
            @click="handleClearScores"
            id="confirm-clear-btn"
            class="text-sm px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer font-semibold"
          >
            Yes, clear
          </button>
          <button
            @click="showClearConfirm = false"
            id="cancel-clear-btn"
            class="text-sm px-4 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

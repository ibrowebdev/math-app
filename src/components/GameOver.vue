<script setup>
import { ref, computed, onMounted } from 'vue'
import { getHighScore } from '@/lib/scores.js'

const props = defineProps({
  result: { type: Object, required: true },
  level: { type: Number, required: true },
})

const emit = defineEmits(['play-again', 'home', 'change-level'])

const showContent = ref(false)
const showConfetti = ref(false)

const highScore = computed(() => getHighScore(props.level))
const isNewHighScore = computed(() => props.result.score >= highScore.value && props.result.score > 0)

const levelMeta = computed(() => {
  const metas = {
    1: { name: 'The Reflex', emoji: '🔥', gradient: 'from-violet-600 to-purple-600' },
    2: { name: 'The Logic Gap', emoji: '🧠', gradient: 'from-blue-600 to-cyan-600' },
    3: { name: 'Order of Chaos', emoji: '⚡', gradient: 'from-indigo-600 to-violet-600' },
  }
  return metas[props.level] || metas[1]
})

const reasonDisplay = computed(() => {
  if (props.result.reason === 'timeout') return { icon: '⏰', text: 'Time ran out!' }
  return { icon: '❌', text: 'Wrong answer!' }
})

const performanceMessage = computed(() => {
  const q = props.result.questionsAnswered
  if (q === 0) return { emoji: '😅', text: 'Better luck next time!' }
  if (q <= 3) return { emoji: '💪', text: 'Keep practicing!' }
  if (q <= 7) return { emoji: '🔥', text: 'Not bad at all!' }
  if (q <= 12) return { emoji: '⭐', text: 'Impressive performance!' }
  if (q <= 20) return { emoji: '🏆', text: 'Outstanding!' }
  return { emoji: '👑', text: 'Legendary run!' }
})

// Confetti particles
const confettiParticles = ref([])
function generateConfetti() {
  const colors = ['#8B5CF6', '#3B82F6', '#6366F1', '#A855F7', '#2DD4BF', '#F59E0B', '#EC4899']
  confettiParticles.value = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 2 + 2,
  }))
}

onMounted(() => {
  setTimeout(() => { showContent.value = true }, 100)
  
  if (isNewHighScore.value) {
    showConfetti.value = true
    generateConfetti()
    setTimeout(() => { showConfetti.value = false }, 4000)
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
    <!-- Confetti -->
    <div v-if="showConfetti" class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div
        v-for="p in confettiParticles"
        :key="p.id"
        class="absolute animate-confetti rounded-sm"
        :style="{
          left: p.left + '%',
          width: p.size + 'px',
          height: p.size + 'px',
          backgroundColor: p.color,
          animationDelay: p.delay + 's',
          animationDuration: p.duration + 's',
        }"
      ></div>
    </div>

    <div :class="['w-full max-w-md mx-auto text-center', showContent ? 'animate-slide-up' : 'opacity-0']">
      <!-- Game Over Header -->
      <div class="mb-8">
        <div class="text-6xl mb-4">{{ reasonDisplay.icon }}</div>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">Game Over</h2>
        <p class="text-slate-400 text-lg">{{ reasonDisplay.text }}</p>
      </div>

      <!-- Score Card -->
      <div class="glass-strong rounded-3xl p-8 mb-8">
        <!-- New High Score badge -->
        <div v-if="isNewHighScore" class="mb-4 animate-score-pop">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold">
            🏆 New High Score!
          </span>
        </div>

        <!-- Main Score -->
        <div class="mb-6">
          <p class="text-sm text-slate-500 mb-2 uppercase tracking-wider font-medium">Final Score</p>
          <p class="text-6xl md:text-7xl font-black bg-gradient-to-r from-violet-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {{ result.score }}
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white/5 rounded-xl p-3">
            <p class="text-2xl font-bold text-white">{{ result.questionsAnswered }}</p>
            <p class="text-xs text-slate-500 mt-1">Answered</p>
          </div>
          <div class="bg-white/5 rounded-xl p-3">
            <p class="text-2xl font-bold text-amber-400">{{ result.streak }}🔥</p>
            <p class="text-xs text-slate-500 mt-1">Best Streak</p>
          </div>
          <div class="bg-white/5 rounded-xl p-3">
            <p class="text-2xl font-bold text-white">{{ levelMeta.emoji }} {{ level }}</p>
            <p class="text-xs text-slate-500 mt-1">Level</p>
          </div>
        </div>

        <!-- Performance message -->
        <div class="mt-6 flex items-center justify-center gap-2 text-slate-300">
          <span class="text-2xl">{{ performanceMessage.emoji }}</span>
          <span class="font-medium">{{ performanceMessage.text }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3">
        <button
          id="play-again-btn"
          @click="emit('play-again')"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-lg hover:from-violet-500 hover:to-blue-500 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-500/20 cursor-pointer"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Play Again
          </span>
        </button>

        <div class="flex gap-3">
          <button
            id="change-level-btn"
            @click="emit('change-level')"
            class="flex-1 py-3.5 rounded-2xl glass text-slate-300 font-semibold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            Change Level
          </button>
          <button
            id="go-home-btn"
            @click="emit('home')"
            class="flex-1 py-3.5 rounded-2xl glass text-slate-300 font-semibold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

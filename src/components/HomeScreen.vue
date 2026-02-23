<script setup>
import { ref, onMounted } from 'vue'
import { getTotalGamesPlayed, getHighScore } from '@/lib/scores.js'

const emit = defineEmits(['start', 'scoreboard'])

const totalGames = ref(0)
const bestOverall = ref(0)
const showContent = ref(false)

onMounted(() => {
  totalGames.value = getTotalGamesPlayed()
  bestOverall.value = Math.max(getHighScore(1), getHighScore(2), getHighScore(3))
  setTimeout(() => { showContent.value = true }, 100)
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8">
    <!-- Main content -->
    <div :class="['text-center max-w-2xl mx-auto', showContent ? 'animate-slide-up' : 'opacity-0']">
      <!-- Logo / Title -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 mb-6 animate-float shadow-lg shadow-violet-500/25">
          <span class="text-4xl">⚡</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          <span class="bg-gradient-to-r from-violet-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
            Brain Sprint
          </span>
        </h1>
        <p class="text-lg md:text-xl text-slate-400 font-light max-w-md mx-auto leading-relaxed">
          Train your mind. Sharpen your reflexes. <br/>
          <span class="text-violet-300 font-medium">How fast can you calculate?</span>
        </p>
      </div>

      <!-- Stats badges -->
      <div v-if="totalGames > 0" class="flex items-center justify-center gap-4 mb-10">
        <div class="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span class="text-violet-400 text-sm">🎮</span>
          <span class="text-sm text-slate-300">{{ totalGames }} games played</span>
        </div>
        <div class="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span class="text-yellow-400 text-sm">🏆</span>
          <span class="text-sm text-slate-300">Best: {{ bestOverall }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="start-game-btn"
          @click="emit('start')"
          class="group relative px-10 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span class="relative z-10 flex items-center gap-2">
            <svg class="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Sprint
          </span>
        </button>

        <button
          id="scoreboard-btn"
          @click="emit('scoreboard')"
          class="px-8 py-4 rounded-2xl font-semibold text-slate-300 glass hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Scoreboard
          </span>
        </button>
      </div>

      <!-- Level preview -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
        <div class="glass rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 cursor-default group">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
          <h3 class="text-sm font-bold text-violet-300 mb-1">Level 1</h3>
          <p class="text-xs text-slate-500">The Reflex</p>
        </div>
        <div class="glass rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 cursor-default group">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🧠</div>
          <h3 class="text-sm font-bold text-blue-300 mb-1">Level 2</h3>
          <p class="text-xs text-slate-500">The Logic Gap</p>
        </div>
        <div class="glass rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 cursor-default group">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
          <h3 class="text-sm font-bold text-indigo-300 mb-1">Level 3</h3>
          <p class="text-xs text-slate-500">Order of Chaos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHighScore, getBestStreak } from '@/lib/scores.js'

const emit = defineEmits(['select', 'back'])
const showContent = ref(false)

const levels = ref([
  {
    id: 1,
    name: 'The Reflex',
    subtitle: 'Foundations & Recall',
    emoji: '🔥',
    color: 'violet',
    description: 'Pure speed. Single-step operations the brain should know by heart.',
    examples: ['8 + 7', '13 − 6', '9 × 4'],
    focus: 'Addition, Subtraction, Multiplication (up to 10×10)',
    timer: '5 seconds',
    highScore: 0,
    bestStreak: 0,
    gradient: 'from-violet-600 to-purple-600',
    gradientLight: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-300',
    badgeColor: 'bg-violet-500/20 text-violet-300',
  },
  {
    id: 2,
    name: 'The Logic Gap',
    subtitle: 'Algebraic Thinking',
    emoji: '🧠',
    color: 'blue',
    description: 'Working backward. Find the missing piece or compare two values.',
    examples: ['6 × ? = 42', '15 + 4  [?]  3 × 7'],
    focus: 'Fill in the blank & Comparison operators (>, <, =)',
    timer: '8 seconds',
    highScore: 0,
    bestStreak: 0,
    gradient: 'from-blue-600 to-cyan-600',
    gradientLight: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-300',
    badgeColor: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 3,
    name: 'Order of Chaos',
    subtitle: 'Multi-Step & Rules',
    emoji: '⚡',
    color: 'indigo',
    description: 'High-pressure rule following. Apply PEMDAS/BODMAS and handle negatives.',
    examples: ['2 + 5 × 3 = ?', '10 − (−4)', '√49 + 3'],
    focus: 'Two-step equations, Negatives & Square roots',
    timer: '10 seconds',
    highScore: 0,
    bestStreak: 0,
    gradient: 'from-indigo-600 to-violet-600',
    gradientLight: 'from-indigo-500/20 to-violet-500/20',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-300',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
  },
])

onMounted(() => {
  levels.value.forEach(level => {
    level.highScore = getHighScore(level.id)
    level.bestStreak = getBestStreak(level.id)
  })
  setTimeout(() => { showContent.value = true }, 100)
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <!-- Header -->
    <div :class="['w-full max-w-3xl mx-auto mb-8', showContent ? 'animate-slide-down' : 'opacity-0']">
      <button
        id="back-home-btn"
        @click="emit('back')"
        class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer group"
      >
        <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 class="text-3xl md:text-4xl font-bold mb-2">
        <span class="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Choose Your Challenge</span>
      </h2>
      <p class="text-slate-400">Select a difficulty level to begin your sprint</p>
    </div>

    <!-- Level Cards -->
    <div class="w-full max-w-3xl mx-auto space-y-5">
      <div
        v-for="(level, index) in levels"
        :key="level.id"
        :class="[
          'glass-strong rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group',
          `hover:${level.borderColor}`,
          showContent ? 'animate-slide-up' : 'opacity-0'
        ]"
        :style="{ animationDelay: `${index * 100 + 150}ms` }"
        @click="emit('select', level.id)"
        :id="`level-${level.id}-card`"
      >
        <div class="flex flex-col md:flex-row md:items-start gap-4">
          <!-- Icon & Title -->
          <div class="flex items-start gap-4 flex-1">
            <div :class="[
              'w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3',
              level.gradient
            ]">
              {{ level.emoji }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1 flex-wrap">
                <h3 class="text-xl font-bold text-white">{{ level.name }}</h3>
                <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', level.badgeColor]">
                  Level {{ level.id }}
                </span>
              </div>
              <p class="text-sm text-slate-400 font-medium mb-2">{{ level.subtitle }}</p>
              <p class="text-sm text-slate-500 leading-relaxed">{{ level.description }}</p>

              <!-- Details Row -->
              <div class="flex flex-wrap gap-3 mt-3">
                <div class="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ level.timer }}
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ level.focus }}
                </div>
              </div>

              <!-- Examples -->
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="(ex, i) in level.examples"
                  :key="i"
                  class="text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 font-mono"
                >
                  {{ ex }}
                </span>
              </div>
            </div>
          </div>

          <!-- Scores -->
          <div class="flex md:flex-col items-center md:items-end gap-3 md:gap-2 shrink-0 md:text-right">
            <div v-if="level.highScore > 0">
              <p class="text-xs text-slate-500 mb-0.5">High Score</p>
              <p :class="['text-xl font-bold', level.textColor]">{{ level.highScore }}</p>
            </div>
            <div v-if="level.bestStreak > 0">
              <p class="text-xs text-slate-500 mb-0.5">Best Streak</p>
              <p class="text-lg font-bold text-amber-400">{{ level.bestStreak }}🔥</p>
            </div>
            <div class="flex items-center gap-1 text-slate-500 group-hover:text-white transition-colors mt-2">
              <span class="text-sm font-medium">Play</span>
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <footer class="mt-16 text-center text-slate-500">
        Made with ❤️ by <a href="mailto:yusufikeolapo2002@gmail.com" target="_blank" class="text-violet-400 hover:text-violet-300 transition-colors">ibrowebdev</a>
      </footer>
    </div>
  </div>
</template>

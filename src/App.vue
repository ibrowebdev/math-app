<script setup>
import { ref } from 'vue'
import HomeScreen from './components/HomeScreen.vue'
import LevelSelect from './components/LevelSelect.vue'
import GameArena from './components/GameArena.vue'
import GameOver from './components/GameOver.vue'
import ScoreBoard from './components/ScoreBoard.vue'

const currentScreen = ref('home') // home, levelSelect, game, gameOver, scoreboard
const selectedLevel = ref(1)
const gameResult = ref(null)

function goToLevelSelect() {
  currentScreen.value = 'levelSelect'
}

function startGame(level) {
  selectedLevel.value = level
  currentScreen.value = 'game'
}

function endGame(result) {
  gameResult.value = result
  currentScreen.value = 'gameOver'
}

function goHome() {
  currentScreen.value = 'home'
  gameResult.value = null
}

function goToScoreboard() {
  currentScreen.value = 'scoreboard'
}

function playAgain() {
  currentScreen.value = 'game'
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 relative overflow-hidden">
    <!-- Ambient background effects -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]"></div>
      <div class="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px]"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <Transition name="fade" mode="out-in">
        <HomeScreen
          v-if="currentScreen === 'home'"
          @start="goToLevelSelect"
          @scoreboard="goToScoreboard"
        />
        <LevelSelect
          v-else-if="currentScreen === 'levelSelect'"
          @select="startGame"
          @back="goHome"
        />
        <GameArena
          v-else-if="currentScreen === 'game'"
          :level="selectedLevel"
          @game-over="endGame"
          @quit="goHome"
        />
        <GameOver
          v-else-if="currentScreen === 'gameOver'"
          :result="gameResult"
          :level="selectedLevel"
          @play-again="playAgain"
          @home="goHome"
          @change-level="goToLevelSelect"
        />
        <ScoreBoard
          v-else-if="currentScreen === 'scoreboard'"
          @back="goHome"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

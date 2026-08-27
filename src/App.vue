<script setup>
import { onMounted } from 'vue'

import { useWeatherStore } from '@/stores/weatherStore'
import NavigationBar from '@/components/exercise/NavigationBar.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const weatherStore = useWeatherStore()

onMounted(() => {
  weatherStore.fetchWeatherList()
})
</script>

<template>
  <div class="app-shell">
    <header class="app-top">
      <NavigationBar />

      <UnitToggler />
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: clamp(20px, 4vw, 48px);
  padding-bottom: 96px;
}

.app-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--divider);
}

@media (max-width: 520px) {
  .app-tools {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 8px;
  }

  .app-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

.app-shell > * {
  width: 100%;
  max-width: 1080px;
}
</style>

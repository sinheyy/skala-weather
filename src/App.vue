<script setup>
import NavigationBar from '@/components/exercise/NavigationBar.vue'
</script>

<template>
  <div class="app-shell">
    <NavigationBar />

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

.app-shell > * {
  width: 100%;
  max-width: 1080px;
}
</style>

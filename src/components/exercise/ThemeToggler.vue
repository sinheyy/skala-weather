<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button class="theme-btn" type="button" @click="configStore.toggleTheme()">
    <span aria-hidden="true">{{ configStore.themeIcon }}</span>
    {{ configStore.isDark ? '다크' : '라이트' }}
  </button>
</template>

<style scoped>
.theme-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border: 1px solid var(--divider);
  border-radius: 10px;
  background: var(--card-bg);
  font-size: 0.76rem;
  font-family: inherit;
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-soft);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.theme-btn:hover {
  border-color: var(--accent);
  color: var(--text-strong);
}

.theme-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
</style>

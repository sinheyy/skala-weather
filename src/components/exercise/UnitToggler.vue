<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <p class="unit-status">
      날씨 단위:
      <b class="unit-value">{{ configStore.unitName }}({{ configStore.unitSymbol }})</b>
    </p>

    <button class="unit-btn" type="button" @click="configStore.toggleUnit()">단위 변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
}

.unit-status {
  font-size: 0.78rem;
  white-space: nowrap;
  color: var(--text-soft);
}

.unit-value {
  font-weight: 700;
  color: var(--text-strong);
}

.unit-btn {
  padding: 7px 12px;
  border: 1px solid var(--accent);
  border-radius: 10px;
  background: var(--accent);
  font-size: 0.76rem;
  font-family: inherit;
  font-weight: 700;
  white-space: nowrap;
  color: #ffffff;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.1s ease;
}

.unit-btn:hover {
  filter: brightness(1.08);
}

.unit-btn:active {
  transform: scale(0.98);
}

.unit-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

@media (prefers-color-scheme: dark) {
  .unit-btn {
    color: #08192b;
  }
}
</style>

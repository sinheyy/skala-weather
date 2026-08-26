<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <section class="panel">
    <h2 class="panel-title" v-if="title">{{ title }}</h2>
    <slot></slot>
  </section>
</template>

<style scoped>
.panel {
  padding: 20px;
  border: 1px solid var(--panel-border);
  border-radius: 20px;
  background: var(--panel-bg);
  backdrop-filter: blur(10px);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-strong);
}

.panel-title::before {
  content: '';
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: var(--accent);
}
</style>

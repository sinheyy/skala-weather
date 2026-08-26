<script setup>
defineProps({
  keyword: { type: String, default: '' },
})

defineEmits(['update-query'])
</script>

<template>
  <div class="search-box">
    <span class="search-icon" aria-hidden="true">🔍</span>
    <input
      class="search-input"
      type="text"
      :value="keyword"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
  </div>

  <p class="search-status">
    검색 중인 도시: <span class="search-keyword">{{ keyword }}</span>
  </p>
</template>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--panel-border);
  border-radius: 14px;
  background: var(--card-bg);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(31, 116, 201, 0.18);
}

.search-icon {
  font-size: 0.95rem;
  opacity: 0.7;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 1rem;
  font-family: inherit;
  color: var(--text-strong);
}

.search-input::placeholder {
  color: var(--text-soft);
}

.search-status {
  margin-top: 12px;
  font-size: 0.88rem;
  color: var(--text-soft);
}

.search-keyword {
  font-weight: 700;
  color: var(--text-strong);
}
</style>

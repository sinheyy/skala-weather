<script setup>
defineProps({
  keyword: { type: String, default: '' },
})

defineEmits(['update-query', 'select-first'])
</script>

<template>
  <div class="search-box">
    <span class="search-icon" aria-hidden="true">🔍</span>
    <input
      class="search-input"
      type="text"
      :value="keyword"
      @input="$emit('update-query', $event.target.value)"
      @keyup.enter="$emit('select-first')"
      @keyup.esc="$emit('update-query', '')"
      placeholder="검색할 도시 이름 입력"
    />
  </div>

  <p class="search-hint"><kbd>Enter</kbd> 첫 번째 도시 선택 · <kbd>Esc</kbd> 검색어 지우기</p>

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

.search-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  font-size: 0.76rem;
  color: var(--text-soft);
}

.search-hint kbd {
  padding: 2px 6px;
  border: 1px solid var(--divider);
  border-radius: 6px;
  background: var(--card-bg);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-strong);
}

.search-status {
  margin-top: 8px;
  font-size: 0.88rem;
  color: var(--text-soft);
}

.search-keyword {
  font-weight: 700;
  color: var(--text-strong);
}
</style>

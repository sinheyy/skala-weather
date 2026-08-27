<script setup>
import { computed } from 'vue'

import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  cities: { type: Array, required: true },
})

const tempRankList = computed(() => {
  return [...props.cities].sort((a, b) => b.temp - a.temp).slice(0, 10)
})

const displayTemp = (rawTemp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
}

const averageTemp = computed(() => {
  const total = props.cities.reduce((sum, item) => sum + item.temp, 0)

  return displayTemp(total / props.cities.length).toFixed(1)
})

const rainyCityCount = computed(() => {
  return props.cities.filter((item) => item.status === '🌧️비').length
})
</script>

<template>
  <dl class="rank-summary">
    <div class="rank-stat">
      <dt>전국 평균</dt>
      <dd>{{ averageTemp }}{{ configStore.unitSymbol }}</dd>
    </div>
    <div class="rank-stat">
      <dt>비 오는 지역</dt>
      <dd>{{ rainyCityCount }}곳</dd>
    </div>
  </dl>

  <p class="rank-caption">🔥 기온 높은 순</p>

  <ol class="rank-list">
    <li class="rank-item" v-for="(item, index) in tempRankList" :key="item.id">
      <span class="rank-no" :class="{ 'rank-no--top': index < 3 }">{{ index + 1 }}</span>
      <span class="rank-city">{{ item.name }}</span>
      <span class="rank-value">{{ displayTemp(item.temp) }}{{ configStore.unitSymbol }}</span>
    </li>
  </ol>
</template>

<style scoped>
.rank-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 0 0 14px;
  padding: 12px 14px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
}

.rank-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rank-stat dt {
  font-size: 0.7rem;
  color: var(--text-soft);
}

.rank-stat dd {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-strong);
}

.rank-caption {
  margin-bottom: 10px;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-soft);
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0 6px 0 0;
  list-style: none;

  max-height: 296px;
  overflow-y: auto;
  overscroll-behavior: contain;

  scrollbar-width: thin;
  scrollbar-color: rgba(19, 62, 102, 0.3) transparent;
}

.rank-list::-webkit-scrollbar {
  width: 6px;
}

.rank-list::-webkit-scrollbar-track {
  background: transparent;
}

.rank-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(19, 62, 102, 0.3);
}

.rank-list::-webkit-scrollbar-thumb:hover {
  background: rgba(19, 62, 102, 0.45);
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 12px;
  background: var(--card-bg);
}

.rank-no {
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 8px;
  background: rgba(19, 62, 102, 0.1);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-soft);
}

.rank-no--top {
  background: var(--accent);
  color: #ffffff;
}

.rank-city {
  flex: 1;
  min-width: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-strong);
}

.rank-value {
  font-size: 0.92rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-soft);
}

:root[data-theme='dark'] .rank-no {
  background: rgba(255, 255, 255, 0.1);
}

:root[data-theme='dark'] .rank-no--top {
  color: #08192b;
}

:root[data-theme='dark'] .rank-list {
  scrollbar-color: rgba(255, 255, 255, 0.26) transparent;
}

:root[data-theme='dark'] .rank-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.26);
}

:root[data-theme='dark'] .rank-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>

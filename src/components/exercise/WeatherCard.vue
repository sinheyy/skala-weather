<script setup>
import { computed } from 'vue'

import { useConfigStore } from '@/stores/configStore'
import { useFavoriteStore } from '@/stores/favoriteStore'

const props = defineProps({
  city: { type: Object, required: true },
})

defineEmits(['select-card', 'click-detail', 'show-recommend'])

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const displayTemp = computed(() => {
  const rawTemp = props.city.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const hotStandard = computed(() => (configStore.unit === 'fahrenheit' ? 77 : 25))
</script>

<template>
  <article class="city-card" @click="$emit('select-card', city.name)">
    <div class="city-card__head">
      <h3 class="city-name">
        <button
          class="favorite-btn"
          :class="{ 'favorite-btn--on': favoriteStore.isFavorite(city.id) }"
          type="button"
          @click.stop="favoriteStore.toggleFavorite(city.id)"
        >
          {{ favoriteStore.isFavorite(city.id) ? '★' : '☆' }}
        </button>
        {{ city.name }}
      </h3>
      <button class="city-status" type="button" @click.stop="$emit('show-recommend', city.status)">
        {{ city.status }}
      </button>
    </div>

    <div class="temp-block">
      <p class="temp-label">현재 기온</p>
      <p class="city-temp">
        {{ displayTemp }}<span class="temp-unit">{{ configStore.unitSymbol }}</span>
      </p>
    </div>

    <div class="temp-badge temp-badge--hot" v-if="city.temp >= 25">
      🔥 더움 ({{ hotStandard }}도 이상)
    </div>
    <div class="temp-badge temp-badge--cool" v-else>❄️ 선선함 ({{ hotStandard }}도 미만)</div>

    <dl class="metrics">
      <div class="metric">
        <dt>강수량</dt>
        <dd>{{ city.precipitation }}mm</dd>
      </div>
      <div class="metric">
        <dt>습도</dt>
        <dd>{{ city.humidity }}%</dd>
      </div>
    </dl>

    <button class="detail-btn" @click.stop="$emit('click-detail', city.id)">상세보기</button>
  </article>
</template>

<style scoped>
.city-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--panel-border);
  border-radius: 18px;
  background: var(--card-bg);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.city-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(19, 62, 102, 0.2);
}

.city-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.city-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-strong);
}

.favorite-btn {
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 1.1rem;
  line-height: 1;
  color: var(--text-soft);
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.1s ease;
}

.favorite-btn--on {
  color: #f0a92e;
}

.favorite-btn:active {
  transform: scale(0.9);
}

.city-status {
  padding: 4px 10px;
  border: 1px solid var(--divider);
  border-radius: 999px;
  background: transparent;
  font-size: 0.85rem;
  font-family: inherit;
  color: var(--text-soft);
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.city-status:hover {
  background: rgba(31, 116, 201, 0.12);
  color: var(--text-strong);
}

.temp-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.temp-label {
  font-size: 0.74rem;
  color: var(--text-soft);
}

.city-temp {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--text-strong);
}

.temp-unit {
  margin-left: 3px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-soft);
}

.temp-badge {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.temp-badge--hot {
  background: rgba(244, 132, 71, 0.18);
  color: #b8511a;
}

.temp-badge--cool {
  background: rgba(66, 153, 225, 0.18);
  color: #1c62a8;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 0;
  padding-top: 12px;
  border-top: 1px dashed var(--divider);
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric dt {
  font-size: 0.72rem;
  color: var(--text-soft);
}

.metric dd {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}

.detail-btn {
  margin-top: auto;
  padding: 9px 12px;
  border: 0;
  border-radius: 12px;
  background: var(--accent);
  color: #ffffff;
  font-size: 0.86rem;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.1s ease;
}

.detail-btn:hover {
  filter: brightness(1.08);
}

.detail-btn:active {
  transform: scale(0.98);
}

:root[data-theme='dark'] .temp-badge--hot {
  background: rgba(255, 153, 94, 0.18);
  color: #ffb488;
}

:root[data-theme='dark'] .temp-badge--cool {
  background: rgba(124, 192, 247, 0.18);
  color: #9fd0fb;
}

:root[data-theme='dark'] .city-card:hover {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
}

:root[data-theme='dark'] .detail-btn {
  color: #08192b;
}
</style>

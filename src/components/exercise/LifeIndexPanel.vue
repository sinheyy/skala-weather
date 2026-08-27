<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: { type: Object, default: null },
})

const laundryIndex = computed(() => {
  if (props.city.temp >= 23 && props.city.humidity <= 55 && props.city.precipitation <= 0) {
    return '추천👍'
  }

  return '비추천👎'
})

const carWashIndex = computed(() => {
  if (props.city.temp < 32 && props.city.precipitation <= 0) {
    return '추천👍'
  }

  return '비추천👎'
})

const umbrellaIndex = computed(() => {
  if (props.city.precipitation > 0) {
    return '추천👍'
  }

  return '비추천👎'
})
</script>

<template>
  <template v-if="city">
    <div class="index-grid">
      <div class="index-card">
        <span class="index-icon" aria-hidden="true">🧺</span>
        <p class="index-name">빨래지수</p>
        <p
          class="index-value"
          :class="laundryIndex === '추천👍' ? 'index-value--good' : 'index-value--bad'"
        >
          {{ laundryIndex }}
        </p>
      </div>

      <div class="index-card">
        <span class="index-icon" aria-hidden="true">🚗</span>
        <p class="index-name">세차지수</p>
        <p
          class="index-value"
          :class="carWashIndex === '추천👍' ? 'index-value--good' : 'index-value--bad'"
        >
          {{ carWashIndex }}
        </p>
      </div>

      <div class="index-card">
        <span class="index-icon" aria-hidden="true">☂️</span>
        <p class="index-name">우산지수</p>
        <p
          class="index-value"
          :class="umbrellaIndex === '추천👍' ? 'index-value--good' : 'index-value--bad'"
        >
          {{ umbrellaIndex }}
        </p>
      </div>
    </div>

    <p class="side-caption">
      <b class="side-target">{{ city.name }}</b
      >의 기온 · 습도 · 강수량으로 계산했어요.
    </p>
  </template>

  <p class="side-empty" v-else>
    <span class="side-empty__icon" aria-hidden="true">👆</span>
    도시를 선택하면 생활지수를 보여드려요.
  </p>
</template>

<style scoped>
.index-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.index-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 6px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
  text-align: center;
}

.index-icon {
  font-size: 1.45rem;
  line-height: 1;
}

.index-name {
  font-size: 0.72rem;
  white-space: nowrap;
  color: var(--text-soft);
}

.index-value {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.index-value--good {
  background: rgba(43, 164, 113, 0.18);
  color: #17734d;
}

.index-value--bad {
  background: rgba(19, 62, 102, 0.1);
  color: var(--text-soft);
}

.side-caption {
  margin-top: 12px;
  font-size: 0.74rem;
  line-height: 1.5;
  color: var(--text-soft);
}

.side-target {
  color: var(--text-strong);
}

.side-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 26px 12px;
  border: 1px dashed var(--divider);
  border-radius: 14px;
  font-size: 0.85rem;
  text-align: center;
  color: var(--text-soft);
}

.side-empty__icon {
  font-size: 1.3rem;
}

:root[data-theme='dark'] .index-value--good {
  background: rgba(126, 217, 178, 0.18);
  color: #8fe0b8;
}

:root[data-theme='dark'] .index-value--bad {
  background: rgba(255, 255, 255, 0.08);
}
</style>

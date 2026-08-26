<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import LifeIndexPanel from '@/components/exercise/LifeIndexPanel.vue'
import { weatherList, weatherRecommend } from '@/data/weatherData'

const route = useRoute()

const city = ref(null)

onMounted(() => {
  city.value = weatherList.find((item) => item.id === route.params.cityId) ?? null
})

const recommend = computed(() => {
  const found = weatherRecommend.find((item) => item.status === city.value.status)

  return found ? found.recommend : '추천 정보가 없는 날씨예요.'
})

const averageTemp = computed(() => {
  const total = weatherList.reduce((sum, item) => sum + item.temp, 0)

  return total / weatherList.length
})

const tempGap = computed(() => (city.value.temp - averageTemp.value).toFixed(1))
</script>

<template>
  <div class="detail-page">
    <RouterLink class="back-link" to="/">
      <span aria-hidden="true">←</span>
      목록으로 돌아가기
    </RouterLink>

    <template v-if="city">
      <header class="page-header">
        <p class="page-eyebrow">CITY DETAIL</p>
        <h1 class="page-title">{{ city.name }}</h1>
      </header>

      <BaseDashboardCard title="현재 날씨">
        <div class="summary">
          <div class="summary-main">
            <p class="summary-status">{{ city.status }}</p>
            <p class="summary-temp">{{ city.temp }}<span class="temp-unit">℃</span></p>

            <div class="temp-badge temp-badge--hot" v-if="city.temp >= 25">🔥 더움 (25도 이상)</div>
            <div class="temp-badge temp-badge--cool" v-else>❄️ 선선함 (25도 미만)</div>
          </div>

          <dl class="metrics">
            <div class="metric">
              <dt>습도</dt>
              <dd>{{ city.humidity }}%</dd>
            </div>
            <div class="metric">
              <dt>강수량</dt>
              <dd>{{ city.precipitation }}mm</dd>
            </div>
            <div class="metric">
              <dt>전국 평균 대비</dt>
              <dd>{{ tempGap > 0 ? `+${tempGap}` : tempGap }}℃</dd>
            </div>
          </dl>
        </div>

        <p class="recommend">
          <span class="recommend-icon" aria-hidden="true">💬</span>
          {{ recommend }}
        </p>
      </BaseDashboardCard>

      <BaseDashboardCard title="생활지수">
        <LifeIndexPanel :city="city" />
      </BaseDashboardCard>
    </template>

    <div class="not-found" v-else>
      <p class="not-found-title">도시를 찾을 수 없습니다</p>
      <p class="not-found-desc">
        <b>{{ route.params.cityId }}</b
        >에 해당하는 지역이 없어요.
      </p>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.back-link {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--text-soft);
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-strong);
}

.back-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--text-soft);
}

.page-title {
  font-size: clamp(1.9rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text-strong);
}

.summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 20px;
  align-items: center;
}

@media (max-width: 640px) {
  .summary {
    grid-template-columns: 1fr;
  }
}

.summary-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-status {
  font-size: 0.95rem;
  color: var(--text-soft);
}

.summary-temp {
  font-size: 3.6rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--text-strong);
}

.temp-unit {
  margin-left: 4px;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-soft);
}

.temp-badge {
  align-self: flex-start;
  margin-top: 4px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 0;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 12px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
}

.metric dt {
  font-size: 0.7rem;
  white-space: nowrap;
  color: var(--text-soft);
}

.metric dd {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-strong);
}

.recommend {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 14px;
  border-top: 1px dashed var(--divider);
  padding-left: 0;
  padding-right: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.recommend-icon {
  flex: none;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 20px;
  border: 1px dashed var(--divider);
  border-radius: 20px;
  text-align: center;
}

.not-found-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-strong);
}

.not-found-desc {
  font-size: 0.88rem;
  color: var(--text-soft);
}

.not-found-desc b {
  font-weight: 700;
  color: var(--text-strong);
}

@media (prefers-color-scheme: dark) {
  .temp-badge--hot {
    background: rgba(255, 153, 94, 0.18);
    color: #ffb488;
  }

  .temp-badge--cool {
    background: rgba(124, 192, 247, 0.18);
    color: #9fd0fb;
  }
}
</style>

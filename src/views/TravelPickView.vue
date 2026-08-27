<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useWeatherStore } from '@/stores/weatherStore'
import { useTourStore } from '@/stores/tourStore'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import OutfitPanel from '@/components/exercise/OutfitPanel.vue'
import TravelSpotPanel from '@/components/exercise/TravelSpotPanel.vue'

const router = useRouter()
const weatherStore = useWeatherStore()
const tourStore = useTourStore()

const tempPick = ref('cool')
const rainPick = ref('dry')
const humidityPick = ref('low')

const getScore = (city) => {
  const tempScore = tempPick.value === 'cool' ? 100 - (city.temp - 20) * 6 : (city.temp - 20) * 6

  const rainScore =
    rainPick.value === 'dry' ? 100 - city.precipitation * 1.5 : city.precipitation * 1.5

  const humidityScore =
    humidityPick.value === 'low' ? 100 - (city.humidity - 40) * 2 : (city.humidity - 40) * 2

  return Math.max(0, Math.round((tempScore + rainScore + humidityScore) / 3))
}

const scoreRankList = computed(() =>
  weatherStore.weatherList
    .map((item) => ({ ...item, score: getScore(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5),
)

const bestCity = computed(() => scoreRankList.value[0] ?? null)

const bestComment = computed(() => {
  if (!bestCity.value) {
    return ''
  }

  if (bestCity.value.score >= 80) {
    return '지금 당장 떠나도 좋은 날씨예요!'
  }

  if (bestCity.value.score >= 60) {
    return '나쁘지 않아요. 가볍게 다녀오기 좋아요.'
  }

  return '오늘은 집에서 쉬는 것도 방법이에요.'
})

const pickSummary = computed(() => {
  const tempLabel = tempPick.value === 'cool' ? '선선한 곳' : '따뜻한 곳'
  const rainLabel = rainPick.value === 'dry' ? '비 안 오는 곳' : '비 오는 곳'
  const humidityLabel = humidityPick.value === 'low' ? '습도 낮은 곳' : '습도 높은 곳'

  return `${tempLabel} · ${rainLabel} · ${humidityLabel}`
})

const showDetail = (cityId) => {
  router.push({ name: 'detail', params: { cityId } })
}

watch(bestCity, (newValue, oldValue) => {
  if (!newValue) {
    return
  }

  if (oldValue) {
    console.log(`[watch👀-bestCity] 1위 변경: ${oldValue.name} -> ${newValue.name}`)
  }

  tourStore.fetchSpots(newValue)
})

onMounted(() => {
  if (bestCity.value) {
    tourStore.fetchSpots(bestCity.value)
  }
})

watch(pickSummary, (newValue) => {
  console.log(`[watch👀-pickSummary] 여행 기준 변경: ${newValue}`)
})
</script>

<template>
  <div class="travel-page">
    <header class="page-header">
      <p class="page-eyebrow">TRAVEL</p>
      <h1 class="page-title">여행지 추천</h1>
    </header>

    <BaseDashboardCard title="무엇을 중요하게 볼까요?">
      <div class="pick-row">
        <p class="pick-title">🌡️ 기온</p>
        <div class="pick-group">
          <button
            class="pick-btn"
            :class="{ 'pick-btn--on': tempPick === 'cool' }"
            type="button"
            @click="tempPick = 'cool'"
          >
            선선한 곳
          </button>
          <button
            class="pick-btn"
            :class="{ 'pick-btn--on': tempPick === 'warm' }"
            type="button"
            @click="tempPick = 'warm'"
          >
            따뜻한 곳
          </button>
        </div>
      </div>

      <div class="pick-row">
        <p class="pick-title">☂️ 강수량</p>
        <div class="pick-group">
          <button
            class="pick-btn"
            :class="{ 'pick-btn--on': rainPick === 'dry' }"
            type="button"
            @click="rainPick = 'dry'"
          >
            비 안 오는 곳
          </button>
          <button
            class="pick-btn"
            :class="{ 'pick-btn--on': rainPick === 'rainy' }"
            type="button"
            @click="rainPick = 'rainy'"
          >
            비 오는 곳
          </button>
        </div>
      </div>

      <div class="pick-row">
        <p class="pick-title">💧 습도</p>
        <div class="pick-group">
          <button
            class="pick-btn"
            :class="{ 'pick-btn--on': humidityPick === 'low' }"
            type="button"
            @click="humidityPick = 'low'"
          >
            습도 낮은 곳
          </button>
          <button
            class="pick-btn"
            :class="{ 'pick-btn--on': humidityPick === 'high' }"
            type="button"
            @click="humidityPick = 'high'"
          >
            습도 높은 곳
          </button>
        </div>
      </div>

      <p class="pick-caption">
        지금 기준: <b>{{ pickSummary }}</b>
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard title="오늘의 추천 여행지">
      <template v-if="bestCity">
        <div class="best">
          <div class="best-info">
            <p class="best-crown" aria-hidden="true">👑</p>
            <p class="best-name">{{ bestCity.name }}</p>
            <p class="best-comment">{{ bestComment }}</p>
          </div>
          <p class="best-score">{{ bestCity.score }}<span class="best-unit">점</span></p>
        </div>

        <OutfitPanel :city="bestCity" />
      </template>

      <p class="empty" v-else>날씨 데이터를 불러오는 중입니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="가볼 만한 곳" v-if="bestCity">
      <TravelSpotPanel
        :city="bestCity"
        :spots="tourStore.spotList"
        :is-loading="tourStore.isLoading"
        :error-message="tourStore.errorMessage"
      />
    </BaseDashboardCard>

    <BaseDashboardCard title="여행 점수 TOP 5">
      <ol class="score-list">
        <li class="score-item" v-for="(item, index) in scoreRankList" :key="item.id">
          <span class="score-no" :class="{ 'score-no--top': index === 0 }">{{ index + 1 }}</span>
          <div class="score-body">
            <p class="score-city">
              {{ item.name }} <span class="score-status">{{ item.status }}</span>
            </p>
            <div class="score-bar">
              <div class="score-bar__fill" :style="{ width: item.score + '%' }"></div>
            </div>
          </div>
          <span class="score-value">{{ item.score }}점</span>
          <button class="score-btn" type="button" @click="showDetail(item.id)">상세보기</button>
        </li>
      </ol>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.travel-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
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

.pick-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}

.pick-title {
  flex: none;
  width: 74px;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text-strong);
}

.pick-group {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.pick-btn {
  padding: 11px 10px;
  border: 1px solid var(--divider);
  border-radius: 12px;
  background: var(--card-bg);
  font-size: 0.86rem;
  font-family: inherit;
  font-weight: 700;
  color: var(--text-soft);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.pick-btn--on {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}

.pick-caption {
  margin-top: 12px;
  font-size: 0.78rem;
  color: var(--text-soft);
}

.pick-caption b {
  font-weight: 700;
  color: var(--text-strong);
}

@media (max-width: 600px) {
  .pick-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .pick-title {
    width: auto;
  }
}

.best {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  padding: 16px 18px;
  border: 1px solid var(--divider);
  border-radius: 16px;
  background: var(--card-bg);
}

.best-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.best-crown {
  font-size: 1.2rem;
  line-height: 1;
}

.best-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-strong);
}

.best-comment {
  font-size: 0.82rem;
  color: var(--text-soft);
}

.best-score {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--accent);
}

.best-unit {
  margin-left: 3px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-soft);
}

.empty {
  padding: 26px 12px;
  border: 1px dashed var(--divider);
  border-radius: 14px;
  font-size: 0.85rem;
  text-align: center;
  color: var(--text-soft);
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--card-bg);
}

.score-no {
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

.score-no--top {
  background: var(--accent);
  color: #ffffff;
}

.score-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.score-city {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-strong);
}

.score-status {
  font-size: 0.76rem;
  font-weight: 500;
  color: var(--text-soft);
}

.score-bar {
  height: 6px;
  border-radius: 999px;
  background: rgba(19, 62, 102, 0.12);
  overflow: hidden;
}

.score-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
  transition: width 0.25s ease;
}

.score-value {
  flex: none;
  font-size: 0.86rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-soft);
}

.score-btn {
  flex: none;
  padding: 7px 12px;
  border: 1px solid var(--divider);
  border-radius: 10px;
  background: transparent;
  font-size: 0.78rem;
  font-family: inherit;
  font-weight: 700;
  color: var(--text-soft);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.score-btn:hover {
  background: rgba(31, 116, 201, 0.12);
  color: var(--text-strong);
}

@media (prefers-color-scheme: dark) {
  .pick-btn--on {
    color: #08192b;
  }

  .score-no {
    background: rgba(255, 255, 255, 0.1);
  }

  .score-no--top {
    color: #08192b;
  }

  .score-bar {
    background: rgba(255, 255, 255, 0.12);
  }
}
</style>

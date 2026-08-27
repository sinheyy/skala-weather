<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useTourStore } from '@/stores/tourStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useHistoryStore } from '@/stores/historyStore'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import LifeIndexPanel from '@/components/exercise/LifeIndexPanel.vue'
import OutfitPanel from '@/components/exercise/OutfitPanel.vue'
import TravelSpotPanel from '@/components/exercise/TravelSpotPanel.vue'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

const route = useRoute()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const historyStore = useHistoryStore()
const weatherStore = useWeatherStore()
const tourStore = useTourStore()

const weatherRecommend = [
  { status: '☀️맑음', recommend: '햇볕이 강해요. 물을 많이 마시세요!' },
  { status: '🌥️구름', recommend: '날이 흐립니다. 외투를 챙기세요!' },
  { status: '🌧️비', recommend: '비가 와요. 우산을 챙기세요!' },
  { status: '❄️눈', recommend: '눈이 옵니다. 미끄러우니 조심하세요!' },
]

const city = computed(() => weatherStore.findCity(route.params.cityId))

const forecastList = ref([])
const isForecastLoading = ref(false)
const forecastError = ref('')

const fetchForecast = async () => {
  if (!city.value) {
    return
  }

  isForecastLoading.value = true
  forecastError.value = ''

  try {
    const response = await axios.get(FORECAST_URL, {
      params: { q: city.value.query, appid: API_KEY, units: 'metric', lang: 'kr' },
    })

    forecastList.value = response.data.list.slice(0, 8)
  } catch (error) {
    console.error('예보 데이터를 가져오지 못했습니다:', error)
    forecastError.value = '예보를 불러오지 못했어요.'
  } finally {
    isForecastLoading.value = false
  }
}

const loadCityData = () => {
  if (city.value) {
    historyStore.addHistory(city.value.id)
    fetchForecast()
    tourStore.fetchSpots(city.value)
  }
}

watch(city, () => {
  loadCityData()
})

onMounted(() => {
  if (weatherStore.weatherList.length === 0) {
    weatherStore.fetchWeatherList()
  }

  loadCityData()
})

const recommend = computed(() => {
  const found = weatherRecommend.find((item) => item.status === city.value.status)

  return found ? found.recommend : '추천 정보가 없는 날씨예요.'
})

const toClock = (unixSeconds) =>
  new Date(unixSeconds * 1000).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

const toDayLabel = (unixSeconds) => {
  const target = new Date(unixSeconds * 1000)
  const today = new Date()

  return target.getDate() === today.getDate() ? '오늘' : '내일'
}

const toDisplayTemp = (rawTemp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
}

const displayTemp = computed(() => toDisplayTemp(city.value.temp))

const averageTemp = computed(() => {
  const total = weatherStore.weatherList.reduce((sum, item) => sum + item.temp, 0)
  const rawAverage = total / weatherStore.weatherList.length

  if (configStore.unit === 'fahrenheit') {
    return (rawAverage * 9) / 5 + 32
  }

  return rawAverage
})

const tempGap = computed(() => (displayTemp.value - averageTemp.value).toFixed(1))

const forecastRows = computed(() =>
  forecastList.value.map((item) => {
    const rawTemp = item.main.temp

    return {
      dt: item.dt,
      day: toDayLabel(item.dt),
      time: toClock(item.dt),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      rainRate: Math.round(item.pop * 100),
      temp:
        configStore.unit === 'fahrenheit'
          ? Math.round((rawTemp * 9) / 5 + 32)
          : Math.round(rawTemp),
    }
  }),
)

const hotStandard = computed(() => (configStore.unit === 'fahrenheit' ? 77 : 25))
</script>

<template>
  <div class="detail-page">
    <RouterLink class="back-link" to="/">
      <span aria-hidden="true">←</span>
      메인 대시보드로 돌아가기
    </RouterLink>

    <template v-if="city">
      <header class="page-header">
        <p class="page-eyebrow">CITY DETAIL</p>
        <div class="title-row">
          <h1 class="page-title">{{ city.name }}</h1>

          <button
            class="favorite-btn"
            :class="{ 'favorite-btn--on': favoriteStore.isFavorite(city.id) }"
            type="button"
            @click="favoriteStore.toggleFavorite(city.id)"
          >
            {{ favoriteStore.isFavorite(city.id) ? '★ 즐겨찾기' : '☆ 즐겨찾기' }}
          </button>
        </div>
      </header>

      <BaseDashboardCard title="현재 날씨">
        <div class="summary">
          <div class="summary-main">
            <p class="summary-status">{{ city.status }} · {{ city.description }}</p>
            <p class="summary-temp">
              {{ displayTemp }}<span class="temp-unit">{{ configStore.unitSymbol }}</span>
            </p>

            <div class="temp-badge temp-badge--hot" v-if="city.temp >= 25">
              🔥 더움 ({{ hotStandard }}도 이상)
            </div>
            <div class="temp-badge temp-badge--cool" v-else>
              ❄️ 선선함 ({{ hotStandard }}도 미만)
            </div>
          </div>

          <dl class="metrics">
            <div class="metric">
              <dt>체감온도</dt>
              <dd>{{ toDisplayTemp(city.feelsLike) }}{{ configStore.unitSymbol }}</dd>
            </div>
            <div class="metric">
              <dt>습도</dt>
              <dd>{{ city.humidity }}%</dd>
            </div>
            <div class="metric">
              <dt>강수량</dt>
              <dd>{{ city.precipitation }}mm</dd>
            </div>
            <div class="metric">
              <dt>바람</dt>
              <dd>{{ city.windSpeed }}m/s</dd>
            </div>
            <div class="metric">
              <dt>기압</dt>
              <dd>{{ city.pressure }}hPa</dd>
            </div>
            <div class="metric">
              <dt>전국 평균 대비</dt>
              <dd>{{ tempGap > 0 ? `+${tempGap}` : tempGap }}{{ configStore.unitSymbol }}</dd>
            </div>
          </dl>
        </div>

        <p class="recommend">
          <span class="recommend-icon" aria-hidden="true">💬</span>
          {{ recommend }}
        </p>
      </BaseDashboardCard>

      <BaseDashboardCard title="오늘의 해">
        <div class="sun-row">
          <div class="sun-item">
            <span class="sun-icon" aria-hidden="true">🌅</span>
            <p class="sun-name">일출</p>
            <p class="sun-time">{{ toClock(city.sunrise) }}</p>
          </div>

          <div class="sun-item">
            <span class="sun-icon" aria-hidden="true">🌇</span>
            <p class="sun-name">일몰</p>
            <p class="sun-time">{{ toClock(city.sunset) }}</p>
          </div>
        </div>
      </BaseDashboardCard>

      <BaseDashboardCard title="24시간 예보">
        <div
          class="forecast-box"
          v-loading="isForecastLoading"
          element-loading-text="예보를 불러오는 중..."
        >
          <el-alert
            v-if="forecastError"
            type="error"
            :title="forecastError"
            :closable="false"
            show-icon
          />

          <div class="forecast-row" v-else>
            <div class="forecast-item" v-for="item in forecastRows" :key="item.dt">
              <p class="forecast-day">{{ item.day }}</p>
              <p class="forecast-time">{{ item.time }}</p>
              <img
                class="forecast-icon"
                :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`"
                :alt="item.description"
              />
              <p class="forecast-temp">{{ item.temp }}{{ configStore.unitSymbol }}</p>
              <p class="forecast-rain">💧 {{ item.rainRate }}%</p>
            </div>
          </div>
        </div>
      </BaseDashboardCard>

      <BaseDashboardCard title="생활지수">
        <LifeIndexPanel :city="city" />
      </BaseDashboardCard>

      <BaseDashboardCard title="오늘의 추천">
        <OutfitPanel :city="city" />
      </BaseDashboardCard>

      <BaseDashboardCard title="가볼 만한 곳">
        <TravelSpotPanel
          :city="city"
          :spots="tourStore.spotList"
          :is-loading="tourStore.isLoading"
          :error-message="tourStore.errorMessage"
        />
      </BaseDashboardCard>
    </template>

    <el-skeleton v-else-if="weatherStore.isLoading" :rows="6" animated />

    <el-empty v-else :description="`'${route.params.cityId}'에 해당하는 지역이 없어요`" />
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

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.favorite-btn {
  padding: 7px 12px;
  border: 1px solid var(--divider);
  border-radius: 999px;
  background: var(--card-bg);
  font-size: 0.78rem;
  font-family: inherit;
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-soft);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.favorite-btn--on {
  border-color: #f0a92e;
  color: #f0a92e;
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
  grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
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

.sun-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.sun-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
  text-align: center;
}

.sun-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.sun-name {
  font-size: 0.72rem;
  color: var(--text-soft);
}

.sun-time {
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--text-strong);
}

.forecast-box {
  min-height: 128px;
}

.forecast-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.forecast-item {
  flex: none;
  width: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 6px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
}

.forecast-day {
  font-size: 0.68rem;
  color: var(--text-soft);
  opacity: 0.8;
}

.forecast-time {
  font-size: 0.76rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-soft);
}

.forecast-icon {
  width: 46px;
  height: 46px;
}

.forecast-temp {
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-strong);
}

.forecast-rain {
  font-size: 0.7rem;
  color: var(--text-soft);
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

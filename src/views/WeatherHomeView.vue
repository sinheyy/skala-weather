<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import LifeIndexPanel from '@/components/exercise/LifeIndexPanel.vue'
import RankingBoard from '@/components/exercise/RankingBoard.vue'
import { weatherList as weatherData, weatherRecommend } from '@/data/weatherData'

const router = useRouter()

const keyword = ref('')
const selectedCity = ref('')

const weatherList = ref(weatherData)

const filteredWeatherList = computed(() => {
  const trimKeyword = keyword.value.trim()

  if (!trimKeyword) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(trimKeyword))
})

const selected = computed(() =>
  selectedCity.value ? `${selectedCity.value}이(가) 선택되었습니다.` : '',
)

const selectedCityData = computed(
  () => weatherList.value.find((item) => item.name === selectedCity.value) ?? null,
)

const clickCity = (cityName) => {
  selectedCity.value = cityName
}

const showRecommend = (status) => {
  const found = weatherRecommend.find((item) => item.status === status)
  window.alert(found ? found.recommend : '추천 정보가 없는 날씨예요.')
}

const showDetail = (cityId) => {
  router.push({
    name: 'detail',
    params: { cityId },
  })
}

watch(selected, (newValue, oldValue) => {
  console.log(`[watch👀-selected] ${oldValue} -> ${newValue}`)
})

watchEffect(() => {
  console.log(`[watch👀-keyword] 현재 검색어: ${keyword.value}`)
})
</script>

<template>
  <div class="weather-app">
    <header class="app-header">
      <p class="app-eyebrow">SKALA WEATHER</p>
      <h1 class="app-title">날씨</h1>
    </header>

    <BaseDashboardCard title="도시 검색">
      <SearchBar :keyword="keyword" @update-query="keyword = $event" />
    </BaseDashboardCard>

    <div class="content-row">
      <BaseDashboardCard title="지역별 날씨 현황">
        <div class="city-grid" v-if="filteredWeatherList.length > 0">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city="item"
            @select-card="clickCity"
            @click-detail="showDetail"
            @show-recommend="showRecommend"
          ></WeatherCard>
        </div>
        <div v-else>'{{ keyword }}' 검색 결과가 없습니다.</div>
      </BaseDashboardCard>

      <aside class="side-panel">
        <BaseDashboardCard title="생활지수">
          <LifeIndexPanel :city="selectedCityData" />
        </BaseDashboardCard>

        <BaseDashboardCard title="전국 랭킹">
          <RankingBoard :cities="weatherList" />
        </BaseDashboardCard>
      </aside>
    </div>

    <p class="status-bar" :class="{ 'status-bar--empty': !selected }">
      <span class="status-bar__dot" aria-hidden="true"></span>
      {{ selected || '카드를 클릭하면 선택한 도시가 여기에 표시됩니다.' }}
    </p>
  </div>
</template>

<style scoped>
.weather-app {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.app-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--text-soft);
}

.app-title {
  font-size: clamp(1.9rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text-strong);
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;
}

.content-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 22px;
  align-items: start;
}

.side-panel {
  position: sticky;
  top: clamp(20px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

@media (max-width: 900px) {
  .content-row {
    grid-template-columns: 1fr;
  }

  .side-panel {
    position: static;
  }
}

.status-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--panel-border);
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-strong);
}

.status-bar--empty {
  font-weight: 500;
  color: var(--text-soft);
}

.status-bar__dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(31, 116, 201, 0.18);
}

.status-bar--empty .status-bar__dot {
  background: var(--text-soft);
  box-shadow: none;
  opacity: 0.5;
}
</style>

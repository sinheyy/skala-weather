<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import LifeIndexPanel from '@/components/exercise/LifeIndexPanel.vue'
import OutfitPanel from '@/components/exercise/OutfitPanel.vue'
import RankingBoard from '@/components/exercise/RankingBoard.vue'

const router = useRouter()

const keyword = ref('')
const selectedCity = ref('')
const onlyHot = ref(false)

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 32, humidity: 50, precipitation: 0, status: '☀️맑음' },
  { id: 'city_02', name: '경기', temp: 30, humidity: 58, precipitation: 0, status: '☀️맑음' },
  { id: 'city_03', name: '대전', temp: 28, humidity: 60, precipitation: 0, status: '🌥️구름' },
  { id: 'city_04', name: '부산', temp: 26, humidity: 70, precipitation: 60, status: '🌧️비' },
  { id: 'city_05', name: '제주', temp: 31, humidity: 45, precipitation: 0, status: '☀️맑음' },
  { id: 'city_06', name: '인천', temp: 27, humidity: 65, precipitation: 10, status: '🌧️비' },
  { id: 'city_07', name: '광주', temp: 33, humidity: 48, precipitation: 0, status: '☀️맑음' },
  { id: 'city_08', name: '강원', temp: 24, humidity: 55, precipitation: 0, status: '🌥️구름' },
  { id: 'city_09', name: '대구', temp: 35, humidity: 42, precipitation: 0, status: '☀️맑음' },
  { id: 'city_10', name: '울산', temp: 29, humidity: 63, precipitation: 5, status: '🌥️구름' },
  { id: 'city_11', name: '세종', temp: 29, humidity: 57, precipitation: 0, status: '☀️맑음' },
  { id: 'city_12', name: '충북', temp: 28, humidity: 61, precipitation: 15, status: '🌧️비' },
  { id: 'city_13', name: '충남', temp: 27, humidity: 64, precipitation: 20, status: '🌧️비' },
  { id: 'city_14', name: '전북', temp: 30, humidity: 59, precipitation: 0, status: '🌥️구름' },
  { id: 'city_15', name: '전남', temp: 31, humidity: 66, precipitation: 0, status: '☀️맑음' },
  { id: 'city_16', name: '경북', temp: 23, humidity: 52, precipitation: 0, status: '🌥️구름' },
  { id: 'city_17', name: '경남', temp: 25, humidity: 68, precipitation: 35, status: '🌧️비' },
  { id: 'city_18', name: '울릉도', temp: 22, humidity: 75, precipitation: 45, status: '🌧️비' },
])

const weatherRecommend = [
  { status: '☀️맑음', recommend: '햇볕이 강해요. 물을 많이 마시세요!' },
  { status: '🌥️구름', recommend: '날이 흐립니다. 외투를 챙기세요!' },
  { status: '🌧️비', recommend: '비가 와요. 우산을 챙기세요!' },
]

const filteredWeatherList = computed(() => {
  const trimKeyword = keyword.value.trim()

  return weatherList.value.filter((item) => {
    const matchKeyword = !trimKeyword || item.name.includes(trimKeyword)

    return matchKeyword && (!onlyHot.value || item.temp >= 25)
  })
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

const selectFirstCity = () => {
  const first = filteredWeatherList.value[0]

  selectedCity.value = first ? first.name : ''
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

watch(onlyHot, (newValue) => {
  console.log(`[watch👀-onlyHot] 더운 지역만 보기: ${newValue}`)
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
      <SearchBar
        :keyword="keyword"
        @update-query="keyword = $event"
        @select-first="selectFirstCity"
      />
    </BaseDashboardCard>

    <div class="content-row">
      <BaseDashboardCard title="지역별 날씨 현황">
        <button
          class="hot-toggle"
          :class="{ 'hot-toggle--on': onlyHot }"
          type="button"
          @click="onlyHot = !onlyHot"
        >
          🔥 더운 지역만 보기
        </button>

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
        <p class="empty" v-else>조건에 맞는 검색 결과가 없습니다.</p>
      </BaseDashboardCard>

      <aside class="side-panel">
        <BaseDashboardCard title="생활지수">
          <LifeIndexPanel :city="selectedCityData" />
        </BaseDashboardCard>

        <BaseDashboardCard title="오늘의 추천">
          <OutfitPanel :city="selectedCityData" />
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

.hot-toggle {
  margin-bottom: 14px;
  padding: 8px 14px;
  border: 1px solid var(--divider);
  border-radius: 999px;
  background: var(--card-bg);
  font-size: 0.8rem;
  font-family: inherit;
  font-weight: 700;
  color: var(--text-soft);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.hot-toggle--on {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}

.empty {
  padding: 26px 12px;
  border: 1px dashed var(--divider);
  border-radius: 14px;
  font-size: 0.85rem;
  text-align: center;
  color: var(--text-soft);
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

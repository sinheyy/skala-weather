<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useFavoriteStore } from '@/stores/favoriteStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useHistoryStore } from '@/stores/historyStore'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import LifeIndexPanel from '@/components/exercise/LifeIndexPanel.vue'
import OutfitPanel from '@/components/exercise/OutfitPanel.vue'
import RankingBoard from '@/components/exercise/RankingBoard.vue'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()
const historyStore = useHistoryStore()

const keyword = ref('')
const selectedCity = ref('')
const onlyHot = ref(false)
const onlyFavorite = ref(false)

const weatherRecommend = [
  { status: '☀️맑음', recommend: '햇볕이 강해요. 물을 많이 마시세요!' },
  { status: '🌥️구름', recommend: '날이 흐립니다. 외투를 챙기세요!' },
  { status: '🌧️비', recommend: '비가 와요. 우산을 챙기세요!' },
  { status: '❄️눈', recommend: '눈이 옵니다. 미끄러우니 조심하세요!' },
]

const filteredWeatherList = computed(() => {
  const trimKeyword = keyword.value.trim()

  return weatherStore.weatherList.filter((item) => {
    const matchKeyword = !trimKeyword || item.name.includes(trimKeyword)
    const matchHot = !onlyHot.value || item.temp >= 25
    const matchFavorite = !onlyFavorite.value || favoriteStore.isFavorite(item.id)

    return matchKeyword && matchHot && matchFavorite
  })
})

const historyCities = computed(() =>
  historyStore.historyIds
    .map((id) => weatherStore.weatherList.find((item) => item.id === id))
    .filter((item) => item),
)

const selected = computed(() =>
  selectedCity.value ? `${selectedCity.value}이(가) 선택되었습니다.` : '',
)

const selectedCityData = computed(
  () => weatherStore.weatherList.find((item) => item.name === selectedCity.value) ?? null,
)

const clickCity = (cityName) => {
  selectedCity.value = cityName
}

const showRecommend = (status) => {
  const found = weatherRecommend.find((item) => item.status === status)

  if (found) {
    ElMessage.success(found.recommend)
  } else {
    ElMessage.info('추천 정보가 없는 날씨예요.')
  }
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

    <BaseDashboardCard title="최근 본 지역" v-if="historyStore.hasHistory">
      <div class="history-row">
        <button
          class="history-chip"
          v-for="item in historyCities"
          :key="item.id"
          type="button"
          @click="showDetail(item.id)"
        >
          {{ item.name }}
        </button>

        <button class="history-clear" type="button" @click="historyStore.clearHistory()">
          기록 지우기
        </button>
      </div>
    </BaseDashboardCard>

    <div class="content-row">
      <BaseDashboardCard title="지역별 날씨 현황">
        <div class="filter-row">
          <button
            class="chip-toggle"
            :class="{ 'chip-toggle--on': onlyHot }"
            type="button"
            @click="onlyHot = !onlyHot"
          >
            🔥 더운 지역만 보기
          </button>

          <button
            class="chip-toggle"
            :class="{ 'chip-toggle--on': onlyFavorite }"
            type="button"
            @click="onlyFavorite = !onlyFavorite"
          >
            ⭐ 즐겨찾기만 보기 ({{ favoriteStore.favoriteCount }})
          </button>
        </div>

        <el-skeleton class="grid-skeleton" v-if="weatherStore.isLoading" :rows="6" animated />

        <el-alert
          v-else-if="weatherStore.errorMessage"
          type="error"
          :title="weatherStore.errorMessage"
          :closable="false"
          show-icon
        />

        <div class="city-grid" v-else-if="filteredWeatherList.length > 0">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city="item"
            @select-card="clickCity"
            @click-detail="showDetail"
            @show-recommend="showRecommend"
          ></WeatherCard>
        </div>
        <el-empty v-else description="조건에 맞는 검색 결과가 없습니다" />
      </BaseDashboardCard>

      <aside class="side-panel">
        <BaseDashboardCard title="생활지수">
          <LifeIndexPanel :city="selectedCityData" />
        </BaseDashboardCard>

        <BaseDashboardCard title="오늘의 추천">
          <OutfitPanel :city="selectedCityData" />
        </BaseDashboardCard>

        <BaseDashboardCard title="전국 랭킹">
          <RankingBoard :cities="weatherStore.weatherList" />
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

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.chip-toggle {
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

.chip-toggle--on {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}

.history-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.history-chip {
  padding: 8px 14px;
  border: 1px solid var(--divider);
  border-radius: 999px;
  background: var(--card-bg);
  font-size: 0.84rem;
  font-family: inherit;
  font-weight: 700;
  color: var(--text-strong);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.history-chip:hover {
  border-color: var(--accent);
}

.history-clear {
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 0.78rem;
  font-family: inherit;
  color: var(--text-soft);
  text-decoration: underline;
  cursor: pointer;
}

.grid-skeleton {
  padding: 8px 4px;
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

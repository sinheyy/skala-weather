<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const keyword = ref('')
const selectedCity = ref('')

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

const laundryIndex = computed(() => {
  const currentCity = weatherList.value.find((item) => item.name === selectedCity.value)

  if (currentCity.temp >= 23 && currentCity.humidity <= 55 && currentCity.precipitation <= 0) {
    return '추천👍'
  }

  return '비추천👎'
})

const carWashIndex = computed(() => {
  const currentCity = weatherList.value.find((item) => item.name === selectedCity.value)

  if (currentCity.temp < 32 && currentCity.precipitation <= 0) {
    return '추천👍'
  }

  return '비추천👎'
})

const umbrellaIndex = computed(() => {
  const currentCity = weatherList.value.find((item) => item.name === selectedCity.value)

  if (currentCity.precipitation > 0) {
    return '추천👍'
  }

  return '비추천👎'
})

const tempRankList = computed(() => {
  return [...weatherList.value].sort((a, b) => b.temp - a.temp).slice(0, 10)
})

const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, item) => sum + item.temp, 0)

  return (total / weatherList.value.length).toFixed(1)
})

const rainyCityCount = computed(() => {
  return weatherList.value.filter((item) => item.status === '🌧️비').length
})

const weatherRecommend = [
  { status: '☀️맑음', recommend: '햇볕이 강해요. 물을 많이 마시세요!' },
  { status: '🌥️구름', recommend: '날이 흐립니다. 외투를 챙기세요!' },
  { status: '🌧️비', recommend: '비가 와요. 우산을 챙기세요!' },
]

const clickCity = (cityName) => {
  selectedCity.value = cityName
}

const showRecommend = (status) => {
  const found = weatherRecommend.find((item) => item.status === status)
  window.alert(found ? found.recommend : '추천 정보가 없는 날씨예요.')
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 입니다.`)
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
          <template v-if="selected">
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
              <b class="side-target">{{ selectedCity }}</b
              >의 기온 · 습도 · 강수량으로 계산했어요.
            </p>
          </template>
          <p class="side-empty" v-else>
            <span class="side-empty__icon" aria-hidden="true">👆</span>
            도시를 선택하면 생활지수를 보여드려요.
          </p>
        </BaseDashboardCard>

        <BaseDashboardCard title="전국 랭킹">
          <dl class="rank-summary">
            <div class="rank-stat">
              <dt>전국 평균</dt>
              <dd>{{ averageTemp }}℃</dd>
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
              <span class="rank-value">{{ item.temp }}℃</span>
            </li>
          </ol>
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
  --panel-bg: rgba(255, 255, 255, 0.66);
  --panel-border: rgba(255, 255, 255, 0.85);
  --card-bg: rgba(255, 255, 255, 0.88);
  --divider: rgba(19, 62, 102, 0.14);
  --text-strong: #12314f;
  --text-soft: #4c6d8c;
  --accent: #1f74c9;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: clamp(20px, 4vw, 48px);
  padding-bottom: 96px; /* 하단 고정 상태바 높이만큼 확보 */
  color: var(--text-strong);
  background:
    radial-gradient(1100px 380px at 8% -12%, rgba(255, 255, 255, 0.75), transparent 62%),
    linear-gradient(165deg, #74c0f5 0%, #a9d7f6 42%, #e6f3fd 100%);
  background-attachment: fixed;
}

.weather-app > * {
  width: 100%;
  max-width: 1080px;
}

@media (prefers-color-scheme: dark) {
  .weather-app {
    --panel-bg: rgba(255, 255, 255, 0.07);
    --panel-border: rgba(255, 255, 255, 0.13);
    --card-bg: rgba(255, 255, 255, 0.08);
    --divider: rgba(255, 255, 255, 0.12);
    --text-strong: #e9f2fb;
    --text-soft: rgba(233, 242, 251, 0.66);
    --accent: #7cc0f7;

    background:
      radial-gradient(1000px 360px at 10% -12%, rgba(94, 150, 208, 0.35), transparent 62%),
      linear-gradient(165deg, #10233c 0%, #17304f 48%, #0d1a2c 100%);
    background-attachment: fixed;
  }
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

.weather-app > .status-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
  max-width: none;
  padding: 14px 20px;
  border-top: 1px solid var(--panel-border);
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-strong);
}

.weather-app > .status-bar--empty {
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

@media (prefers-color-scheme: dark) {
  .index-value--good {
    background: rgba(126, 217, 178, 0.18);
    color: #8fe0b8;
  }

  .index-value--bad {
    background: rgba(255, 255, 255, 0.08);
  }

  .rank-no {
    background: rgba(255, 255, 255, 0.1);
  }

  .rank-no--top {
    color: #08192b;
  }

  .rank-list {
    scrollbar-color: rgba(255, 255, 255, 0.26) transparent;
  }

  .rank-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.26);
  }

  .rank-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
}
</style>

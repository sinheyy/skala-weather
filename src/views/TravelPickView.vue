<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import OutfitPanel from '@/components/exercise/OutfitPanel.vue'
import TravelSpotPanel from '@/components/exercise/TravelSpotPanel.vue'

const router = useRouter()

const weatherList = [
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
]

const travelSpots = [
  {
    city: '서울',
    intro: '고궁과 야경이 함께 있는 도시',
    spots: ['경복궁', 'N서울타워', '한강공원'],
  },
  {
    city: '경기',
    intro: '서울 근교로 당일치기 하기 좋은 곳',
    spots: ['수원화성', '에버랜드', '두물머리'],
  },
  {
    city: '대전',
    intro: '빵과 호수로 유명한 과학 도시',
    spots: ['성심당', '한밭수목원', '대청호'],
  },
  {
    city: '부산',
    intro: '바다와 야경이 좋은 항구 도시',
    spots: ['해운대', '감천문화마을', '광안리'],
  },
  {
    city: '제주',
    intro: '어디를 가도 바다가 보이는 섬',
    spots: ['성산일출봉', '우도', '협재해수욕장'],
  },
  {
    city: '인천',
    intro: '바다와 신도시가 함께 있는 관문 도시',
    spots: ['월미도', '차이나타운', '송도센트럴파크'],
  },
  {
    city: '광주',
    intro: '예술과 미식이 있는 도시',
    spots: ['무등산', '양림동 근대역사마을', '국립아시아문화전당'],
  },
  {
    city: '강원',
    intro: '산과 바다를 하루에 볼 수 있는 곳',
    spots: ['설악산', '속초해변', '남이섬'],
  },
  {
    city: '대구',
    intro: '골목마다 이야기가 있는 도시',
    spots: ['팔공산', '서문시장', '김광석다시그리기길'],
  },
  {
    city: '울산',
    intro: '해돋이가 가장 먼저 닿는 도시',
    spots: ['대왕암공원', '태화강 국가정원', '간절곶'],
  },
  {
    city: '세종',
    intro: '넓은 공원이 매력인 계획도시',
    spots: ['세종호수공원', '국립세종수목원', '금강보행교'],
  },
  { city: '충북', intro: '내륙의 산수 풍경이 좋은 곳', spots: ['도담삼봉', '속리산', '청남대'] },
  {
    city: '충남',
    intro: '백제의 흔적이 남아 있는 지역',
    spots: ['공산성', '궁남지', '대천해수욕장'],
  },
  {
    city: '전북',
    intro: '한옥과 맛집이 가득한 여행지',
    spots: ['전주한옥마을', '내장산', '군산 근대문화거리'],
  },
  {
    city: '전남',
    intro: '느리게 걷기 좋은 남도 풍경',
    spots: ['순천만습지', '여수 밤바다', '죽녹원'],
  },
  {
    city: '경북',
    intro: '천년 고도의 역사가 살아 있는 곳',
    spots: ['불국사', '안동 하회마을', '주왕산'],
  },
  {
    city: '경남',
    intro: '바다를 따라 도는 드라이브 코스',
    spots: ['통영 동피랑', '진주성', '거제 바람의언덕'],
  },
  {
    city: '울릉도',
    intro: '배를 타고 떠나는 화산섬 여행',
    spots: ['도동해안산책로', '나리분지', '관음도'],
  },
]

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
  weatherList
    .map((item) => ({ ...item, score: getScore(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5),
)

const bestCity = computed(() => scoreRankList.value[0])

const bestComment = computed(() => {
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
  console.log(`[watch👀-bestCity] 1위 변경: ${oldValue.name} -> ${newValue.name}`)
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
      <div class="best">
        <div class="best-info">
          <p class="best-crown" aria-hidden="true">👑</p>
          <p class="best-name">{{ bestCity.name }}</p>
          <p class="best-comment">{{ bestComment }}</p>
        </div>
        <p class="best-score">{{ bestCity.score }}<span class="best-unit">점</span></p>
      </div>

      <OutfitPanel :city="bestCity" />
    </BaseDashboardCard>

    <BaseDashboardCard title="가볼 만한 곳">
      <TravelSpotPanel :city="bestCity" :spots="travelSpots" />
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

:root[data-theme='dark'] .pick-btn--on {
  color: #08192b;
}

:root[data-theme='dark'] .score-no {
  background: rgba(255, 255, 255, 0.1);
}

:root[data-theme='dark'] .score-no--top {
  color: #08192b;
}

:root[data-theme='dark'] .score-bar {
  background: rgba(255, 255, 255, 0.12);
}
</style>

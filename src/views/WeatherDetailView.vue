<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import LifeIndexPanel from '@/components/exercise/LifeIndexPanel.vue'
import OutfitPanel from '@/components/exercise/OutfitPanel.vue'
import TravelSpotPanel from '@/components/exercise/TravelSpotPanel.vue'

const route = useRoute()

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

const weatherRecommend = [
  { status: '☀️맑음', recommend: '햇볕이 강해요. 물을 많이 마시세요!' },
  { status: '🌥️구름', recommend: '날이 흐립니다. 외투를 챙기세요!' },
  { status: '🌧️비', recommend: '비가 와요. 우산을 챙기세요!' },
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
      메인 대시보드로 돌아가기
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

      <BaseDashboardCard title="오늘의 추천">
        <OutfitPanel :city="city" />
      </BaseDashboardCard>

      <BaseDashboardCard title="가볼 만한 곳">
        <TravelSpotPanel :city="city" :spots="travelSpots" />
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

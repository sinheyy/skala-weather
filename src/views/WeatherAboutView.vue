<script setup>
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'

const pages = [
  {
    id: 'home',
    path: '/',
    icon: '🏠',
    name: '날씨 대시보드',
    desc: '전국 18개 지역의 날씨를 카드로 보고, 카드를 누르면 생활지수와 추천이 함께 바뀝니다.',
  },
  {
    id: 'travel',
    path: '/travel',
    icon: '🧳',
    name: '여행지 추천',
    desc: '원하는 날씨 조건을 고르면 점수를 계산해 오늘 가기 좋은 지역을 뽑아 줍니다.',
  },
  {
    id: 'rainy',
    path: '/rainy',
    icon: '☂️',
    name: '비 소식',
    desc: '비가 오는 지역만 모아 강수량이 많은 순서로 보여줍니다.',
  },
  {
    id: 'detail',
    path: '/weather/city_01',
    icon: '📍',
    name: '지역 상세',
    desc: '카드의 [상세보기]를 누르면 이동합니다. 주소의 도시 코드로 해당 지역을 찾아 보여줘요.',
  },
]

const features = [
  {
    id: 'search',
    icon: '🔍',
    name: '도시 검색',
    desc: '한글로 도시 이름을 입력하면 카드 목록이 바로 좁혀집니다. 단축키도 함께 지원해요.',
  },
  {
    id: 'hot',
    icon: '🔥',
    name: '더운 지역만 보기',
    desc: '버튼 하나로 25도 이상인 지역만 골라 봅니다. 검색어와 함께 적용됩니다.',
  },
  {
    id: 'index',
    icon: '🧺',
    name: '생활지수',
    desc: '선택한 도시의 기온 · 습도 · 강수량으로 빨래 · 세차 · 우산 지수를 계산합니다.',
  },
  {
    id: 'outfit',
    icon: '👕',
    name: '옷차림 · 메뉴 추천',
    desc: '기온과 강수량에 맞춰 오늘 입을 옷과 먹을 메뉴를 골라 줍니다.',
  },
  {
    id: 'spot',
    icon: '🧭',
    name: '가볼 만한 곳',
    desc: '한국관광공사 관광정보로 그 도시 주변 관광지 다섯 곳을 사진 · 주소 · 거리와 함께 보여줍니다.',
  },
  {
    id: 'rank',
    icon: '🏆',
    name: '전국 랭킹',
    desc: '기온이 높은 상위 10개 지역과 전국 평균 기온, 비가 오는 지역 수를 보여줍니다.',
  },
  {
    id: 'forecast',
    icon: '🕒',
    name: '24시간 예보',
    desc: '3시간 간격으로 앞으로 24시간의 기온과 강수확률을 확인할 수 있습니다.',
  },
  {
    id: 'sun',
    icon: '🌅',
    name: '오늘의 해',
    desc: '지역별 일출 · 일몰 시각을 상세 페이지에서 함께 보여줍니다.',
  },
  {
    id: 'favorite',
    icon: '⭐',
    name: '즐겨찾기',
    desc: '자주 보는 지역에 별을 달아 두고, 대시보드에서 즐겨찾기만 골라 볼 수 있습니다.',
  },
  {
    id: 'history',
    icon: '🕘',
    name: '최근 본 지역',
    desc: '상세 페이지를 열면 기록이 남아, 대시보드에서 최근 다섯 곳으로 바로 돌아갈 수 있습니다.',
  },
]

const settings = [
  {
    id: 'unit',
    icon: '🌡️',
    name: '날씨 단위',
    desc: '섭씨(℃)와 화씨(℉)를 전환합니다. 모든 화면의 기온 표시가 함께 바뀝니다.',
  },
]

const sources = [
  {
    id: 'owm',
    icon: '🛰️',
    name: 'OpenWeatherMap',
    desc: '전국 18개 도시의 실시간 날씨와 3시간 간격 예보, 일출 · 일몰 시각을 받아옵니다.',
  },
  {
    id: 'tour',
    icon: '🗺️',
    name: '한국관광공사 관광정보',
    desc: '공공데이터포털의 위치기반 관광정보로 도시 주변 관광지를 조회합니다.',
  },
]

const shortcuts = [
  { id: 'enter', key: 'Enter', desc: '검색 결과의 첫 번째 도시를 바로 선택합니다.' },
  { id: 'esc', key: 'Esc', desc: '입력한 검색어를 한 번에 지웁니다.' },
]
</script>

<template>
  <div class="about-page">
    <header class="page-header">
      <p class="page-eyebrow">ABOUT</p>
      <h1 class="page-title">서비스 소개</h1>
    </header>

    <BaseDashboardCard title="SKALA WEATHER">
      <p class="lead">
        전국 18개 도시의 <b>실시간 날씨</b>를 한 화면에서 확인하고, 오늘 무엇을 입고 어디에 가면
        좋을지까지 알려주는 날씨 대시보드입니다.
      </p>
      <p class="lead-sub">
        기온과 습도, 강수량을 그냥 나열하는 대신 <b>빨래를 널어도 되는지</b>,
        <b>오늘 어디로 떠나면 좋을지</b> 같은 실제 판단으로 바꿔서 보여줘요.
      </p>
      <p class="lead-sub">
        로딩 표시와 알림, 빈 화면 안내에는 <b>Element Plus</b> 컴포넌트를 사용했습니다.
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard title="페이지 안내">
      <ul class="page-list">
        <li v-for="item in pages" :key="item.id">
          <RouterLink class="page-item" :to="item.path">
            <span class="page-icon" aria-hidden="true">{{ item.icon }}</span>
            <div class="page-body">
              <h3 class="page-name">{{ item.name }}</h3>
              <p class="page-desc">{{ item.desc }}</p>
            </div>
            <span class="page-arrow" aria-hidden="true">→</span>
          </RouterLink>
        </li>
      </ul>
    </BaseDashboardCard>

    <BaseDashboardCard title="주요 기능">
      <ul class="feature-list">
        <li class="feature" v-for="item in features" :key="item.id">
          <span class="feature-icon" aria-hidden="true">{{ item.icon }}</span>
          <div class="feature-body">
            <h3 class="feature-name">{{ item.name }}</h3>
            <p class="feature-desc">{{ item.desc }}</p>
          </div>
        </li>
      </ul>
    </BaseDashboardCard>

    <BaseDashboardCard title="화면 설정">
      <ul class="feature-list">
        <li class="feature" v-for="item in settings" :key="item.id">
          <span class="feature-icon" aria-hidden="true">{{ item.icon }}</span>
          <div class="feature-body">
            <h3 class="feature-name">{{ item.name }}</h3>
            <p class="feature-desc">{{ item.desc }}</p>
          </div>
        </li>
      </ul>

      <p class="notice">
        <span class="notice-icon" aria-hidden="true">⚙️</span>
        날씨 단위는 화면 오른쪽 위에서 바꿀 수 있고, 페이지를 옮겨 다녀도 그대로 유지됩니다.
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard title="데이터 출처">
      <ul class="feature-list">
        <li class="feature" v-for="item in sources" :key="item.id">
          <span class="feature-icon" aria-hidden="true">{{ item.icon }}</span>
          <div class="feature-body">
            <h3 class="feature-name">{{ item.name }}</h3>
            <p class="feature-desc">{{ item.desc }}</p>
          </div>
        </li>
      </ul>
    </BaseDashboardCard>

    <BaseDashboardCard title="단축키">
      <ul class="shortcut-list">
        <li class="shortcut" v-for="item in shortcuts" :key="item.id">
          <kbd class="shortcut-key">{{ item.key }}</kbd>
          <p class="shortcut-desc">{{ item.desc }}</p>
        </li>
      </ul>

      <p class="notice">
        <span class="notice-icon" aria-hidden="true">⌨️</span>
        단축키는 메인 대시보드의 도시 검색창에 커서가 있을 때 동작합니다.
      </p>
    </BaseDashboardCard>

    <RouterLink class="home-btn" to="/">메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.about-page {
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

.lead {
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--text-strong);
}

.lead-sub {
  margin-top: 10px;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--text-soft);
}

.lead-sub b {
  font-weight: 700;
  color: var(--text-strong);
}

.page-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    transform 0.15s ease;
}

.page-item:hover {
  border-color: var(--accent);
  transform: translateX(3px);
}

.page-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.page-icon {
  flex: none;
  font-size: 1.2rem;
}

.page-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.page-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-strong);
}

.page-desc {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.page-arrow {
  flex: none;
  font-size: 0.9rem;
  color: var(--text-soft);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
}

.shortcut-key {
  flex: none;
  min-width: 58px;
  padding: 5px 10px;
  border: 1px solid var(--divider);
  border-radius: 8px;
  background: var(--panel-bg);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
  color: var(--text-strong);
}

.shortcut-desc {
  font-size: 0.86rem;
  color: var(--text-soft);
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
}

.feature-icon {
  flex: none;
  font-size: 1.3rem;
  line-height: 1.4;
}

.feature-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-name {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text-strong);
}

.feature-desc {
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px dashed var(--divider);
  border-radius: 14px;
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.notice-icon {
  flex: none;
}

.home-btn {
  align-self: center;
  margin-top: 4px;
  padding: 12px 26px;
  border-radius: 12px;
  background: var(--accent);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  color: #ffffff;
  transition:
    filter 0.2s ease,
    transform 0.1s ease;
}

.home-btn:hover {
  filter: brightness(1.08);
}

.home-btn:active {
  transform: scale(0.98);
}

.home-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

@media (prefers-color-scheme: dark) {
  .home-btn {
    color: #08192b;
  }
}
</style>

<script setup>
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'

const features = [
  {
    id: 'search',
    icon: '🔍',
    name: '도시 검색',
    desc: '도시 이름을 입력하면 목록이 바로 좁혀집니다. 검색어에 따라 아래 카드가 실시간으로 갱신돼요.',
  },
  {
    id: 'cards',
    icon: '🗺️',
    name: '지역별 날씨 현황',
    desc: '전국 18개 지역의 기온 · 습도 · 강수량을 카드로 한눈에 봅니다. 25도를 기준으로 더움 / 선선함을 구분해 표시해요.',
  },
  {
    id: 'index',
    icon: '🧺',
    name: '생활지수',
    desc: '카드를 선택하면 그 도시의 기온 · 습도 · 강수량으로 빨래 · 세차 · 우산 지수를 계산해 알려줍니다.',
  },
  {
    id: 'rank',
    icon: '🔥',
    name: '전국 랭킹',
    desc: '기온이 높은 상위 10개 지역과 전국 평균 기온, 비가 오는 지역 수를 함께 보여줍니다.',
  },
]

const stacks = [
  { id: 'vue', name: 'Vue 3', desc: 'Composition API · <script setup>' },
  { id: 'router', name: 'Vue Router', desc: '라우팅 · 코드 분할' },
  { id: 'vite', name: 'Vite', desc: '개발 서버 · 번들링' },
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
        전국 주요 지역의 날씨를 한 화면에서 확인하고, 오늘 무엇을 하면 좋을지까지 알려주는 날씨
        대시보드입니다.
      </p>
      <p class="lead-sub">
        기온과 습도, 강수량을 그냥 나열하는 대신 <b>빨래를 널어도 되는지</b>,
        <b>세차를 해도 되는지</b> 같은 실제 판단으로 바꿔서 보여주는 데 초점을 맞췄어요.
      </p>
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

    <BaseDashboardCard title="만든 방식">
      <dl class="stack-grid">
        <div class="stack" v-for="item in stacks" :key="item.id">
          <dt>{{ item.name }}</dt>
          <dd>{{ item.desc }}</dd>
        </div>
      </dl>

      <p class="notice">
        <span class="notice-icon" aria-hidden="true">ℹ️</span>
        학습용으로 만든 프로젝트라 날씨 정보는 실제 관측값이 아닌 샘플 데이터입니다.
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

.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  margin: 0;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
}

.stack dt {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-strong);
}

.stack dd {
  margin: 0;
  font-size: 0.78rem;
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

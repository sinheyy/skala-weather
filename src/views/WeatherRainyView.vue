<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useWeatherStore } from '@/stores/weatherStore'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'

const router = useRouter()
const weatherStore = useWeatherStore()

const minRain = ref(0)

const rainyList = computed(() =>
  weatherStore.weatherList
    .filter((item) => item.precipitation > minRain.value)
    .sort((a, b) => b.precipitation - a.precipitation),
)

const totalRain = computed(() => rainyList.value.reduce((sum, item) => sum + item.precipitation, 0))

const showDetail = (cityId) => {
  router.push({ name: 'detail', params: { cityId } })
}
</script>

<template>
  <div class="rainy-page">
    <header class="page-header">
      <p class="page-eyebrow">RAINY</p>
      <h1 class="page-title">비 소식</h1>
    </header>

    <BaseDashboardCard title="강수량 기준">
      <div class="filter-row">
        <label class="filter-label" for="min-rain">최소 강수량</label>
        <select class="filter-select" id="min-rain" v-model.number="minRain">
          <option :value="0">0mm 초과</option>
          <option :value="1">1mm 초과</option>
          <option :value="3">3mm 초과</option>
        </select>
      </div>

      <p class="filter-status">
        조건에 맞는 지역 <b>{{ rainyList.length }}곳</b> · 강수량 합계 <b>{{ totalRain }}mm</b>
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard title="비 오는 지역">
      <div class="city-grid" v-if="rainyList.length > 0">
        <WeatherCard
          v-for="item in rainyList"
          :key="item.id"
          :city="item"
          @click-detail="showDetail"
        />
      </div>
      <el-skeleton v-else-if="weatherStore.isLoading" :rows="4" animated />

      <el-empty v-else description="선택한 조건에 해당하는 지역이 없습니다" />
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.rainy-page {
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

.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text-soft);
}

.filter-select {
  padding: 9px 12px;
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  background: var(--card-bg);
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--text-strong);
  cursor: pointer;
}

.filter-status {
  margin-top: 12px;
  font-size: 0.86rem;
  color: var(--text-soft);
}

.filter-status b {
  font-weight: 700;
  color: var(--text-strong);
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;
}
</style>

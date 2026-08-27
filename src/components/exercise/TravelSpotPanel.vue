<script setup>
defineProps({
  city: { type: Object, default: null },
  spots: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})
</script>

<template>
  <el-empty v-if="!city" description="도시를 선택하면 가볼 만한 곳을 알려드려요" />

  <div
    class="spot-box"
    v-else
    v-loading="isLoading"
    element-loading-text="주변 관광지를 불러오는 중..."
  >
    <el-alert v-if="errorMessage" type="error" :title="errorMessage" :closable="false" show-icon />

    <template v-else-if="spots.length > 0">
      <p class="spot-intro">
        <b class="spot-city">{{ city.name }}</b> 주변에서 가볼 만한 곳이에요.
      </p>

      <ul class="spot-list">
        <li class="spot-item" v-for="item in spots" :key="item.id">
          <div class="spot-thumb">
            <el-image
              class="spot-image"
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              fit="cover"
              lazy
            >
              <template #error>
                <span class="spot-fallback" aria-hidden="true">🏞️</span>
              </template>
            </el-image>

            <span class="spot-fallback" v-else aria-hidden="true">🏞️</span>
          </div>

          <div class="spot-body">
            <h3 class="spot-name">{{ item.title }}</h3>
            <p class="spot-address">{{ item.address }}</p>
          </div>

          <span class="spot-distance">{{ item.distance }}km</span>
        </li>
      </ul>

      <p class="spot-source">한국관광공사 관광정보 서비스 제공</p>
    </template>

    <el-empty v-else-if="!isLoading" description="주변에서 찾은 관광지가 없어요" />
  </div>
</template>

<style scoped>
.spot-box {
  min-height: 160px;
}

.spot-intro {
  margin-bottom: 12px;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.spot-city {
  font-weight: 700;
  color: var(--text-strong);
}

.spot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.spot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
}

.spot-thumb {
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--panel-bg);
}

.spot-image {
  display: block;
  width: 100%;
  height: 100%;
}

.spot-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 1.4rem;
}

.spot-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.spot-name {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--text-strong);
}

.spot-address {
  font-size: 0.76rem;
  line-height: 1.4;
  color: var(--text-soft);
}

.spot-distance {
  flex: none;
  font-size: 0.8rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-soft);
}

.spot-source {
  margin-top: 10px;
  font-size: 0.7rem;
  text-align: right;
  color: var(--text-soft);
  opacity: 0.8;
}
</style>

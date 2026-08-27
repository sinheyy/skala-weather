<script setup>
defineProps({
  city: { type: Object, default: null },
  spots: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})
</script>

<template>
  <p class="spot-msg" v-if="!city">
    <span class="spot-msg__icon" aria-hidden="true">🧭</span>
    도시를 선택하면 가볼 만한 곳을 알려드려요.
  </p>

  <p class="spot-msg" v-else-if="isLoading">🧭 주변 관광지를 불러오는 중입니다...</p>

  <p class="spot-msg" v-else-if="errorMessage">{{ errorMessage }}</p>

  <template v-else-if="spots.length > 0">
    <p class="spot-intro">
      <b class="spot-city">{{ city.name }}</b> 주변에서 가볼 만한 곳이에요.
    </p>

    <ul class="spot-list">
      <li class="spot-item" v-for="item in spots" :key="item.id">
        <img class="spot-image" v-if="item.image" :src="item.image" :alt="item.title" />
        <span class="spot-image spot-image--empty" v-else aria-hidden="true">🏞️</span>

        <div class="spot-body">
          <h3 class="spot-name">{{ item.title }}</h3>
          <p class="spot-address">{{ item.address }}</p>
        </div>

        <span class="spot-distance">{{ item.distance }}km</span>
      </li>
    </ul>

    <p class="spot-source">한국관광공사 관광정보 서비스 제공</p>
  </template>

  <p class="spot-msg" v-else>주변에서 찾은 관광지가 없어요.</p>
</template>

<style scoped>
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

.spot-image {
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
  background: var(--panel-bg);
}

.spot-image--empty {
  display: grid;
  place-items: center;
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

.spot-msg {
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

.spot-msg__icon {
  font-size: 1.3rem;
}
</style>

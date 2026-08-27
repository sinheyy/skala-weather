<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: { type: Object, default: null },
  spots: { type: Array, default: () => [] },
})

const spotInfo = computed(() => props.spots.find((item) => item.city === props.city.name) ?? null)

const spotTip = computed(() => {
  if (props.city.precipitation > 0) {
    return '비 소식이 있어요. 실내 관광지 위주로 도는 걸 추천해요.'
  }

  if (props.city.temp >= 30) {
    return '한낮에는 더우니 아침이나 저녁 일정으로 잡아 보세요.'
  }

  return '비 걱정은 없어요. 야외 일정을 넉넉히 잡아도 좋아요.'
})
</script>

<template>
  <template v-if="city && spotInfo">
    <p class="spot-intro">
      <b class="spot-city">{{ city.name }}</b
      >, {{ spotInfo.intro }}
    </p>

    <ol class="spot-list">
      <li class="spot-item" v-for="(spot, index) in spotInfo.spots" :key="spot">
        <span class="spot-no">{{ index + 1 }}</span>
        <span class="spot-name">{{ spot }}</span>
      </li>
    </ol>

    <p class="spot-tip">
      <span class="spot-tip__icon" aria-hidden="true">💡</span>
      {{ spotTip }}
    </p>
  </template>

  <p class="spot-empty" v-else>
    <span class="spot-empty__icon" aria-hidden="true">🧭</span>
    도시를 선택하면 가볼 만한 곳을 알려드려요.
  </p>
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
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid var(--divider);
  border-radius: 12px;
  background: var(--card-bg);
}

.spot-no {
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

.spot-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-strong);
}

.spot-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--divider);
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.spot-tip__icon {
  flex: none;
}

.spot-empty {
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

.spot-empty__icon {
  font-size: 1.3rem;
}

:root[data-theme='dark'] .spot-no {
  background: rgba(255, 255, 255, 0.1);
}
</style>

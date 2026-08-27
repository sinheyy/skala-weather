<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: { type: Object, default: null },
})

const outfit = computed(() => {
  if (props.city.temp >= 30) {
    return { icon: '🩳', name: '반팔 · 반바지', desc: '통풍 잘 되는 얇은 옷으로 입으세요.' }
  }

  if (props.city.temp >= 23) {
    return { icon: '👕', name: '반팔 · 얇은 셔츠', desc: '가볍게 입고 나가기 좋은 날이에요.' }
  }

  if (props.city.temp >= 17) {
    return {
      icon: '🧥',
      name: '맨투맨 · 얇은 가디건',
      desc: '아침저녁이 쌀쌀하니 겉옷을 챙기세요.',
    }
  }

  return { icon: '🧣', name: '두꺼운 외투 · 목도리', desc: '단단히 여미고 나가세요.' }
})

const menu = computed(() => {
  if (props.city.precipitation > 0) {
    return { icon: '🥘', name: '파전 · 부침개', desc: '비 오는 날엔 지글지글한 게 당기죠.' }
  }

  if (props.city.temp >= 30) {
    return { icon: '🍜', name: '냉면 · 콩국수', desc: '더위엔 시원한 면 요리가 최고예요.' }
  }

  if (props.city.temp >= 23) {
    return { icon: '🍙', name: '김밥 · 샌드위치', desc: '가볍게 들고 나가 피크닉 어떠세요?' }
  }

  return { icon: '🍲', name: '국밥 · 칼국수', desc: '따뜻한 국물로 몸을 데우세요.' }
})
</script>

<template>
  <template v-if="city">
    <div class="pick-grid">
      <div class="pick-card">
        <p class="pick-label">오늘의 옷차림</p>
        <span class="pick-icon" aria-hidden="true">{{ outfit.icon }}</span>
        <p class="pick-name">{{ outfit.name }}</p>
        <p class="pick-desc">{{ outfit.desc }}</p>
      </div>

      <div class="pick-card">
        <p class="pick-label">오늘의 메뉴</p>
        <span class="pick-icon" aria-hidden="true">{{ menu.icon }}</span>
        <p class="pick-name">{{ menu.name }}</p>
        <p class="pick-desc">{{ menu.desc }}</p>
      </div>
    </div>

    <p class="pick-caption">
      <b class="pick-target">{{ city.name }}</b
      >의 기온 · 강수량으로 골랐어요.
    </p>
  </template>

  <el-empty v-else description="도시를 선택하면 옷차림과 메뉴를 추천해 드려요" :image-size="60" />
</template>

<style scoped>
.pick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.pick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 14px 10px;
  border: 1px solid var(--divider);
  border-radius: 14px;
  background: var(--card-bg);
  text-align: center;
}

.pick-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-soft);
}

.pick-icon {
  font-size: 1.6rem;
  line-height: 1.2;
}

.pick-name {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text-strong);
}

.pick-desc {
  font-size: 0.74rem;
  line-height: 1.5;
  color: var(--text-soft);
}

.pick-caption {
  margin-top: 12px;
  font-size: 0.74rem;
  line-height: 1.5;
  color: var(--text-soft);
}

.pick-target {
  color: var(--text-strong);
}
</style>

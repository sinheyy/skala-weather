# 날씨 안내 및 여행지 추천 서비스

- **과목명** : Front-framework: Vue.js
- **프로젝트명** : skala-weather
- 전체적인 스타일 구현은 제가 컨셉과 가이드를 제안하고 AI의 도움을 받았습니다.

<img width="1669" height="929" alt="실행화면" src="https://github.com/user-attachments/assets/2a1d7c93-8aa1-4268-8fde-9c5263a46e77" />

---

## 목차

- [페이지 구성](#페이지-구성)
- [Hands on 단계별 진행](#hands-on-단계별-진행)
  - [1. Weather Mockup — Vue Syntax](#1-weather-mockup--vue-syntax)
  - [2. Weather Composition — Composition API](#2-weather-composition--composition-api)
  - [3. Weather Component — 기능 변경 없이 컴포넌트 분리](#3-weather-component--기능-변경-없이-컴포넌트-분리)
  - [4. Weather Router — 페이지 분리](#4-weather-router--페이지-분리)
  - [5. Weather Store — Pinia](#5-weather-store--pinia)
  - [6. Weather Axios — 실제 데이터 연동](#6-weather-axios--실제-데이터-연동)
  - [7. Weather UI Library — Element Plus 부분 적용](#7-weather-ui-library--element-plus-부분-적용)
- [구현 내용 정리](#구현-내용-정리)
  - [1. 사용한 이벤트 정리](#1-사용한-이벤트-정리)
  - [2. 공통 패널 컴포넌트 (`Slot`)](#2-공통-패널-컴포넌트-slot)
  - [3. 검색 입력 (`Props` / `Emits`)](#3-검색-입력-props--emits)
  - [4. 날씨 카드 (객체 `Props` + 이벤트 3종)](#4-날씨-카드-객체-props--이벤트-3종)
  - [5. 사이드 패널 — 계산까지 이동](#5-사이드-패널--계산까지-이동)
  - [6. 라우팅 · 지연 로딩](#6-라우팅--지연-로딩)
  - [7. 상세 페이지 — 동적 라우트](#7-상세-페이지--동적-라우트)
  - [8. 데이터 흐름](#8-데이터-흐름)
  - [9. 키보드 단축키 (`키 수식어`)](#9-키보드-단축키-키-수식어)
  - [10. 나만의 반응형 변수 — 더운 지역만 보기](#10-나만의-반응형-변수--더운-지역만-보기)
  - [11. 직접 추가한 화면](#11-직접-추가한-화면)
  - [12. 옷차림 · 메뉴 추천 패널](#12-옷차림--메뉴-추천-패널)
  - [13. 전역 상태 (`Pinia`)](#13-전역-상태-pinia)
  - [14. Axios — 실시간 날씨 연동](#14-axios--실시간-날씨-연동)
  - [15. 추가 API — 예보 · 일출 · 관광지](#15-추가-api--예보--일출--관광지)
  - [16. 즐겨찾기 · 방문 기록](#16-즐겨찾기--방문-기록)
  - [17. UI 라이브러리 (`Element Plus`)](#17-ui-라이브러리-element-plus)
- [트러블슈팅](#트러블슈팅)
  - [1. 새로고침하면 404](#1-새로고침하면-404)

## 페이지 구성

| 경로               | 이름       | 화면                                                        |
| ------------------ | ---------- | ----------------------------------------------------------- |
| `/`                | `home`     | 메인 대시보드 — 검색 / 지역별 카드 / 생활지수 / 추천 / 랭킹 |
| `/weather/:cityId` | `detail`   | 선택한 도시의 상세 기상 정보                                |
| `/travel`          | `travel`   | 날씨 조건을 골라 점수로 뽑는 여행지 추천 (커스텀 뷰)        |
| `/rainy`           | `rainy`    | 비가 오는 지역만 모아 보기 (커스텀 뷰)                      |
| `/about`           | `about`    | 서비스 소개                                                 |
| `/:pathMatch(.*)*` | `NotFound` | 존재하지 않는 경로                                          |

---

## Hands on 단계별 진행

각 단계의 과제 요구사항과, 이 프로젝트에서 무엇이 바뀌었는지 정리했습니다.

### 1. Weather Mockup — Vue Syntax

| 요구사항                                  | 구현                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| 배열 렌더링 (`v-for`, `:key`에 id)        | 날씨 카드 반복 출력                                                                    |
| 조건부 렌더링 (`v-if`) — 25도 기준 라벨   | 🔥 더움 / ❄️ 선선함 배지                                                               |
| 양방향 바인딩 + 한글 (`:value`, `@input`) | 도시 검색 입력, 입력한 도시명 출력                                                     |
| 이벤트 · 수식어                           | 카드 클릭 시 상태바 표기, [상세보기]는 `@click.stop`으로 버블링 차단 후 `window.alert` |
| 본인 데이터 · Mockup 추가                 | 습도 · 강수량 필드 추가, 전국 18개 지역으로 확장                                       |

### 2. Weather Composition — Composition API

| 요구사항                                      | 구현                                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| 반응형 상태 3종                               | `keyword`, `selectedCity`, `weatherList`             |
| `computed` 필터링                             | `filteredWeatherList`                                |
| `watch` · `watchEffect` 감시                  | 상태바 문구 변화 / 검색어 추적 콘솔 로그로 확인 가능 |
| 검색 결과에 따라 다르게 표시                  | 검색어 없음 · 일치 · 결과 없음                       |
| **본인만의 반응형 변수 · computed · watcher** | `onlyHot` — 더운 지역만 보기 토글 + 전용 `watch`     |

### 3. Weather Component — 기능 변경 없이 컴포넌트 분리

| 요구사항                       | 구현                                                                   |
| ------------------------------ | ---------------------------------------------------------------------- |
| 부모가 모든 반응형 데이터 보유 | `WeatherHomeView`가 상태 소유                                          |
| 공통 패널 (`<slot>`)           | `BaseDashboardCard`                                                    |
| 검색바 (props ↓ / emits ↑)     | `SearchBar` — `keyword` / `update-query`                               |
| 날씨 카드 (객체 props + emits) | `WeatherCard` — `select-card`, `click-detail`, `show-recommend`        |
| 컴포넌트별 `<style scoped>`    | 전 컴포넌트 적용                                                       |
| **본인 추가 컴포넌트**         | `LifeIndexPanel`(생활지수), `RankingBoard`(전국 랭킹), `NavigationBar` |

### 4. Weather Router — 페이지 분리

| 요구사항                                   | 구현                                                            |
| ------------------------------------------ | --------------------------------------------------------------- |
| 지연 로딩 · Catch-all Route                | 전 라우트 `() => import(...)`, `/:pathMatch(.*)*`               |
| `App.vue`에 네비게이션 + `RouterView`      | `NavigationBar` + `<RouterView />`                              |
| 홈 뷰가 부모 컴포넌트 대체, **alert 제거** | 상세 클릭 시 `window.alert` → `router.push({ name: 'detail' })` |
| 상세 뷰 — `:cityId` 동적 라우트            | `route.params.cityId`로 도시 조회                               |
| 서비스 소개 페이지                         | `WeatherAboutView`                                              |
| **본인 추가 view**                         | `/rainy` 비 소식, `/travel` 여행지 추천                         |

여기에 교안 pdf의 키보드 수식어를 활용해 검색창 단축키(`Enter` · `Esc`)를 더했습니다.
검색창에 커서를 둔 채로 Enter 클릭 시, 첫 번째 도시가 선택되며 Esc 클릭 시, 검색어가 지워집니다.

### 5. Weather Store — Pinia

| 요구사항                                                                    | 구현                                                    |
| --------------------------------------------------------------------------- | ------------------------------------------------------- |
| `configStore.js` — state `unit` / getter `unitSymbol` / action `toggleUnit` | 그대로 작성                                             |
| `UnitToggler.vue`를 네비게이션 옆 배치                                      | `App.vue` 상단 헤더 우측                                |
| 메인 · 상세에 단위 설정 적용                                                | 카드 · 상세 · 전국 랭킹까지 반영                        |
| **본인 추가 Store**                                                         | `favoriteStore`(즐겨찾기), `historyStore`(최근 본 지역) |

최근 본 지역은 '상세보기'를 클릭해서 상세 페이지에 이동했던 적이 있는 지역이 있을 경우 표시됩니다.

### 6. Weather Axios — 실제 데이터 연동

| 요구사항                      | 구현                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------- |
| OpenWeatherMap 실제 날씨 적용 | `weatherStore.fetchWeatherList()` — 18개 도시 `Promise.all`                       |
| **OpenWeatherMap 추가 API**   | 5일/3시간 예보(`/forecast`) → 상세 페이지 내 24시간 예보                          |
| **기타 외부 API**             | 한국관광공사 관광정보(`locationBasedList2`) API 호출 → 도시별 가볼 만한 곳을 표시 |

- 각 뷰에 복사돼 있던 데이터를 **`weatherStore` 한 곳으로** 합침 (AI 추천)
- 하드코딩했던 관광지 목록(18개 × 3곳)을 지우고 관광정보 API 응답으로 교체
- OpenWeatherMap 응답에 들어 있던 데이터로 일출 · 일몰 등 추가 정보 표시

### 7. Weather UI Library — Element Plus 부분 적용

- Mockup 단계에서 넣었던 `window.alert`이 이 단계에서 **`ElMessage` 토스트**로 바뀌며 완전히 사라짐
- 레이아웃과 폼은 손대지 않아 기존 디자인을 유지

## 구현 내용 정리

### 1. 사용한 이벤트 정리

이 프로젝트에서 쓴 이벤트를 정리했습니다. `v-on`(축약형 `@`)으로 연결하며, **브라우저가 발생시키는 DOM 이벤트**와 **자식 컴포넌트가 직접 만들어 올리는 커스텀 이벤트** 두 가지를 씁니다.

#### DOM 이벤트

| 이벤트   | 발생 시점                        | 사용처                                                              |
| -------- | -------------------------------- | ------------------------------------------------------------------- |
| `@click` | 요소를 클릭했을 때               | 카드 선택, 상세보기, 즐겨찾기 별, 필터 토글, 단위 변경, 기록 지우기 |
| `@input` | 입력값이 바뀔 때마다 (타이핑 중) | 도시 검색창                                                         |
| `@keyup` | 눌렀던 키에서 손을 뗐을 때       | 검색창 단축키 (`Enter` · `Esc`)                                     |

`@input`은 글자를 칠 때마다 즉시 발생해서 검색 결과가 실시간으로 좁혀집니다. `@change`는 포커스가 빠질 때만 발생하므로 실시간 필터에는 맞지 않고, 한글은 조합 중에도 값이 반영돼야 해서 `@input`을 썼습니다.

#### 이벤트 수식어

| 수식어   | 실제 동작                 | 사용 이유                                                                  |
| -------- | ------------------------- | -------------------------------------------------------------------------- |
| `.stop`  | `event.stopPropagation()` | 카드 전체에 `@click`이 걸려 있어, 내부 버튼 클릭이 카드로 번지는 것을 차단 |
| `.enter` | `Enter` 키일 때만 실행    | `event.key === 'Enter'` 비교를 대신함                                      |
| `.esc`   | `Escape` 키일 때만 실행   | 위와 동일                                                                  |

#### 커스텀 이벤트 (`emits`)

자식은 **"무슨 일이 있었다"만 알리고**, 실제 처리는 데이터를 가진 부모가 합니다.

| 이벤트           | 보내는 곳     | 전달 값     | 부모가 하는 일                   |
| ---------------- | ------------- | ----------- | -------------------------------- |
| `update-query`   | `SearchBar`   | 입력 문자열 | `keyword` 갱신                   |
| `select-first`   | `SearchBar`   | 없음        | 검색 결과 첫 도시를 선택         |
| `select-card`    | `WeatherCard` | 도시 이름   | 상태바에 선택 도시 표시          |
| `click-detail`   | `WeatherCard` | 도시 id     | `router.push`로 상세 페이지 이동 |
| `show-recommend` | `WeatherCard` | 날씨 상태   | 날씨별 추천 문구를 토스트로 표시 |

### 2. 공통 패널 컴포넌트 (`Slot`)

검색 영역과 리스트 영역이 같은 카드 디자인을 반복하고 있어 **껍데기만 컴포넌트로 분리**하고 내용은 슬롯으로 주입받게 했습니다.

```html
<!-- BaseDashboardCard.vue -->
<section class="panel">
  <h2 class="panel-title" v-if="title">{{ title }}</h2>
  <slot></slot>
</section>
```

```html
<!-- BaseDashboardCard 사용 -->
<BaseDashboardCard title="도시 검색">
  <SearchBar :keyword="keyword" @update-query="keyword = $event" />
</BaseDashboardCard>
```

- **제목은 슬롯이 아닌 `title` prop으로** 받음

### 3. 검색 입력 (`Props` / `Emits`)

`keyword` 상태는 부모가 그대로 소유하고 `SearchBar`는 표시와 입력 전달만 담당합니다.

```js
// SearchBar.vue
defineProps({
  keyword: { type: String, default: '' },
})

defineEmits(['update-query'])
```

```html
<input :value="keyword" @input="$emit('update-query', $event.target.value)" />
```

```html
<!-- WeatherHomeView.vue -->
<SearchBar :keyword="keyword" @update-query="keyword = $event" />
```

- props는 읽기 전용이라 **내려줄 때는 `:value`, 바꿀 때는 emit**을 사용
- 부모의 `keyword`가 갱신 → props로 다시 내려옴 → 화면 반영
- 입력중인 한글이 즉시 반영되도록 `v-model` 대신 `:value` + `@input`을 유지

### 4. 날씨 카드 (객체 `Props` + 이벤트 3종)

카드는 도시 객체 하나를 받아 그리기만 하고 무엇을 할지는 전부 부모가 결정합니다.

```js
// WeatherCard.vue
defineProps({
  city: { type: Object, required: true },
})

defineEmits(['select-card', 'click-detail', 'show-recommend'])
```

```html
<article class="city-card" @click="$emit('select-card', city.name)">
  <button class="city-status" @click.stop="$emit('show-recommend', city.status)">
    {{ city.status }}
  </button>
  ...
  <button class="detail-btn" @click.stop="$emit('click-detail', city.id)">상세보기</button>
</article>
```

```html
<!-- WeatherHomeView.vue -->
<WeatherCard
  v-for="item in filteredWeatherList"
  :key="item.id"
  :city="item"
  @select-card="clickCity"
  @click-detail="showDetail"
  @show-recommend="showRecommend"
/>
```

- 날씨 카드 컴포넌트 분리
- `v-for`와 `:key`는 부모에 남김
- 카드 전체에 `@click`이 걸려 있어 내부 버튼에는 `.stop`을 추가해 버블링 방지
  (카드 전체 클릭과 상세보기 버튼 클릭 분리)

### 5. 사이드 패널 — 계산까지 이동

`LifeIndexPanel`과 `RankingBoard`는 표시뿐 아니라 **계산**도 컴포넌트 내부로 이동했습니다.

```js
// LifeIndexPanel.vue
const props = defineProps({
  city: { type: Object, default: null },
})

const laundryIndex = computed(() => {
  if (props.city.temp >= 23 && props.city.humidity <= 55 && props.city.precipitation <= 0) {
    return '추천👍'
  }
  return '비추천👎'
})
```

```html
<LifeIndexPanel :city="selectedCityData" /> <RankingBoard :cities="weatherList" />
```

```js
const tempRankList = computed(() => {
  return [...props.cities].sort((a, b) => b.temp - a.temp).slice(0, 10)
})
```

- 이 패널에서만 사용하는 계산이기 때문에 computed 계산 부분을 컴포넌트 내부로 이동
- 생활지수(빨래지수, 세차지수, 우산지수)는 간단하게 if문을 통해 조건을 걸어 구현
  (조건은 제가 임의로 특정 온도, 습도, 강수량 등으로 지정)
- 선택한 도시의 생활지수를 보여주기 때문에 부모에서 선택한 도시 데이터를 Props로 넘김
- 랭킹은 날씨 데이터를 가져와서 정렬(원본이 아닌 스프레드를 사용해 복사한 배열 기준으로 정렬)

### 6. 라우팅 · 지연 로딩

```js
// router/index.js
routes: [
  { path: '/', name: 'home', component: () => import('@/views/WeatherHomeView.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/WeatherAboutView.vue') },
  {
    path: '/weather/:cityId',
    name: 'detail',
    component: () => import('@/views/WeatherDetailView.vue'),
  },
  { path: '/travel', name: 'travel', component: () => import('@/views/TravelPickView.vue') },
  { path: '/rainy', name: 'rainy', component: () => import('@/views/WeatherRainyView.vue') },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
```

```html
<template>
  <nav class="nav-bar">
    <RouterLink class="nav-link" to="/">HOME</RouterLink>
    <RouterLink class="nav-link" to="/rainy">RAINY</RouterLink>
    <RouterLink class="nav-link" to="/travel">TRAVEL</RouterLink>
    <RouterLink class="nav-link" to="/about">ABOUT</RouterLink>
  </nav>
</template>
```

- 컴포넌트를 직접 넘기지 않고 lazyLoding 적용
- 네비게이션 바는 RouterLink 사용

### 7. 상세 페이지 — 동적 라우트

```js
// WeatherDetailView.vue
const route = useRoute()

const city = computed(() => weatherStore.findCity(route.params.cityId))
```

```js
// WeatherHomeView.vue — 카드의 상세보기에서 이동
const showDetail = (cityId) => {
  router.push({ name: 'detail', params: { cityId } })
}
```

- 상세 페이지의 경로를 path: '/weather/:cityId'로 했기 때문에 router.push로 이동
- 동적 세그먼트 `:cityId`를 `route.params.cityId`로 읽어 날씨 정보를 저장한 스토어에서 일치하는 도시 객체를 찾아 상세 페이지에 표시
- 없는 `cityId`로 들어오면 안내 문구 표시

### 8. 데이터 흐름

날씨 데이터는 **`weatherStore` 한 곳**에만 있습니다. `App.vue`가 앱 시작 시 한 번 받아 두면 모든 화면이 같은 배열을 봅니다.

```
App.vue (onMounted)
   └─ weatherStore.fetchWeatherList()   ← 18개 도시 1회 조회
        ├─ WeatherHomeView    검색 · 필터 · 랭킹
        ├─ WeatherDetailView  선택한 도시 1개
        ├─ TravelPickView     점수 계산
        └─ WeatherRainyView   비 오는 지역
```

- 처음에는 같은 배열이 네 뷰에 복사돼 있었음 -> 라우팅된 뷰끼리는 부모–자식이 아니라 **`RouterView`가 갈아 끼우는 형제 관계**라 props가 닿지 않기 때문 -> 스토어로 올리면서 중복이 사라졌습니다.
- 반대로 컴포넌트는 전부 자식이므로 **데이터를 직접 import하는 컴포넌트는 하나도 없음** 전부 props로 받음

### 9. 키보드 단축키 (`키 수식어`)

검색창에서 마우스 없이 조작할 수 있도록 이벤트 수식어를 붙였습니다.

```html
<!-- SearchBar.vue -->
<input
  :value="keyword"
  @input="$emit('update-query', $event.target.value)"
  @keyup.enter="$emit('select-first')"
  @keyup.esc="$emit('update-query', '')"
/>
```

```js
// WeatherHomeView.vue
const selectFirstCity = () => {
  const first = filteredWeatherList.value[0]
  selectedCity.value = first ? first.name : ''
}
```

| 키      | 동작                            |
| ------- | ------------------------------- |
| `Enter` | 검색 결과의 첫 번째 도시를 선택 |
| `Esc`   | 입력한 검색어를 한 번에 지우기  |

- 단축키를 처리하는 쪽은 부모
- 자식은 `select-first`라는 **"엔터를 눌렀다"는 사실만** emit하고 첫 번째 도시를 고르는 판단은 목록을 가진 부모가 함
- `Esc`는 별도 이벤트를 만들지 않고 기존 `update-query`에 빈 문자열을 실어 보내 재사용

### 10. 나만의 반응형 변수 — 더운 지역만 보기

```js
const onlyHot = ref(false)

const filteredWeatherList = computed(() => {
  const trimKeyword = keyword.value.trim()

  return weatherList.value.filter((item) => {
    const matchKeyword = !trimKeyword || item.name.includes(trimKeyword)
    return matchKeyword && (!onlyHot.value || item.temp >= 25)
  })
})

watch(onlyHot, (newValue) => {
  console.log(`[watch👀-onlyHot] 더운 지역만 보기: ${newValue}`)
})
```

- 조건을 `computed` 두 개로 나누지 않고 **하나의 `filter` 안에서 합침** 검색어와 온도 조건이 항상 함께 걸리기 때문입니다.
- `!onlyHot.value || ...` 형태로 써서, 토글이 꺼져 있으면 온도 조건 자체를 건너뜀
- 토글은 `@click="onlyHot = !onlyHot"`(켜진 표시는 스타일 바인딩으로 처리)

### 11. 직접 추가한 화면

**여행지 추천 (`/travel`)** — 원하는 날씨 조건을 버튼으로 고르면 점수가 다시 계산

```js
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
```

- 기준 3개(기온 · 강수량 · 습도)를 각각 2지선다 버튼으로 만들고 점수를 계산
- 순위는 `computed` 안에서 `map` → `sort` → `slice(0, 5)`로 만들었음
- `ref`를 읽고 있으므로 버튼을 누르면 자동으로 다시 계산
- 1위가 바뀔 때를 `watch(bestCity, ...)`로 감지해 콘솔에 남김

**비 소식 (`/rainy`)** — 강수량 기준을 골라 비 오는 지역만 모아 봄

- `<option :value="0">`처럼 숫자를 바인딩하고 `v-model.number`로 받아 강수량 비교가 문자열이 아닌 숫자로 이뤄지게 함
- 카드는 홈에서 쓰던 `WeatherCard`를 그대로 재사용, `@click-detail`만 연결해 상세 페이지로 보냄

### 12. 옷차림 · 메뉴 추천 패널

`OutfitPanel`은 생활지수와 같은 방식으로 받은 도시 하나만 보고 결과를 정함

```js
// OutfitPanel.vue
const outfit = computed(() => {
  if (props.city.temp >= 30) {
    return { icon: '🩳', name: '반팔 · 반바지', desc: '통풍 잘 되는 얇은 옷으로 입으세요.' }
  }
  if (props.city.temp >= 23) {
    return { icon: '👕', name: '반팔 · 얇은 셔츠', desc: '가볍게 입고 나가기 좋은 날이에요.' }
  }
  ...
})
```

- 문자열 대신 **객체를 반환**해서 아이콘 · 이름 · 설명을 한 번에 넘김
- 템플릿에서는 `{{ outfit.icon }}`처럼 꺼내 씀
- `TravelSpotPanel`은 처음엔 하드코딩한 명소 목록에서 `find`로 찾았으나 지금은 **관광정보 API 결과를 `:spots`로 받아 그리기만 함**, 조회는 `tourStore`가 맡음
- 패널들은 홈 · 상세 · 여행지 추천 **여러 화면에서 그대로 재사용**

### 13. 전역 상태 (`Pinia`)

화면이 바뀌어도 이어져야 하는 값은 스토어로 올렸습니다.

| 스토어          | state                                      | getters                  | actions                                          |
| --------------- | ------------------------------------------ | ------------------------ | ------------------------------------------------ |
| `weatherStore`  | `weatherList`, `isLoading`, `errorMessage` | —                        | `fetchWeatherList`, `findCity`                   |
| `tourStore`     | `spotList`, `isLoading`, `errorMessage`    | —                        | `fetchSpots`                                     |
| `configStore`   | `unit`                                     | `unitSymbol`, `unitName` | `toggleUnit`                                     |
| `favoriteStore` | `favoriteIds`                              | `favoriteCount`          | `isFavorite`, `toggleFavorite`, `clearFavorites` |
| `historyStore`  | `historyIds`                               | `hasHistory`             | `addHistory`, `clearHistory`                     |

- `favoriteStore`와 `historyStore`는 **직접 추가한 스토어**
- `favoriteStore` : 즐겨찾기한 도시를 위한 스토어
- `historyStore` : 상세페이지를 눌렀던 도시를 기록하기 위한 스토어

### 14. Axios — 실시간 날씨 연동

```js
// stores/weatherStore.js
const fetchWeatherList = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const responses = await Promise.all(
      regionList.map((region) =>
        axios.get(CURRENT_URL, {
          params: { q: region.query, appid: API_KEY, units: 'metric', lang: 'kr' },
        }),
      ),
    )

    weatherList.value = responses.map((response, index) =>
      toCityItem(regionList[index], response.data),
    )
  } catch (error) {
    console.error('날씨 데이터를 가져오지 못했습니다:', error)
    errorMessage.value = '날씨 데이터를 불러오지 못했어요. API Key를 확인해 주세요.'
  } finally {
    isLoading.value = false
  }
}
```

- 교수님 코드를 참고하여 도시명으로 도시에 따른 날씨 정보를 한번에 불러옴
- 응답을 그대로 쓰지 않고 `toCityItem()`으로 **화면이 쓰던 모양으로 변환**하는 과정을 거침(AI 도움을 받음)

### 15. 추가 API — 예보 · 일출 · 관광지

**24시간 예보** (`/data/2.5/forecast`) — 상세 페이지에서 도시가 정해질 때 1회 호출하고 3시간 간격 목록에서 앞 8개만 사용

- 예보 API 호출에 대한 응답에서 시간을 변환해서 노출
- 아이콘은 `weather[0].icon` 코드를 `https://openweathermap.org/img/wn/{code}@2x.png`에 넣어서 openweathermap에서 제공하는 이미지 사용

**일출 · 일몰** — 별도 API 없이 현재 날씨 응답의 `sys.sunrise` / `sys.sunset`을 사용

**주변 관광지** (한국관광공사 `locationBasedList2`) — 날씨 응답의 `coord.lat` / `coord.lon`을 파라미터로 넘겨 주변 관광지 정보를 불러와서 노출
해당 API를 가져와서 노출하는데에 AI 도움을 받음

- 하드코딩해 두었던 관광지 목록을 지우고 날씨 응답에서 온 위도 경도 정보를 파라미터로 넘겨서 해당 지역의 관광 정보를 받아와 노출
- API 주소는 키와 함께 `.env`로 분리

```js
const BASE_URL = import.meta.env.VITE_TOUR_BASE_URL
const TOUR_URL = `${BASE_URL}/locationBasedList2`
```

### 16. 즐겨찾기 · 방문 기록

```js
// stores/historyStore.js
const addHistory = (cityId) => {
  const rest = historyIds.value.filter((id) => id !== cityId)

  historyIds.value = [cityId, ...rest].slice(0, 5)
}
```

- 이미 있는 id를 걸러내고 중복없이 5개만 노출
- 기록은 상세 페이지 `onMounted`에서 남기고 메인 페이지에서는 `v-if="historyStore.hasHistory"`로 기록이 있을 때만 카드를 노출
- 즐겨찾기 클릭을 위한 별은 카드 클릭과 겹치므로 `@click.stop`이 필요
- 필터는 기존 검색 · 온도 조건에 `matchFavorite` 한 줄을 더해 처리
- 두 스토어(즐겨찾기, 히스토리) 모두 새로고침하면 초기화

### 17. UI 라이브러리 (`Element Plus`)

교안이 비교한 5개(PrimeVue · Vuetify · Element Plus · Ant Design Vue · Quasar) 중 **Element Plus**를 골랐습니다.

**적용 범위 — 부분 적용**

레이아웃(`el-card`, `el-row`/`el-col`)과 폼(`el-input`, `el-select`)은 손대지 않았습니다. 이미 만들어 둔 디자인을 유지하기 위해 **직접 만들기 번거로웠던 상태 표현만** 교체했습니다.

| 컴포넌트      | 사용처                                            | 대체한 것           |
| ------------- | ------------------------------------------------- | ------------------- |
| `ElMessage`   | 홈 — 날씨 상태 버튼                               | **`window.alert`**  |
| `v-loading`   | 상세 — 24시간 예보 · 가볼 만한 곳                 | 로딩 문구           |
| `el-skeleton` | 홈 · 상세 · 비 소식 · 여행지 추천                 | 로딩 문구           |
| `el-empty`    | 생활지수 · 옷차림 · 관광지 · 검색결과 · 없는 도시 | 직접 만든 점선 박스 |
| `el-alert`    | 홈 · 예보 · 관광지 조회 실패                      | 에러 텍스트         |
| `el-image`    | 관광지 사진 (`lazy` + `#error` 슬롯)              | `<img>`             |

## 트러블슈팅

정적 빌드 결과물을 Vercel에 배포했습니다. 배포하면서 로컬에서는 드러나지 않던 문제를 만나 해결 과정에서 **AI의 도움을 받았습니다.**

### 1. 새로고침하면 404

배포 후 `nalssi.vercel.app/weather/city_02`에서 새로고침하면 Vercel의 `404: NOT_FOUND`가 떴습니다.

빌드 결과물에 HTML 파일은 `dist/index.html` **하나뿐**입니다. 앱 안에서 링크로 이동할 때는 Vue Router가 처리하니 잘 되지만 새로고침이나 주소 직접 입력은 요청이 서버로 가고 서버에는 그 경로에 해당하는 파일이 없습니다.

모든 경로에 `index.html`을 돌려주도록 설정해 해결했습니다.

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

# Hands on - Weather Axios

- **과목명** : Front-framework: Vue.js
- **실습과제** : Hands on - Weather Mockup → Composition → Component → Router → Store → Axios
- **프로젝트명** : skala-weather

한 파일(`App.vue`)에 몰려 있던 날씨 목업을 **재사용 가능한 컴포넌트로 분리**하고,
**Vue Router**로 여러 페이지를 가진 애플리케이션으로 확장했습니다.
Slot으로 공통 패널 디자인을 하나로 묶고, Props / Emits로 부모–자식 간 데이터 흐름을 정리했으며,
여기에 **Pinia 전역 스토어**로 단위 · 즐겨찾기 · 방문 기록을 모든 화면이 함께 쓰도록 했고,
**Axios**로 OpenWeatherMap과 한국관광공사 관광정보를 연동해 화면을 실제 데이터로 채웠습니다.
**키보드 단축키**와 **직접 만든 화면 두 개**(여행지 추천 · 비 소식)도 더했습니다.

---

## 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 발급받은 키를 넣습니다. `VITE_`로 시작해야 클라이언트 코드에서 읽을 수 있습니다.

```
VITE_OPENWEATHER_API_KEY=OpenWeatherMap에서_발급받은_키
VITE_TOUR_API_KEY=공공데이터포털_일반인증키(Decoding)
```

- 공공데이터포털 키는 반드시 **Decoding** 쪽을 넣습니다. Encoding 키(`%2B` 등이 섞인 값)를 넣으면 axios가 한 번 더 인코딩해 인증이 실패합니다.
- `.env`는 `.gitignore`에 등록해 두었습니다.

## 프로젝트 구조

```
src/
├─ App.vue                  레이아웃 셸 (네비게이션 + RouterView)
├─ router/index.js          라우트 정의 · 지연 로딩
├─ stores/
│  ├─ weatherStore.js       실시간 날씨 (OpenWeatherMap)
│  ├─ tourStore.js          주변 관광지 (한국관광공사)
│  ├─ configStore.js        날씨 단위 (섭씨 / 화씨)
│  ├─ favoriteStore.js      즐겨찾기 도시 (직접 추가)
│  └─ historyStore.js       최근 본 지역 (직접 추가)
├─ views/
│  ├─ WeatherHomeView.vue   메인 대시보드 (Mock Data · 상태 소유)
│  ├─ WeatherDetailView.vue 도시 상세 페이지
│  ├─ TravelPickView.vue    여행지 추천 (직접 추가)
│  ├─ WeatherRainyView.vue  비 소식 (직접 추가)
│  ├─ WeatherAboutView.vue  서비스 소개
│  └─ NotFoundView.vue      404
├─ components/exercise/
│  ├─ BaseDashboardCard.vue 공통 패널 (slot)
│  ├─ NavigationBar.vue     상단 네비게이션
│  ├─ UnitToggler.vue       섭씨 · 화씨 전환
│  ├─ SearchBar.vue         도시 검색 입력 · 단축키
│  ├─ WeatherCard.vue       도시 카드 1장
│  ├─ LifeIndexPanel.vue    생활지수
│  ├─ OutfitPanel.vue       옷차림 · 메뉴 추천
│  ├─ TravelSpotPanel.vue   가볼 만한 곳
│  └─ RankingBoard.vue      전국 랭킹
└─ assets/main.css          색상 토큰 · 배경 (전역)
```

## 페이지 구성

| 경로               | 이름       | 화면                                                        |
| ------------------ | ---------- | ----------------------------------------------------------- |
| `/`                | `home`     | 메인 대시보드 — 검색 / 지역별 카드 / 생활지수 / 추천 / 랭킹 |
| `/weather/:cityId` | `detail`   | 선택한 도시의 상세 기상 정보                                |
| `/travel`          | `travel`   | 날씨 조건을 골라 점수로 뽑는 여행지 추천 (직접 추가)        |
| `/rainy`           | `rainy`    | 비가 오는 지역만 모아 보기 (직접 추가)                      |
| `/about`           | `about`    | 서비스 소개                                                 |
| `/:pathMatch(.*)*` | `NotFound` | 존재하지 않는 경로                                          |

```
App.vue (셸)
├─ NavigationBar          HOME / RAINY / TRAVEL / ABOUT — 모든 페이지 공통
├─ UnitToggler           섭씨 / 화씨 — 모든 페이지 공통
└─ RouterView
   └─ WeatherHomeView
      ├─ [도시 검색]        SearchBar        (Enter / Esc 단축키)
      ├─ [최근 본 지역]      historyStore 기록이 있을 때만 표시
      ├─ [지역별 날씨 현황]  WeatherCard × 18 (더운 지역 · 즐겨찾기 필터)
      ├─ [생활지수]         LifeIndexPanel
      ├─ [오늘의 추천]       OutfitPanel
      ├─ [전국 랭킹]        RankingBoard
      └─ [상태바]           화면 하단 고정 — 선택한 도시 표시
```

---

## 구현 내용

### 1. 공통 패널 컴포넌트 (`Slot`)

검색 영역과 리스트 영역이 같은 카드 디자인을 반복하고 있어, **껍데기만 컴포넌트로 분리**하고 내용은 슬롯으로 주입받게 했습니다.

```html
<!-- BaseDashboardCard.vue -->
<section class="panel">
  <h2 class="panel-title" v-if="title">{{ title }}</h2>
  <slot></slot>
</section>
```

```html
<!-- 사용하는 쪽 -->
<BaseDashboardCard title="도시 검색">
  <SearchBar :keyword="keyword" @update-query="keyword = $event" />
</BaseDashboardCard>
```

- **제목은 슬롯이 아닌 `title` prop으로** 받았습니다. 슬롯으로 넘기면 그 마크업은 부모 스코프로 컴파일되어, `BaseDashboardCard`의 `<style scoped>`에 있는 `.panel-title` 스타일이 적용되지 않습니다.
- 반대로 슬롯에 꽂아 넣는 내용(`.search-box`, `.city-grid` 등)은 부모 스코프이므로 **스타일도 부모에 그대로 두어야** 합니다.
- 자식 컴포넌트의 루트 엘리먼트에는 부모의 scope id도 함께 붙기 때문에, `.content-row`의 그리드 배치 같은 부모 쪽 레이아웃 선택자가 그대로 동작합니다.

### 2. 검색 입력 (`Props` / `Emits`)

`keyword` 상태는 부모가 그대로 소유하고, `SearchBar`는 표시와 입력 전달만 담당합니다.

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

- props는 읽기 전용이라 `v-model="keyword"`를 쓰면 경고가 발생합니다. **내려줄 때는 `:value`, 바꿀 때는 emit**으로 방향을 나눴습니다.
- 부모의 `keyword`가 갱신 → props로 다시 내려옴 → 화면 반영. 단방향 흐름이 한 바퀴 도는 구조입니다.
- 같은 `$event`라도 의미가 다릅니다. 네이티브 `@input`에서는 이벤트 객체(`$event.target.value`), 커스텀 `@update-query`에서는 emit으로 넘긴 값 자체입니다.
- IME 조합 중인 한글도 즉시 반영되도록 `v-model` 대신 `:value` + `@input`을 유지했습니다.

### 3. 날씨 카드 (객체 `Props` + 이벤트 3종)

카드는 도시 객체 하나를 받아 그리기만 하고, 무엇을 할지는 전부 부모가 결정합니다.

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

- `v-for`와 `:key`는 부모에 남기고, 카드는 자기 한 장만 책임집니다.
- `@select-card="clickCity"`처럼 **괄호 없이 함수 이름만** 쓰면 emit 인자가 그대로 전달됩니다.
- 카드 전체에 `@click`이 걸려 있어, 내부 버튼에는 `.stop`이 필수입니다. 컴포넌트로 분리해도 DOM 구조는 그대로라 버블링도 그대로 일어납니다.
- `window.alert`을 카드 안에서 직접 부르지 않고 부모에 모았습니다. 나중에 alert을 모달로 바꿔도 고칠 곳이 한 군데입니다.

### 4. 사이드 패널 — 계산까지 위임

`LifeIndexPanel`과 `RankingBoard`는 표시뿐 아니라 **자기가 쓸 계산까지 가져갔습니다.**

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

- 분리 기준은 "템플릿이 길어서"가 아니라 **"이 패널만 쓰는 계산이 부모에 얹혀 있는가"** 였습니다. 부모에서 `computed` 6개가 빠졌습니다.
- `<script setup>` 안에서 props를 쓰려면 `const props = defineProps(...)`처럼 변수로 받아야 합니다. 템플릿에서는 `city`, JS에서는 `props.city`입니다.
- 부모는 도시 **이름(문자열)** 대신 `selectedCityData`로 **객체**를 찾아서 넘깁니다. 자식이 `weatherList`의 존재를 몰라도 되고, 반복되던 `find`도 한 번으로 줄었습니다.
- `city`가 `null`일 수 있으므로 `v-if="city"`로 감쌌습니다. `computed`는 템플릿이 실제로 읽을 때만 평가되므로 `v-if`가 방패 역할을 합니다.
- `RankingBoard`의 `[...props.cities].sort(...)`에서 스프레드는 필수입니다. `sort()`는 원본을 바꾸기 때문에, 복사 없이 정렬하면 부모의 `weatherList` 순서까지 흐트러집니다.

### 5. 라우팅 · 지연 로딩

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

- `component`에 컴포넌트 대신 **"필요할 때 불러올 함수"**를 넘겨 라우트 단위로 번들을 분리했습니다. 빌드 결과에서 페이지별 `.js` / `.css` 청크가 각각 생성됩니다.
- 단, **정적 `import`가 한 군데라도 남아 있으면 코드 분할은 일어나지 않습니다.** `App.vue`가 `<RouterView />`를 쓰도록 바꾼 뒤에야 실제로 분리되었습니다.
- 네비게이션은 `App.vue`로 올려 모든 페이지에서 보이게 했습니다. 이때 색상 토큰이 `.weather-app` 안에 있으면 상속이 끊기므로, **토큰과 배경을 `main.css`의 `:root` / `body`로 이동**시켰습니다.
- `NavigationBar`는 `RouterLink`를 사용합니다. 현재 경로와 일치하면 `router-link-exact-active` 클래스가 자동으로 붙어, 활성 표시를 CSS만으로 처리했습니다. `to="/"`는 모든 경로의 접두사이므로 `router-link-active`가 아닌 **`exact-active`** 를 써야 합니다.

### 6. 상세 페이지 — 동적 라우트

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

- 동적 세그먼트 `:cityId`를 `route.params.cityId`로 읽어 스토어에서 도시 객체를 찾습니다.
- `path` 문자열 대신 **`name` + `params`**로 이동해, 경로 형식이 바뀌어도 호출부를 고치지 않아도 됩니다.
- 없는 `cityId`로 들어오면 안내 문구를 표시합니다.
- 처음에는 `onMounted`에서 `ref`에 담았는데, **API 응답이 나중에 도착하면 그 시점엔 목록이 비어 있어 아무것도 못 찾습니다.** `computed`로 바꾸니 데이터가 도착하는 순간 화면이 알아서 채워집니다.
- 상세 페이지에서도 `BaseDashboardCard`, `LifeIndexPanel`, `OutfitPanel`, `TravelSpotPanel`을 그대로 재사용했습니다. `:city="city"` 한 줄이면 패널이 붙습니다.

### 7. 데이터 흐름

날씨 데이터는 **`weatherStore` 한 곳**에만 있습니다. `App.vue`가 앱 시작 시 한 번 받아 두면, 모든 화면이 같은 배열을 봅니다.

```
App.vue (onMounted)
   └─ weatherStore.fetchWeatherList()   ← 18개 도시 1회 조회
        ├─ WeatherHomeView    검색 · 필터 · 랭킹
        ├─ WeatherDetailView  선택한 도시 1개
        ├─ TravelPickView     점수 계산
        └─ WeatherRainyView   비 오는 지역
```

- 처음에는 같은 배열이 네 뷰에 복사돼 있었습니다. 라우팅된 뷰끼리는 부모–자식이 아니라 **`RouterView`가 갈아 끼우는 형제 관계**라 props가 닿지 않기 때문입니다. 스토어로 올리면서 중복이 사라졌습니다.
- 반대로 컴포넌트는 전부 자식이므로 **데이터를 직접 import하는 컴포넌트는 하나도 없습니다.** 전부 props로 받습니다.

### 8. 키보드 단축키 (`키 수식어`)

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

- `@keyup.enter` / `@keyup.esc`는 `e.key`를 직접 비교하지 않아도 되는 **키 수식어**입니다.
- 단축키를 처리하는 쪽도 부모입니다. 자식은 `select-first`라는 **"엔터를 눌렀다"는 사실만** emit하고, 첫 번째 도시를 고르는 판단은 목록을 가진 부모가 합니다.
- `Esc`는 별도 이벤트를 만들지 않고 기존 `update-query`에 빈 문자열을 실어 보내 재사용했습니다.

### 9. 나만의 반응형 변수 — 더운 지역만 보기

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

- 조건을 `computed` 두 개로 나누지 않고 **하나의 `filter` 안에서 합쳤습니다.** 검색어와 온도 조건이 항상 함께 걸리기 때문입니다.
- `!onlyHot.value || ...` 형태로 써서, 토글이 꺼져 있으면 온도 조건 자체를 건너뜁니다.
- 토글은 `@click="onlyHot = !onlyHot"`, 켜진 표시는 `:class="{ 'hot-toggle--on': onlyHot }"`로 처리했습니다.

### 10. 직접 추가한 화면

**여행지 추천 (`/travel`)** — 원하는 날씨 조건을 버튼으로 고르면 점수가 다시 계산됩니다.

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

- 기준 3개(기온 · 강수량 · 습도)를 각각 2지선다 버튼으로 만들고, **삼항 연산자로 점수 방향만 뒤집었습니다.**
- 순위는 `computed` 안에서 `map` → `sort` → `slice(0, 5)`로 만듭니다. `ref`를 읽고 있으므로 버튼을 누르면 자동으로 다시 계산됩니다.
- 1위가 바뀔 때를 `watch(bestCity, ...)`로 감지해 콘솔에 남깁니다.

**비 소식 (`/rainy`)** — 강수량 기준을 골라 비 오는 지역만 모아 봅니다.

- `<option :value="0">`처럼 숫자를 바인딩하고 `v-model.number`로 받아, 강수량 비교가 문자열이 아닌 숫자로 이뤄지게 했습니다.
- 카드는 홈에서 쓰던 `WeatherCard`를 그대로 재사용하고, `@click-detail`만 연결해 상세 페이지로 보냅니다.

### 11. 옷차림 · 메뉴 추천 패널

`OutfitPanel`은 생활지수와 같은 방식으로, 받은 도시 하나만 보고 결과를 정합니다.

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

- 문자열 대신 **객체를 반환**해서 아이콘 · 이름 · 설명을 한 번에 넘겼습니다. 템플릿에서는 `{{ outfit.icon }}`처럼 꺼내 씁니다.
- `TravelSpotPanel`은 처음엔 하드코딩한 명소 목록에서 `find`로 찾았지만, 지금은 **관광정보 API 결과를 `:spots`로 받아 그리기만 합니다.** 조회는 `tourStore`가 맡습니다.
- 패널들은 홈 · 상세 · 여행지 추천 **여러 화면에서 그대로 재사용**됩니다.

### 12. 전역 상태 (`Pinia`)

화면이 바뀌어도 이어져야 하는 값은 스토어로 올렸습니다. 교안의 setup 스타일(`defineStore(이름, () => {...})`)로 작성했고, `ref`는 state, `computed`는 getters, 일반 함수는 actions가 됩니다.

```js
// stores/configStore.js
export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius') // state

  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '℉' : '℃')) // getters

  const toggleUnit = () => {
    // actions
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
```

| 스토어          | state                                      | getters                  | actions                                          |
| --------------- | ------------------------------------------ | ------------------------ | ------------------------------------------------ |
| `weatherStore`  | `weatherList`, `isLoading`, `errorMessage` | —                        | `fetchWeatherList`, `findCity`                   |
| `tourStore`     | `spotList`, `isLoading`, `errorMessage`    | —                        | `fetchSpots`                                     |
| `configStore`   | `unit`                                     | `unitSymbol`, `unitName` | `toggleUnit`                                     |
| `favoriteStore` | `favoriteIds`                              | `favoriteCount`          | `isFavorite`, `toggleFavorite`, `clearFavorites` |
| `historyStore`  | `historyIds`                               | `hasHistory`             | `addHistory`, `clearHistory`                     |

- 컴포넌트에서는 `const configStore = useConfigStore()`로 받아 `configStore.unit`처럼 **점 표기로 접근**했습니다. `const { unit } = configStore`처럼 구조 분해하면 반응형 연결이 끊어지고, 살리려면 `storeToRefs`가 필요합니다.
- `favoriteStore`와 `historyStore`는 **직접 추가한 스토어**입니다.
- 스토어가 화면 단위가 아니라 **의미 단위로 나뉘어 있습니다.** 서버에서 받아오는 것(`weatherStore` · `tourStore`)과 앱이 소유한 것(`configStore` · `favoriteStore` · `historyStore`)이 구분됩니다.
- 스토어는 부모가 props로 내려 줄 필요 없이 **필요한 컴포넌트가 직접 꺼내 씁니다.** `App.vue`, `WeatherCard`, `RankingBoard`, `UnitToggler`, 홈 · 상세 뷰에서 사용합니다.

### 13. 단위 변환 적용

```js
// WeatherCard.vue
const displayTemp = computed(() => {
  const rawTemp = props.city.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})
```

- 원본 데이터는 **항상 섭씨 숫자로 두고**, 화면에 그릴 때만 변환합니다. 판정 로직(`city.temp >= 25`)도 원본 기준이라 단위를 바꿔도 결과가 흔들리지 않습니다.
- 대신 라벨 숫자는 `hotStandard`로 25 ↔ 77을 바꿔, 화씨 화면에서 "90℉ / 더움(25도 이상)"처럼 어긋나지 않게 했습니다.
- **평균 대비 편차는 변환식을 그대로 쓰면 틀립니다.** `+32`가 두 번 들어가기 때문입니다. 평균도 화씨로 바꾼 뒤 빼서 `℃ 편차 × 1.8`이 되도록 했습니다.
- 같은 변환 코드가 카드 · 상세 · 랭킹에 반복됩니다. Composable로 묶을 수 있는 지점입니다. (범위 제외)

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

- 18개 도시를 순서대로 부르면 그만큼 기다려야 해서, **`Promise.all`로 한꺼번에** 보냅니다.
- 도시 지정은 좌표 대신 **`q=Seoul,KR` 형태의 도시명**을 씁니다. `,KR`을 붙이면 같은 이름의 해외 도시와 헷갈리지 않습니다.
- 응답을 그대로 쓰지 않고 `toCityItem()`으로 **화면이 쓰던 모양으로 변환**합니다. 덕분에 기존 컴포넌트를 거의 고치지 않고 목 데이터를 실제 데이터로 갈아 끼울 수 있었습니다.
- `weather[0].main`(`Clear` / `Rain` / `Snow` …)을 기존 이모지 상태로 매핑했습니다.
- `isLoading` · `errorMessage`를 스토어가 들고 있어, 어느 화면에서든 같은 로딩 · 에러 표시를 씁니다.

### 15. 추가 API — 예보 · 일출 · 관광지

**24시간 예보** (`/data/2.5/forecast`) — 상세 페이지에서 도시가 정해질 때 1회 호출하고, 3시간 간격 목록에서 앞 8개만 씁니다.

- 응답의 `dt_txt`는 **UTC 문자열**입니다. 그대로 잘라 쓰면 한국 시각보다 9시간 이르게 표시되므로, 유닉스 타임스탬프 `dt`를 `new Date(dt * 1000)`으로 변환했습니다.
- 뒤쪽 칸은 내일 시간대라 헷갈리기 쉬워서 시각 위에 오늘 / 내일 라벨을 붙였습니다.
- 아이콘은 `weather[0].icon` 코드를 `https://openweathermap.org/img/wn/{code}@2x.png`에 끼워 넣습니다. 키가 필요 없는 정적 이미지라 호출 수에 잡히지 않습니다.

**일출 · 일몰** — 별도 API 없이 현재 날씨 응답의 `sys.sunrise` / `sys.sunset`을 씁니다. 역시 유닉스 타임스탬프라 같은 방식으로 변환합니다.

**주변 관광지** (한국관광공사 `locationBasedList2`) — 좌표를 따로 준비하지 않고, 날씨 응답의 `coord.lat` / `coord.lon`을 그대로 넘깁니다.

```js
// stores/tourStore.js
params: {
  serviceKey: API_KEY,
  mapX: city.lon, mapY: city.lat, radius: 20000,
  contentTypeId: 12,  // 관광지
  arrange: 'E',       // 거리순
  numOfRows: 5, pageNo: 1,
  MobileOS: 'ETC', MobileApp: 'SkalaWeather', _type: 'json',
}
```

- 인터넷 예제에 많은 `KorService1`은 **폐기**되었습니다. `KorService2` + `locationBasedList2`를 써야 합니다.
- `arrange`를 `Q`(수정일순)로 두면 서울에서 외곽 산이 먼저 나옵니다. **`E`(거리순)** 로 바꾸니 덕수궁 · 청계광장 같은 도심 명소가 나옵니다.
- 하드코딩해 두었던 관광지 목록을 지우고 이 응답(`title` · `addr1` · `firstimage` · `dist`)으로 교체했습니다.
- 공공데이터포털 API는 **CORS가 열려 있지 않아** 브라우저에서 직접 못 부릅니다. `vite.config.js`에 개발용 프록시를 두고 `/tour-api`로 우회합니다.

```js
server: {
  proxy: {
    '/tour-api': {
      target: 'https://apis.data.go.kr',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/tour-api/, ''),
    },
  },
},
```

- 이 프록시는 `npm run dev`에서만 동작합니다. 배포 시에는 별도 대응이 필요합니다.

### 16. 즐겨찾기 · 방문 기록

```js
// stores/historyStore.js
const addHistory = (cityId) => {
  const rest = historyIds.value.filter((id) => id !== cityId)

  historyIds.value = [cityId, ...rest].slice(0, 5)
}
```

- 이미 있는 id를 걸러낸 뒤 맨 앞에 붙이고 `slice(0, 5)`로 잘라, **중복 없이 최신 5개**만 남깁니다.
- 기록은 상세 페이지 `onMounted`에서 남기고, 메인은 `v-if="historyStore.hasHistory"`로 기록이 있을 때만 카드를 띄웁니다.
- 즐겨찾기 별은 카드 클릭과 겹치므로 `@click.stop`이 필요합니다. 필터는 기존 검색 · 온도 조건에 `matchFavorite` 한 줄을 더해 처리했습니다.
- 두 스토어 모두 새로고침하면 초기화됩니다. 교안의 `authStore`처럼 `localStorage`를 붙이면 유지할 수 있습니다.

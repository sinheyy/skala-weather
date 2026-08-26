# Hands on - Weather Mockup

- **과목명** : Front-framework: Vue.js
- **실습과제** : Hands on - Weather Mockup
- **프로젝트명** : skala-weather

한 파일(`App.vue`)에 몰려 있던 날씨 목업을 **재사용 가능한 컴포넌트로 분리**하고,
**Vue Router**로 여러 페이지를 가진 애플리케이션으로 확장했습니다.
Slot으로 공통 패널 디자인을 하나로 묶고, Props / Emits로 부모–자식 간 데이터 흐름을 정리했습니다.

---

## 실행 방법

```sh
npm install
npm run dev
```

빌드 확인은 `npm run build`, 린트는 `npm run lint`로 수행합니다.

## 프로젝트 구조

```
src/
├─ App.vue                  레이아웃 셸 (네비게이션 + RouterView)
├─ router/index.js          라우트 정의 · 지연 로딩
├─ data/weatherData.js      Mock Data (전국 18개 지역)
├─ views/
│  ├─ WeatherHomeView.vue   메인 대시보드 (상태 소유)
│  ├─ WeatherDetailView.vue 도시 상세 페이지
│  ├─ WeatherAboutView.vue  서비스 소개
│  └─ NotFoundView.vue      404
├─ components/exercise/
│  ├─ BaseDashboardCard.vue 공통 패널 (slot)
│  ├─ NavigationBar.vue     상단 네비게이션
│  ├─ SearchBar.vue         도시 검색 입력
│  ├─ WeatherCard.vue       도시 카드 1장
│  ├─ LifeIndexPanel.vue    생활지수
│  └─ RankingBoard.vue      전국 랭킹
└─ assets/main.css          테마 토큰 · 배경 (전역)
```

## 페이지 구성

| 경로               | 이름       | 화면                                                      |
| ------------------ | ---------- | --------------------------------------------------------- |
| `/`                | `home`     | 메인 대시보드 — 검색 / 지역별 카드 / 생활지수 / 전국 랭킹 |
| `/detail/:cityId`  | `detail`   | 선택한 도시의 상세 기상 정보                              |
| `/about`           | `about`    | 서비스 소개                                               |
| `/:pathMatch(.*)*` | `NotFound` | 존재하지 않는 경로                                        |

```
App.vue (셸)
├─ NavigationBar          HOME / ABOUT — 모든 페이지 공통
└─ RouterView
   └─ WeatherHomeView
      ├─ [도시 검색]        SearchBar
      ├─ [지역별 날씨 현황]  WeatherCard × 18 (반응형 그리드)
      ├─ [생활지수]         LifeIndexPanel
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
    path: '/detail/:cityId',
    name: 'detail',
    component: () => import('@/views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
```

- `component`에 컴포넌트 대신 **"필요할 때 불러올 함수"**를 넘겨 라우트 단위로 번들을 분리했습니다. 빌드 결과에서 페이지별 `.js` / `.css` 청크가 각각 생성됩니다.
- 단, **정적 `import`가 한 군데라도 남아 있으면 코드 분할은 일어나지 않습니다.** `App.vue`가 `<RouterView />`를 쓰도록 바꾼 뒤에야 실제로 분리되었습니다.
- 네비게이션은 `App.vue`로 올려 모든 페이지에서 보이게 했습니다. 이때 테마 토큰이 `.weather-app` 안에 있으면 상속이 끊기므로, **토큰과 배경을 `main.css`의 `:root` / `body`로 이동**시켰습니다.
- `NavigationBar`는 `RouterLink`를 사용합니다. 현재 경로와 일치하면 `router-link-exact-active` 클래스가 자동으로 붙어, 활성 표시를 CSS만으로 처리했습니다. `to="/"`는 모든 경로의 접두사이므로 `router-link-active`가 아닌 **`exact-active`** 를 써야 합니다.

### 6. 상세 페이지 — 동적 라우트 + Mount 시점 조회

```js
// WeatherDetailView.vue
const route = useRoute()
const city = ref(null)

onMounted(() => {
  city.value = weatherList.find((item) => item.id === route.params.cityId) ?? null
})
```

```js
// WeatherHomeView.vue — 카드의 상세보기에서 이동
const showDetail = (cityId) => {
  router.push({ name: 'detail', params: { cityId } })
}
```

- 동적 세그먼트 `:cityId`를 `route.params.cityId`로 읽어 Mock Data에서 도시 객체를 찾습니다.
- `path` 문자열 대신 **`name` + `params`**로 이동해, 경로 형식이 바뀌어도 호출부를 고치지 않아도 됩니다.
- 없는 `cityId`로 들어오면 안내 문구를 표시합니다.
- `onMounted`는 마운트될 때 한 번만 실행됩니다. 상세 → 상세로 이동하면 컴포넌트가 재사용되어 갱신되지 않으므로, 그런 경로를 추가한다면 `watch(() => route.params.cityId, ...)`가 필요합니다.
- 상세 페이지에서도 `BaseDashboardCard`와 `LifeIndexPanel`을 그대로 재사용했습니다. `:city="city"` 한 줄이면 생활지수가 붙습니다.

### 7. 데이터 공유 모듈

상세 페이지가 같은 데이터를 써야 해서, 뷰 안에 있던 배열을 `src/data/weatherData.js`로 분리했습니다.

```js
export const weatherList = [
  /* 전국 18개 지역 */
]
export const weatherRecommend = [
  /* 날씨별 조언 */
]
```

- 홈에서는 `const weatherList = ref(weatherData)`로 받아 반응형으로 사용하고, 상세 페이지에서는 조회만 하므로 배열 그대로 씁니다.

---

## 컴포넌트 인터페이스

| 컴포넌트            | Props     | Emits                                           |
| ------------------- | --------- | ----------------------------------------------- |
| `BaseDashboardCard` | `title`   | — (기본 slot)                                   |
| `SearchBar`         | `keyword` | `update-query`                                  |
| `WeatherCard`       | `city`    | `select-card`, `click-detail`, `show-recommend` |
| `LifeIndexPanel`    | `city`    | —                                               |
| `RankingBoard`      | `cities`  | —                                               |
| `NavigationBar`     | —         | —                                               |

상태(`keyword`, `selectedCity`, `weatherList`)와 `window.alert` 처리는 모두 `WeatherHomeView`가 소유하고, 자식들은 표시와 이벤트 전달만 담당합니다.

## 학습 정리

| 개념           | 내용                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------- |
| `slot`         | 껍데기와 내용을 분리. 슬롯 내용은 **부모 스코프**로 컴파일되므로 scoped 스타일도 부모에 둔다  |
| `props`        | 읽기 전용. 자식에서 직접 수정 불가. `<script>`에서 쓰려면 `const props = defineProps(...)`    |
| `emits`        | 자식은 "무슨 일이 있었다"만 알리고, 실제 처리는 부모가 결정                                   |
| `v-model` 규약 | `modelValue` / `update:modelValue` 이름을 지키면 `v-model` 사용 가능. 다른 이름이면 수동 연결 |
| `.stop`        | 컴포넌트로 분리해도 DOM 버블링은 그대로. 중첩 클릭 핸들러에 필수                              |
| 지연 로딩      | `component: () => import(...)`. 정적 import가 하나라도 남으면 분할되지 않음                   |
| `RouterLink`   | `router-link-active`는 접두사 일치, `router-link-exact-active`는 완전 일치                    |
| 동적 라우트    | `:cityId` → `route.params.cityId`. 이동은 `name` + `params` 조합이 안전                       |
| CSS 변수       | DOM을 타고 상속되므로, 여러 페이지가 공유하려면 `:root`에 선언해야 한다                       |

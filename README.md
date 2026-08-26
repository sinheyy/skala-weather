# Hands on - Weather Mockup

- **과목명** : Front-framework: Vue.js
- **실습과제** : Hands on - Weather Mockup
- **프로젝트명** : skala-weather

Vue 3 `<script setup>` + Vite 환경에서 날씨 목업 화면을 구현했습니다.
배열 렌더링(`v-for`), 조건부 렌더링(`v-if` / `v-else`), 한글 입력을 고려한 양방향 바인딩(`:value` + `@input`),
이벤트 수식어(`@click.stop`)를 모두 단일 컴포넌트(`src/App.vue`)에 적용했습니다.

---

## 실행 방법

```sh
npm install
npm run dev
```

빌드 확인은 `npm run build`, 린트는 `npm run lint`로 수행합니다.

## 주요 파일

| 경로 | 설명 |
| --- | --- |
| `src/App.vue` | 과제 구현 전체 (스크립트 / 템플릿 / 스코프 스타일) |
| `src/assets/base.css` | 색상 변수 · 리셋 등 전역 기본 스타일 |
| `src/assets/main.css` | `base.css` import (스캐폴드 기본 레이아웃은 제거) |

---

## 화면 구성

```
날씨 (헤더)
├─ [도시 검색]        input + "검색 중인 도시: {keyword}"
└─ [지역별 날씨 현황]  날씨 카드 8개 (반응형 그리드)
   └─ 카드: 도시명 / 날씨 배지 / 현재 기온 / 기온 라벨 / 강수량 · 습도 / 상세보기 버튼

[상태바] 화면 하단 고정 — 선택한 도시 표시
```

---

## 요구사항별 구현 내용

### 1. 배열 렌더링 (`v-for`)

`weatherList` 배열을 `v-for`로 순회해 도시별 카드를 반복 출력하고, `:key`에 각 항목의 고유 `id`를 바인딩했습니다.

```html
<article
  class="city-card"
  v-for="item in weatherList"
  :key="item.id"
  @click="clickCity(item.name)"
>
```

- 배열을 순회할 때는 `(item, index)` 형태를 사용합니다. (`(value, key, index)`는 객체 순회용)
- `:key`는 표현식으로 평가되므로 `item.id`처럼 `v-for` 변수를 거쳐 접근해야 합니다.
- `index`가 아닌 고유 `id`를 key로 사용해, 정렬이나 필터링으로 순서가 바뀌어도 Vue가 DOM을 올바르게 재사용하도록 했습니다.

### 2. 조건부 렌더링 (`v-if` / `v-else`)

기온 25도를 기준으로 라벨을 분기했습니다.

```html
<div class="temp-badge temp-badge--hot" v-if="item.temp >= 25">🔥 더움 (25도 이상)</div>
<div class="temp-badge temp-badge--cool" v-else>❄️ 선선함 (25도 미만)</div>
```

- `v-if` / `v-else`는 조건에 따라 DOM에 요소를 **생성/제거**합니다.
- 두 분기에 서로 다른 클래스(`--hot` / `--cool`)를 주어 주황 · 파랑 배지로 시각적으로도 구분했습니다.
- 데이터에 24℃인 도시(강원)를 포함해 `v-else` 분기도 화면에서 확인할 수 있게 했습니다.

### 3. 양방향 바인딩 및 한글 처리 (`:value`, `@input`)

`v-model` 대신 `:value` + `@input` 조합으로 직접 구현했습니다.

```html
<input
  class="search-input"
  type="text"
  :value="keyword"
  @input="(e) => (keyword = e.target.value)"
  placeholder="검색할 도시 이름 입력"
/>

<p class="search-status">
  검색 중인 도시: <span class="search-keyword">{{ keyword }}</span>
</p>
```

- `v-model`은 한글처럼 IME 조합이 필요한 입력에서 조합 중인 글자를 반영하지 않습니다.
- `:value`(단방향 출력) + `@input`(입력 이벤트 수신)으로 분리하면 조합 중인 한글도 즉시 화면에 출력됩니다.

### 4. 이벤트 및 수식어

| 대상 | 동작 | 코드 |
| --- | --- | --- |
| 날씨 카드 | 화면 하단 **상태바**에 `{도시}이(가) 선택되었습니다.` 표기 | `@click="clickCity(item.name)"` |
| 상세보기 버튼 | 해당 도시의 날씨를 `window.alert`로 표시 (버블링 차단) | `@click.stop="showDetail(item.name, item.status)"` |
| 날씨 배지 | 날씨별 추천 문구를 표시 (버블링 차단) | `@click.stop="showRecommend(item.status)"` |

```js
const selected = ref('')

const clickCity = (cityName) => {
  selected.value = `${cityName}이(가) 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 입니다.`)
}
```

```html
<p class="status-bar" :class="{ 'status-bar--empty': !selected }">
  <span class="status-bar__dot" aria-hidden="true"></span>
  {{ selected || '카드를 클릭하면 선택한 도시가 여기에 표시됩니다.' }}
</p>
```

- 카드 선택은 `alert` 대신 반응형 상태(`selected`)를 갱신하고, 화면 하단 고정 상태바가 그 값을 그대로 렌더링합니다. 팝업을 닫지 않아도 도시를 연속으로 클릭할 수 있습니다.
- 아직 선택 전이면 `:class` 객체 문법으로 `status-bar--empty` 클래스를 붙여 안내 문구를 흐리게 표시합니다.
- 카드 내부 버튼은 부모 카드에도 `@click`이 걸려 있어, `.stop` 수식어가 없으면 이벤트가 부모로 전파되어 알림이 두 번 뜹니다.
- `.stop`은 `event.stopPropagation()`을 대신하는 이벤트 수식어로, 핸들러 안에서 DOM API를 직접 호출하지 않아도 되게 해줍니다.

### 5. 본인 데이터 추가 및 Mockup

**(1) 데이터 확장** — 기본 필드(`id` / `name` / `temp` / `status`)에 **습도(`humidity`)** 와 **강수량(`precipitation`)** 을 추가하고, 도시를 8개로 늘렸습니다.

```js
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 32, humidity: 50, precipitation: 0, status: '☀️맑음' },
  { id: 'city_02', name: '경기', temp: 30, humidity: 58, precipitation: 0, status: '☀️맑음' },
  { id: 'city_03', name: '대전', temp: 28, humidity: 60, precipitation: 0, status: '🌥️구름' },
  { id: 'city_04', name: '부산', temp: 26, humidity: 70, precipitation: 60, status: '🌧️비' },
  { id: 'city_05', name: '제주', temp: 31, humidity: 45, precipitation: 0, status: '☀️맑음' },
  { id: 'city_06', name: '인천', temp: 27, humidity: 65, precipitation: 10, status: '🌧️비' },
  { id: 'city_07', name: '광주', temp: 33, humidity: 48, precipitation: 0, status: '☀️맑음' },
  { id: 'city_08', name: '강원', temp: 24, humidity: 55, precipitation: 0, status: '🌥️구름' },
])
```

**(2) 날씨별 추천 이벤트 (추가 구현)** — 날씨 상태에 따라 다른 안내를 띄우는 이벤트를 추가했습니다.

```js
// 고정 데이터라 반응형(ref)일 필요가 없어서 일반 배열로 둠
const weatherRecommend = [
  { status: '☀️맑음', recommend: '햇볕이 강해요. 물을 많이 마시세요!' },
  { status: '🌥️구름', recommend: '날이 흐립니다. 외투를 챙기세요!' },
  { status: '🌧️비', recommend: '비가 와요. 우산을 챙기세요!' },
]

const showRecommend = (status) => {
  const found = weatherRecommend.find((item) => item.status === status)
  window.alert(found ? found.recommend : '추천 정보가 없는 날씨예요.')
}
```

- `Array.prototype.find`로 상태가 일치하는 첫 항목을 찾고, 없으면 `undefined`가 반환되므로 삼항 연산자로 폴백 문구를 처리해 런타임 에러를 방지했습니다.
- 값이 변하지 않는 상수 데이터이므로 `ref`로 감싸지 않았습니다. (반응형이 필요한 `keyword`, `weatherList`와 구분)
- 날씨 배지를 `<span>` 대신 `<button type="button">`으로 구현해 키보드 접근이 가능하도록 했습니다.

**(3) Mockup 스타일링** — `<style scoped>`로 날씨 앱 콘셉트의 UI를 구성했습니다.

- **하늘 배경** : `linear-gradient` + `radial-gradient`를 겹친 그라데이션에 `background-attachment: fixed`를 적용해 스크롤과 무관하게 하늘이 화면을 채우도록 했습니다.
- **글래스모피즘 패널** : 반투명 배경 + `backdrop-filter: blur(10px)`로 두 영역(도시 검색 / 지역별 날씨 현황)을 카드형 패널로 구분했습니다.
- **반응형 카드 그리드** : `grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))`를 사용해 미디어 쿼리 없이 화면 너비에 따라 열 개수가 자동 조절됩니다.
- **다크 모드** : CSS 변수로 색상을 토큰화하고 `@media (prefers-color-scheme: dark)`에서 값만 교체해 라이트/다크 양쪽을 지원합니다.
- **인터랙션** : 카드 `hover` 시 살짝 떠오르는 효과, 검색 영역 `:focus-within` 포커스 링 등으로 클릭 가능한 요소를 시각적으로 안내합니다.

---

## 학습 정리

| 개념 | 내용 |
| --- | --- |
| `v-for` | 배열은 `(item, index)`, 객체는 `(value, key, index)`. `:key`에는 index가 아닌 고유 id |
| `v-if` / `v-else` | 조건에 따라 DOM 요소를 생성 · 제거 (`v-show`는 `display` 토글) |
| `ref` | 변경 시 화면 갱신이 필요한 값에만 사용. 상수 데이터는 일반 변수로 |
| `:value` + `@input` | `v-model`과 달리 한글 IME 조합 중인 입력도 실시간 반영 |
| `.stop` | 이벤트 버블링 차단. 중첩된 클릭 핸들러의 중복 실행 방지 |

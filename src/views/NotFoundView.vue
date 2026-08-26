<template>
  <div class="notfound-page">
    <p class="notfound-code">404</p>

    <h1 class="notfound-title">페이지를 찾을 수 없습니다</h1>

    <p class="notfound-desc">
      주소가 잘못되었거나 삭제된 페이지예요.<br />
      입력하신 주소를 다시 확인해 주세요.
    </p>

    <RouterLink class="home-btn" to="/">홈으로 가기</RouterLink>
  </div>
</template>

<style scoped>
.notfound-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: clamp(48px, 12vh, 110px) 24px;
  text-align: center;
}

.notfound-code {
  font-size: clamp(4rem, 16vw, 7rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: var(--accent);
  opacity: 0.55;
}

.notfound-title {
  font-size: clamp(1.3rem, 4vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-strong);
}

.notfound-desc {
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--text-soft);
}

.home-btn {
  margin-top: 12px;
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

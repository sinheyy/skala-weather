<template>
  <nav class="nav-bar">
    <RouterLink class="nav-link" to="/">HOME</RouterLink>
    <RouterLink class="nav-link" to="/rainy">RAINY</RouterLink>
    <RouterLink class="nav-link" to="/travel">TRAVEL</RouterLink>
    <RouterLink class="nav-link" to="/about">ABOUT</RouterLink>
  </nav>
</template>

<style scoped>
.nav-bar {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--divider);
}

.nav-link {
  position: relative;
  padding: 2px 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-decoration: none;
  color: var(--text-soft);
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.nav-link:hover {
  color: var(--text-strong);
}

.nav-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.nav-link.router-link-exact-active {
  color: var(--text-strong);
}

.nav-link.router-link-exact-active::after {
  opacity: 1;
}
</style>

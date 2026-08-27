import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '℉' : '℃'))

  const unitName = computed(() => (unit.value === 'fahrenheit' ? '화씨' : '섭씨'))

  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  const theme = ref('light')

  const isDark = computed(() => theme.value === 'dark')

  const themeIcon = computed(() => (isDark.value ? '🌙' : '☀️'))

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { unit, unitSymbol, unitName, toggleUnit, theme, isDark, themeIcon, toggleTheme }
})

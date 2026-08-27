import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const historyIds = ref([])

  const hasHistory = computed(() => historyIds.value.length > 0)

  const addHistory = (cityId) => {
    const rest = historyIds.value.filter((id) => id !== cityId)

    historyIds.value = [cityId, ...rest].slice(0, 5)
  }

  const clearHistory = () => {
    historyIds.value = []
  }

  return { historyIds, hasHistory, addHistory, clearHistory }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteIds = ref([])

  const favoriteCount = computed(() => favoriteIds.value.length)

  const isFavorite = (cityId) => favoriteIds.value.includes(cityId)

  const toggleFavorite = (cityId) => {
    if (isFavorite(cityId)) {
      favoriteIds.value = favoriteIds.value.filter((id) => id !== cityId)
    } else {
      favoriteIds.value.push(cityId)
    }
  }

  const clearFavorites = () => {
    favoriteIds.value = []
  }

  return { favoriteIds, favoriteCount, isFavorite, toggleFavorite, clearFavorites }
})

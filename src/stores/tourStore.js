import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_TOUR_API_KEY
const TOUR_URL = '/tour-api/B551011/KorService2/locationBasedList2'

const toSpotItem = (item) => ({
  id: item.contentid,
  title: item.title,
  address: item.addr1,
  image: item.firstimage,
  distance: (item.dist / 1000).toFixed(1),
})

export const useTourStore = defineStore('tour', () => {
  const spotList = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchSpots = async (city) => {
    spotList.value = []
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await axios.get(TOUR_URL, {
        params: {
          serviceKey: API_KEY,
          mapX: city.lon,
          mapY: city.lat,
          radius: 20000,
          contentTypeId: 12,
          arrange: 'E',
          numOfRows: 5,
          pageNo: 1,
          MobileOS: 'ETC',
          MobileApp: 'SkalaWeather',
          _type: 'json',
        },
      })

      const body = response.data.response.body

      if (body.totalCount === 0) {
        return
      }

      spotList.value = body.items.item.map(toSpotItem)
    } catch (error) {
      console.error('관광 정보를 가져오지 못했습니다:', error)
      errorMessage.value = '관광 정보를 불러오지 못했어요.'
    } finally {
      isLoading.value = false
    }
  }

  return { spotList, isLoading, errorMessage, fetchSpots }
})

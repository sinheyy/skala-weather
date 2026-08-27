import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather'

const regionList = [
  { id: 'city_01', name: '서울', query: 'Seoul,KR' },
  { id: 'city_02', name: '인천', query: 'Incheon,KR' },
  { id: 'city_03', name: '수원', query: 'Suwon,KR' },
  { id: 'city_04', name: '춘천', query: 'Chuncheon,KR' },
  { id: 'city_05', name: '강릉', query: 'Gangneung,KR' },
  { id: 'city_06', name: '대전', query: 'Daejeon,KR' },
  { id: 'city_07', name: '청주', query: 'Cheongju,KR' },
  { id: 'city_08', name: '천안', query: 'Cheonan,KR' },
  { id: 'city_09', name: '전주', query: 'Jeonju,KR' },
  { id: 'city_10', name: '광주', query: 'Gwangju,KR' },
  { id: 'city_11', name: '여수', query: 'Yeosu,KR' },
  { id: 'city_12', name: '대구', query: 'Daegu,KR' },
  { id: 'city_13', name: '안동', query: 'Andong,KR' },
  { id: 'city_14', name: '포항', query: 'Pohang,KR' },
  { id: 'city_15', name: '울산', query: 'Ulsan,KR' },
  { id: 'city_16', name: '부산', query: 'Busan,KR' },
  { id: 'city_17', name: '창원', query: 'Changwon,KR' },
  { id: 'city_18', name: '제주', query: 'Jeju,KR' },
]

const toStatus = (weatherMain) => {
  if (weatherMain === 'Clear') {
    return '☀️맑음'
  }

  if (weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm') {
    return '🌧️비'
  }

  if (weatherMain === 'Snow') {
    return '❄️눈'
  }

  return '🌥️구름'
}

const toCityItem = (region, data) => ({
  id: region.id,
  name: region.name,
  query: region.query,
  lat: data.coord.lat,
  lon: data.coord.lon,
  temp: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  pressure: data.main.pressure,
  humidity: data.main.humidity,
  precipitation: data.rain ? Math.round(data.rain['1h'] ?? 0) : 0,
  windSpeed: data.wind.speed,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  status: toStatus(data.weather[0].main),
  description: data.weather[0].description,
  icon: data.weather[0].icon,
})

export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const findCity = (cityId) => weatherList.value.find((item) => item.id === cityId) ?? null

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

  return { weatherList, isLoading, errorMessage, findCity, fetchWeatherList }
})

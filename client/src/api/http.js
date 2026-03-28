import axios from 'axios'

const defaultApiBaseUrl = import.meta.env.DEV
  ? '/api'
  : 'https://placemate-26ej.onrender.com/api'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('pmAccessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default http

import { useEffect, useState } from 'react'
import http from '../api/http'

export function usePageNotificationCount(endpoint, options = {}) {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { 
    interval = 12000, // Default 12 second interval for faster updates
    enabled = true,
    searchParams = undefined 
  } = options

  useEffect(() => {
    if (!enabled) return

    let isMounted = true

    const fetchCount = async () => {
      try {
        const response = await http.get(endpoint, {
          params: searchParams,
          headers: { 'Cache-Control': 'no-cache' },
        })
        const data = Array.isArray(response.data?.data) ? response.data.data : []
        
        if (isMounted) {
          setCount(data.length)
          setIsLoading(false)
        }
      } catch (error) {
        // Silently fail for count fetching
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchCount()

    const intervalId = window.setInterval(() => {
      void fetchCount()
    }, interval)

    const handleFocus = () => {
      void fetchCount()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [endpoint, interval, enabled, searchParams])

  return { count, isLoading }
}

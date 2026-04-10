import { useEffect, useState } from 'react'
import http from '../api/http'

// Helper to get record timestamp
function getRecordTimestamp(record) {
  const rawValue = record?.updatedAt || record?.createdAt
  const parsed = rawValue ? new Date(rawValue).getTime() : Number.NaN
  return Number.isFinite(parsed) ? parsed : 0
}

// Load notification state from session storage
function loadNotificationState() {
  try {
    const raw = sessionStorage.getItem('pmPageNotificationState')
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

// Save notification state to session storage
function saveNotificationState(nextState) {
  sessionStorage.setItem('pmPageNotificationState', JSON.stringify(nextState))
}

export function usePageNotificationCount(endpoint, options = {}) {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { 
    interval = 12000,
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

        // Get previous state to calculate new items
        const previousState = loadNotificationState()
        const previousTimestamp = Number(previousState[endpoint] || 0)

        let newCount = 0
        if (previousTimestamp > 0) {
          // Count only items newer than last known timestamp
          newCount = data.filter((record) => getRecordTimestamp(record) > previousTimestamp).length
        }

        // Update the timestamp for next comparison
        const latestTimestamp = data.reduce(
          (maxTimestamp, record) => Math.max(maxTimestamp, getRecordTimestamp(record)),
          0,
        )

        if (latestTimestamp > 0) {
          const nextState = { ...previousState }
          nextState[endpoint] = latestTimestamp
          saveNotificationState(nextState)
        }

        if (isMounted) {
          setCount(newCount)
          setIsLoading(false)
        }
      } catch (error) {
        // Silently fail
        if (isMounted) {
          setIsLoading(false)
          setCount(0)
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

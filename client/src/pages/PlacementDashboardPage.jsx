import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import http from '../api/http'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function PlacementDashboardPage() {
  const [placementRecords, setPlacementRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPlacements = async ({ showLoader = false, silent = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    let lastError = null

    try {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await http.get('/v1/placements', {
            headers: { 'Cache-Control': 'no-cache' },
          })
          setPlacementRecords(response.data?.data || [])
          lastError = null
          break
        } catch (error) {
          lastError = error

          if (attempt === 0) {
            await sleep(1000)
          }
        }
      }

      if (lastError && !silent) {
        toast.error(lastError?.response?.data?.message || 'Unable to fetch placement records.')
      }
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    void fetchPlacements({ showLoader: true })

    const handleFocus = () => {
      void fetchPlacements({ silent: true })
    }

    const intervalId = window.setInterval(() => {
      void fetchPlacements({ silent: true })
    }, 15000)

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Placement Information Dashboard</h1>
        <p className="text-sm text-slate-500">Admin-managed company details and selection insights.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Package</th>
              <th className="px-4 py-3 font-semibold">Eligibility</th>
              <th className="px-4 py-3 font-semibold">Process</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  Loading placement records...
                </td>
              </tr>
            ) : placementRecords.length === 0 ? (
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  No placement records available.
                </td>
              </tr>
            ) : (
              placementRecords.map((record) => (
                <tr key={record._id || record.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{record.company}</td>
                  <td className="px-4 py-3">{record.role}</td>
                  <td className="px-4 py-3">{record.package}</td>
                  <td className="px-4 py-3">{record.eligibility}</td>
                  <td className="px-4 py-3">{record.process}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </section>
  )
}

export default PlacementDashboardPage

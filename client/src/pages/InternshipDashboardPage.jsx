import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import http from '../api/http'
import { usePageNotificationCount } from '../hooks/usePageNotificationCount'

function InternshipDashboardPage() {
  const [internshipRecords, setInternshipRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { count: internshipCount } = usePageNotificationCount('/v1/internships', { 
    interval: 15000,
  })

  const fetchInternships = async ({ showLoader = false, silent = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    try {
      const response = await http.get('/v1/internships', {
        headers: { 'Cache-Control': 'no-cache' },
      })
      setInternshipRecords(response.data?.data || [])
    } catch (error) {
      if (error?.response?.status === 404) {
        setInternshipRecords([])
      } else if (!silent) {
        toast.error(error?.response?.data?.message || 'Unable to fetch internship records.')
      }
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    void fetchInternships({ showLoader: true })

    const handleFocus = () => {
      void fetchInternships({ silent: true })
    }

    const intervalId = window.setInterval(() => {
      void fetchInternships({ silent: true })
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
        <h1 className="text-2xl font-bold text-slate-900">
          Internship Information Dashboard
          {internshipCount > 0 && (
            <span className="ml-2 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-lg font-semibold text-indigo-700">
              {internshipCount}
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-500">Admin-managed internship details and selection insights.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Package / Stipend</th>
              <th className="px-4 py-3 font-semibold">Eligibility</th>
              <th className="px-4 py-3 font-semibold">Process</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  Loading internship records...
                </td>
              </tr>
            ) : internshipRecords.length === 0 ? (
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  No internship records available.
                </td>
              </tr>
            ) : (
              internshipRecords.map((record) => (
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

export default InternshipDashboardPage

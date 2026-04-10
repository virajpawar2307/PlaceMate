import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import http from '../../api/http'

const STUDENT_NOTIFICATION_STATE_KEY = 'pmStudentNotificationState'

const studentNotificationSources = [
  { key: 'placements', label: 'placement updates', path: '/v1/placements' },
  { key: 'internships', label: 'internship updates', path: '/v1/internships' },
  { key: 'faq', label: 'FAQ updates', path: '/v1/faq' },
  { key: 'discussion', label: 'discussion updates', path: '/v1/discussion' },
  { key: 'resumes', label: 'resume library updates', path: '/v1/resumes' },
]

function getRecordTimestamp(record) {
  const rawValue = record?.updatedAt || record?.createdAt
  const parsed = rawValue ? new Date(rawValue).getTime() : Number.NaN
  return Number.isFinite(parsed) ? parsed : 0
}

function loadNotificationState() {
  try {
    const raw = sessionStorage.getItem(STUDENT_NOTIFICATION_STATE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveNotificationState(nextState) {
  sessionStorage.setItem(STUDENT_NOTIFICATION_STATE_KEY, JSON.stringify(nextState))
}

function createNotificationItem(message) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    message,
    timestamp: new Date().toISOString(),
  }
}

function Navbar() {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [newItemCounts, setNewItemCounts] = useState({
    discussion: 0,
    faq: 0,
    resumes: 0,
    placements: 0,
    internships: 0,
  })
  const isAuthenticated = sessionStorage.getItem('pmAuth') === 'true'
  const role = sessionStorage.getItem('pmRole') || 'student'
  const isStudent = isAuthenticated && role === 'student'
  let currentUser = null
  try {
    currentUser = JSON.parse(sessionStorage.getItem('pmCurrentUser') || 'null')
  } catch {
    currentUser = null
  }
  const userName = String(currentUser?.name || 'User')
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('') || 'U'

  const handleLogout = async () => {
    try {
      await http.post('/v1/auth/logout')
    } catch {
      // Ignore logout API failures and clear client state anyway.
    }

    sessionStorage.removeItem('pmAuth')
    sessionStorage.removeItem('pmRole')
    sessionStorage.removeItem('pmCurrentUser')
    sessionStorage.removeItem('pmAccessToken')
    sessionStorage.removeItem(STUDENT_NOTIFICATION_STATE_KEY)
    setIsProfileOpen(false)
    setIsNotificationOpen(false)
    navigate('/login')
  }

  useEffect(() => {
    if (!isStudent) {
      return undefined
    }

    let isMounted = true

    const fetchNewItemCounts = async (silent = true) => {
      const previousState = loadNotificationState()
      const newCounts = { ...newItemCounts }

      // Fetch and count new items for each section
      try {
        const sources = [
          { key: 'discussion', path: '/v1/discussion', countKey: 'discussion' },
          { key: 'faq', path: '/v1/faq', countKey: 'faq' },
          { key: 'resumes', path: '/v1/resumes', countKey: 'resumes' },
          { key: 'placements', path: '/v1/placements', countKey: 'placements' },
          { key: 'internships', path: '/v1/internships', countKey: 'internships' },
        ]

        await Promise.all(
          sources.map(async (source) => {
            try {
              const response = await http.get(source.path, {
                headers: { 'Cache-Control': 'no-cache' },
              })
              const records = Array.isArray(response.data?.data) ? response.data.data : []
              const latestTimestamp = records.reduce(
                (maxTimestamp, record) => Math.max(maxTimestamp, getRecordTimestamp(record)),
                0,
              )
              const previousTimestamp = Number(previousState[source.key] || 0)

              // Count items that are new (newer than last known timestamp)
              if (previousTimestamp > 0 && latestTimestamp > previousTimestamp) {
                const newCount = records.filter(
                  (record) => getRecordTimestamp(record) > previousTimestamp,
                ).length
                newCounts[source.countKey] = newCount > 0 ? newCount : 0
              } else {
                newCounts[source.countKey] = 0
              }
            } catch (error) {
              if (error?.response?.status !== 404) {
                if (!silent) {
                  // Silently fail
                }
              }
              newCounts[source.countKey] = 0
            }
          }),
        )

        if (isMounted) {
          setNewItemCounts(newCounts)
        }
      } catch (error) {
        // Silently fail
      }
    }

    const pollNotifications = async (silent = true) => {
      const previousState = loadNotificationState()
      const nextState = { ...previousState }
      const newNotifications = []

      await Promise.all(
        studentNotificationSources.map(async (source) => {
          try {
            const response = await http.get(source.path, {
              headers: { 'Cache-Control': 'no-cache' },
            })
            const records = Array.isArray(response.data?.data) ? response.data.data : []
            const latestTimestamp = records.reduce(
              (maxTimestamp, record) => Math.max(maxTimestamp, getRecordTimestamp(record)),
              0,
            )
            const previousTimestamp = Number(previousState[source.key] || 0)

            if (previousTimestamp > 0 && latestTimestamp > previousTimestamp) {
              const freshCount = records.filter(
                (record) => getRecordTimestamp(record) > previousTimestamp,
              ).length

              if (freshCount > 0) {
                newNotifications.push(
                  createNotificationItem(
                    `${freshCount} new ${source.label} available`,
                  ),
                )
              }
            }

            nextState[source.key] = Math.max(previousTimestamp, latestTimestamp)
          } catch (error) {
            if (error?.response?.status === 404) {
              return
            }

            if (!silent) {
              toast.error('Unable to load update notifications.')
            }
          }
        }),
      )

      saveNotificationState(nextState)

      if (!isMounted || newNotifications.length === 0) {
        return
      }

      setNotifications((previous) => [...newNotifications, ...previous].slice(0, 20))
      setUnreadCount((previous) => previous + newNotifications.length)
      toast.success(`${newNotifications.length} new update notification(s).`)
    }

    void fetchNewItemCounts(true)
    void pollNotifications(true)

    const intervalId = window.setInterval(() => {
      void fetchNewItemCounts(true)
      void pollNotifications(true)
    }, 12000)

    const handleFocus = () => {
      void fetchNewItemCounts(true)
      void pollNotifications(true)
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isStudent])

  const handleToggleNotifications = () => {
    setIsNotificationOpen((previous) => {
      const next = !previous
      if (next) {
        setUnreadCount(0)
      }
      return next
    })
  }

  const handleNavLinkClick = (sectionKey) => {
    // Clear new count badge when user visits the section
    setNewItemCounts((prev) => ({ ...prev, [sectionKey]: 0 }))
  }

  const renderNavBadge = (count) => {
    if (!count || count === 0) return null
    return (
      <span className="ml-1.5 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
        {count > 99 ? '99+' : count}
      </span>
    )
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <NavLink
            to={isAuthenticated ? (role === 'admin' ? '/admin' : '/discussion') : '/login'}
            className="group flex items-center gap-2"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_0_6px_rgba(14,116,144,0.14)]" />
            <span className="text-xl font-extrabold brand-title transition group-hover:brightness-110">
              PlaceMate
            </span>
          </NavLink>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {isStudent && (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700"
                  aria-label="Open notifications"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path d="M9 17a3 3 0 0 0 6 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <p className="px-2 pb-2 text-xs font-semibold text-slate-500">Recent updates</p>
                    {notifications.length === 0 ? (
                      <p className="rounded-lg px-3 py-2 text-sm text-slate-500">No new updates yet.</p>
                    ) : (
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((item) => (
                          <div key={item.id} className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                            <p>{item.message}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((previous) => !previous)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white"
                aria-label="Open profile menu"
              >
                {initials}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <p className="px-2 pb-2 text-xs font-semibold text-slate-500">{userName}</p>

                {role === 'student' && (
                  <>
                    <NavLink
                      to="/faq?mine=true"
                      onClick={() => setIsProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      My FAQs
                    </NavLink>
                    <NavLink
                      to="/discussion?mine=true"
                      onClick={() => setIsProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      My Discussions
                    </NavLink>
                    <NavLink
                      to="/resumes?mine=true"
                      onClick={() => setIsProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      My Resume Library
                    </NavLink>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  Logout
                </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-full border px-4 py-2 text-sm font-semibold ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-300 text-slate-700'
                }`
              }
            >
              Register
            </NavLink>
          </div>
        )}
        </div>

        {isAuthenticated && role === 'student' && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <NavLink
              to="/discussion"
              onClick={() => handleNavLinkClick('discussion')}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              Discussion
              {renderNavBadge(newItemCounts.discussion)}
            </NavLink>
            <NavLink
              to="/faq"
              onClick={() => handleNavLinkClick('faq')}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              FAQ
              {renderNavBadge(newItemCounts.faq)}
            </NavLink>
            <NavLink
              to="/resumes"
              onClick={() => handleNavLinkClick('resumes')}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              Resume Library
              {renderNavBadge(newItemCounts.resumes)}
            </NavLink>
            <NavLink
              to="/placements"
              onClick={() => handleNavLinkClick('placements')}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              Placements
              {renderNavBadge(newItemCounts.placements)}
            </NavLink>
            <NavLink
              to="/internships"
              onClick={() => handleNavLinkClick('internships')}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              Internships
              {renderNavBadge(newItemCounts.internships)}
            </NavLink>
            <NavLink
              to="/readiness"
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              Readiness Check
            </NavLink>
          </div>
        )}

        {isAuthenticated && role === 'admin' && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : 'border-slate-300 text-slate-700'
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar

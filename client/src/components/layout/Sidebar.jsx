import { NavLink } from 'react-router-dom'

function Sidebar({ isOpen, onClose, itemCounts = {} }) {
  const role = sessionStorage.getItem('pmRole') || 'student'

  const renderBadge = (count) => {
    if (!count || count <= 0) return null
    return (
      <span className="ml-auto inline-block rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">
        {count > 99 ? '99+' : count}
      </span>
    )
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform overflow-y-auto border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
              <span className="text-lg font-extrabold text-slate-900">PlaceMate</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 transition hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4 py-6">
          <NavLink
            to="/home"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4v4m0-11l4 2m-4-2L9 7"
              />
            </svg>
            Home
          </NavLink>

          <div className="my-2 border-t border-slate-200" />

          {role === 'student' && (
            <>
              <NavLink
                to="/discussion"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Discussion
                {renderBadge(itemCounts.discussion)}
              </NavLink>

              <NavLink
                to="/faq"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                FAQ
                {renderBadge(itemCounts.faq)}
              </NavLink>

              <NavLink
                to="/resumes"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Resume Library
                {renderBadge(itemCounts.resumes)}
              </NavLink>

              <NavLink
                to="/placements"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Placements
                {renderBadge(itemCounts.placements)}
              </NavLink>

              <NavLink
                to="/internships"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m0 0h5.581m0 0a2.003 2.003 0 01-.5-3.98m.5 3.98V9m0 0a2.007 2.007 0 01.5-3.98m-.5 3.98V9"
                  />
                </svg>
                Internships
                {renderBadge(itemCounts.internships)}
              </NavLink>

              <div className="my-4 border-t border-slate-200" />

              <NavLink
                to="/readiness"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Readiness Check
              </NavLink>
            </>
          )}

          {role === 'admin' && (
            <>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Dashboard
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

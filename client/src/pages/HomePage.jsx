import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import http from '../api/http'

function HomePage() {
  const [stats, setStats] = useState({
    discussions: 0,
    resumes: 0,
    faqs: 0,
    placements: 0,
    internships: 0,
  })
  const [loading, setLoading] = useState(true)

  const role = sessionStorage.getItem('pmRole') || 'student'
  const userName = sessionStorage.getItem('pmUserName') || 'User'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [discussionRes, faqRes, resumeRes, placementRes, internshipRes] = await Promise.all([
          http.get('/discussion'),
          http.get('/faq'),
          http.get('/resumes'),
          http.get('/placements'),
          http.get('/internships'),
        ])

        setStats({
          discussions: discussionRes.data?.data?.length || 0,
          faqs: faqRes.data?.data?.length || 0,
          resumes: resumeRes.data?.data?.length || 0,
          placements: placementRes.data?.data?.length || 0,
          internships: internshipRes.data?.data?.length || 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (role === 'student') {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [role])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50">
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block rounded-full bg-cyan-100 px-4 py-2">
              <p className="text-sm font-semibold text-cyan-700">Welcome back, {userName}!</p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Your Platform for{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Success
              </span>
            </h1>
            <p className="text-lg text-slate-600 sm:text-xl">
              Explore opportunities, connect with peers, and advance your career with PlaceMate.
            </p>
          </div>

          {/* Quick Stats */}
          {role === 'student' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="text-2xl font-bold text-cyan-600">{stats.discussions}</p>
                <p className="text-xs text-slate-600 sm:text-sm">Discussions</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="text-2xl font-bold text-purple-600">{stats.faqs}</p>
                <p className="text-xs text-slate-600 sm:text-sm">FAQs</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="text-2xl font-bold text-amber-600">{stats.resumes}</p>
                <p className="text-xs text-slate-600 sm:text-sm">Resumes</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="text-2xl font-bold text-green-600">{stats.placements}</p>
                <p className="text-xs text-slate-600 sm:text-sm">Placements</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="text-2xl font-bold text-indigo-600">{stats.internships}</p>
                <p className="text-xs text-slate-600 sm:text-sm">Internships</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {role === 'student' && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-12 text-3xl font-bold text-slate-900 sm:text-4xl">
            What You Can Do
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Discussion Card */}
            <NavLink
              to="/discussion"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-cyan-300"
            >
              <div className="mb-4 inline-block rounded-lg bg-cyan-100 p-3 group-hover:bg-cyan-200 transition">
                <svg className="h-6 w-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Open Discussion Forum</h3>
              <p className="text-slate-600">Connect with peers, ask questions, and share knowledge in our vibrant community.</p>
              <p className="mt-4 text-sm font-semibold text-cyan-600 group-hover:text-cyan-700">Explore →</p>
            </NavLink>

            {/* FAQ Card */}
            <NavLink
              to="/faq"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-purple-300"
            >
              <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3 group-hover:bg-purple-200 transition">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">FAQ & Knowledge Base</h3>
              <p className="text-slate-600">Find answers to common questions and access curated knowledge from experts.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Browse →</p>
            </NavLink>

            {/* Resume Library Card */}
            <NavLink
              to="/resumes"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-amber-300"
            >
              <div className="mb-4 inline-block rounded-lg bg-amber-100 p-3 group-hover:bg-amber-200 transition">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Resume Reference Library</h3>
              <p className="text-slate-600">Access curated resume samples and learn best practices for crafting your resume.</p>
              <p className="mt-4 text-sm font-semibold text-amber-600 group-hover:text-amber-700">View →</p>
            </NavLink>

            {/* Placements Card */}
            <NavLink
              to="/placements"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-green-300"
            >
              <div className="mb-4 inline-block rounded-lg bg-green-100 p-3 group-hover:bg-green-200 transition">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 0a2 2 0 100 4m0-4a2 2 0 110 4m0 0V4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Placement Opportunities</h3>
              <p className="text-slate-600">Discover job opportunities and track placement records from top companies.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Explore →</p>
            </NavLink>

            {/* Internships Card */}
            <NavLink
              to="/internships"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-indigo-300"
            >
              <div className="mb-4 inline-block rounded-lg bg-indigo-100 p-3 group-hover:bg-indigo-200 transition">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Internship Opportunities</h3>
              <p className="text-slate-600">Gain practical experience with internship opportunities from leading organizations.</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Explore →</p>
            </NavLink>

            {/* Readiness Card */}
            <NavLink
              to="/readiness"
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-rose-300"
            >
              <div className="mb-4 inline-block rounded-lg bg-rose-100 p-3 group-hover:bg-rose-200 transition">
                <svg className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Placement Readiness</h3>
              <p className="text-slate-600">Assess your readiness for placements and get personalized recommendations.</p>
              <p className="mt-4 text-sm font-semibold text-rose-600 group-hover:text-rose-700">Check →</p>
            </NavLink>
          </div>
        </section>
      )}

      {/* About Us Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 sm:py-24 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                About PlaceMate
              </h2>
              <div className="space-y-4 text-lg text-slate-300">
                <p>
                  PlaceMate is a comprehensive platform designed to bridge the gap between students and career opportunities. We believe every student deserves access to quality resources, mentorship, and opportunities for career growth.
                </p>
                <p>
                  Our mission is to empower students by providing them with the tools, knowledge, and connections they need to succeed in their careers. Whether you're exploring placement opportunities, preparing for internships, or seeking guidance from peers, PlaceMate is your dedicated companion.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
                <div className="mb-4 inline-block rounded-lg bg-cyan-500/20 p-3">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Community-Driven</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Learn from peers and mentors through discussions and shared experiences.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
                <div className="mb-4 inline-block rounded-lg bg-purple-500/20 p-3">
                  <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Opportunity-Rich</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Access placements, internships, and career opportunities curated for you.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
                <div className="mb-4 inline-block rounded-lg bg-green-500/20 p-3">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Comprehensive</h3>
                <p className="mt-2 text-sm text-slate-400">
                  From readiness assessments to resume reviews, we cover it all.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
                <div className="mb-4 inline-block rounded-lg bg-indigo-500/20 p-3">
                  <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Supporting Growth</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Personalized guidance to help you achieve your career goals.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16 border-t border-slate-700 pt-16">
            <h3 className="mb-8 text-2xl font-bold">Our Vision</h3>
            <p className="max-w-2xl text-lg text-slate-300">
              To create an inclusive ecosystem where every student has equal access to career opportunities, mentorship, and resources, enabling them to reach their full potential and make meaningful contributions to society.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 p-8 sm:p-12 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready to Take the Next Step?
          </h2>
          <p className="mb-6 text-lg text-cyan-100">
            Start exploring opportunities and connect with your community today.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center gap-4">
            <NavLink
              to="/discussion"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-slate-100 transition"
            >
              Join Discussion
            </NavLink>
            <NavLink
              to="/placements"
              className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
            >
              Explore Placements
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto w-full max-w-6xl px-4 text-center text-slate-600 sm:px-6">
          <p>© 2026 PlaceMate. All rights reserved. Your partner in career success.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

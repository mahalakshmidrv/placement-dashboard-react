import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import useLocalStorage from '../hooks/useLocalStorage'
import { daysAgoISO, fetchInterviews, fetchJobs, fetchNotifications, fetchStats } from '../services/api'
import seedApplications from '../data/seedApplications.json'
import { DEMO_USER } from '../utils/constants'

const AppDataContext = createContext(null)

const makeId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

/**
 * Holds jobs, interviews, stats (loaded from the mock API) plus the signed-in
 * student's applications and notifications (persisted per student).
 * It is mounted with key={user.email} so each student gets fresh state.
 */
export function AppDataProvider({ children }) {
  const { user } = useAuth()
  const email = user.email

  const [catalog, setCatalog] = useState({ jobs: [], interviews: [], stats: null, loading: true, error: '' })

  const [applications, setApplications] = useLocalStorage(`pt_apps_${email}`, () =>
    email === DEMO_USER.email
      ? seedApplications.map((a) => ({ id: a.id, jobId: a.jobId, status: a.status, appliedAt: daysAgoISO(a.appliedDaysAgo) }))
      : []
  )
  const [notifications, setNotifications] = useLocalStorage(`pt_notes_${email}`, null)

  useEffect(() => {
    let active = true
    Promise.all([fetchJobs(), fetchInterviews(), fetchStats(), fetchNotifications()])
      .then(([jobs, interviews, stats, seedNotes]) => {
        if (!active) return
        setCatalog({ jobs, interviews, stats, loading: false, error: '' })
        setNotifications((prev) => (prev === null ? seedNotes : prev))
      })
      .catch(() => active && setCatalog((c) => ({ ...c, loading: false, error: 'Could not load placement data. Refresh to try again.' })))
    return () => {
      active = false
    }
  }, [setNotifications])

  const notes = notifications || []

  const addNotification = useCallback(
    (n) =>
      setNotifications((prev) => [
        { id: makeId('n'), read: false, createdAt: new Date().toISOString(), ...n },
        ...(prev || []),
      ]),
    [setNotifications]
  )

  const applyToJob = useCallback(
    (job, details) => {
      const application = {
        id: makeId('a'),
        jobId: job.id,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        details,
      }
      setApplications((prev) => [application, ...prev])
      addNotification({
        type: 'company',
        title: `Application sent to ${job.company}`,
        message: `Your application for ${job.role} was submitted. Track it under My Applications.`,
      })
    },
    [setApplications, addNotification]
  )

  const withdrawApplication = useCallback(
    (id) => setApplications((prev) => prev.filter((a) => a.id !== id)),
    [setApplications]
  )

  const markRead = useCallback(
    (id) => setNotifications((prev) => (prev || []).map((n) => (n.id === id ? { ...n, read: true } : n))),
    [setNotifications]
  )
  const markAllRead = useCallback(
    () => setNotifications((prev) => (prev || []).map((n) => ({ ...n, read: true }))),
    [setNotifications]
  )
  const dismissNotification = useCallback(
    (id) => setNotifications((prev) => (prev || []).filter((n) => n.id !== id)),
    [setNotifications]
  )

  const value = useMemo(
    () => ({
      ...catalog,
      applications,
      notifications: notes,
      unreadCount: notes.filter((n) => !n.read).length,
      applyToJob,
      withdrawApplication,
      markRead,
      markAllRead,
      dismissNotification,
    }),
    [catalog, applications, notes, applyToJob, withdrawApplication, markRead, markAllRead, dismissNotification]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export const useAppData = () => {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}

// Mock API layer. Each function returns a Promise so the app can later switch to a
// real backend (fetch/axios) by changing only this file.
import jobsData from '../data/jobs.json'
import interviewsData from '../data/interviews.json'
import statsData from '../data/stats.json'
import notificationsData from '../data/notifications.json'

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

const dayOffset = (days) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

// Dates are generated relative to today so the demo data never goes stale.
export async function fetchJobs() {
  await wait()
  return jobsData.map((j) => ({ ...j, deadline: dayOffset(j.deadlineInDays) }))
}

export async function fetchInterviews() {
  await wait(250)
  return interviewsData.map((i) => ({ ...i, date: dayOffset(i.daysFromNow) }))
}

export async function fetchStats() {
  await wait(250)
  return statsData
}

export async function fetchNotifications() {
  await wait(150)
  const now = Date.now()
  return notificationsData.map((n) => ({
    ...n,
    createdAt: new Date(now - n.hoursAgo * 3600000).toISOString(),
  }))
}

export const daysAgoISO = (days) => dayOffset(-days)

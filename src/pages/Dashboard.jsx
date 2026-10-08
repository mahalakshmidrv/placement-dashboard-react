import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Award, CalendarClock, ClipboardCheck, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import PipelineBar from '../components/PipelineBar'
import Loader from '../components/Loader'
import TrendsChart from '../components/charts/TrendsChart'
import CompanyChart from '../components/charts/CompanyChart'
import StatusChart from '../components/charts/StatusChart'
import { daysUntil, deadlineLabel, formatDate } from '../utils/format'
import { STATUSES } from '../utils/constants'

export default function Dashboard() {
  const { user } = useAuth()
  const { jobs, interviews, stats, applications, loading, error } = useAppData()

  const data = useMemo(() => {
    const byStatus = Object.fromEntries(STATUSES.map((s) => [s, applications.filter((a) => a.status === s).length]))
    const appliedIds = new Set(applications.map((a) => a.jobId))
    const deadlines = jobs
      .filter((j) => !appliedIds.has(j.id) && daysUntil(j.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5)
    const myInterviews = interviews
      .filter((i) => appliedIds.has(i.jobId) && daysUntil(i.date) >= 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    return { byStatus, deadlines, next: myInterviews[0] }
  }, [jobs, interviews, applications])

  if (loading) return <Loader label="Loading your dashboard" />
  if (error) return <p className="alert">{error}</p>

  const { byStatus, deadlines, next } = data
  const nextJob = next && jobs.find((j) => j.id === next.jobId)
  const pipeline = {
    Applied: byStatus['Applied'],
    'Under Review': byStatus['Under Review'],
    Interview: byStatus['Interview Scheduled'],
    Selected: byStatus['Selected'],
  }

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle={`${stats.overview.placed} of ${stats.overview.eligibleStudents} students in your batch are placed so far.`}
        actions={<Link to="/jobs" className="btn">Browse job openings</Link>}
      />

      <section className="card pipeline-card" aria-label="Your application pipeline">
        <h2>Your pipeline</h2>
        <PipelineBar counts={pipeline} />
      </section>

      <section className="stat-grid">
        <StatCard icon={Send} label="Jobs applied" value={applications.length} tone="navy" />
        <StatCard icon={ClipboardCheck} label="Under review" value={byStatus['Under Review'] + byStatus['Applied']} tone="amber" />
        <StatCard icon={CalendarClock} label="Interviews scheduled" value={byStatus['Interview Scheduled']} tone="blue" />
        <StatCard icon={Award} label="Selected" value={byStatus['Selected']} tone="green" />
      </section>

      <div className="grid-main">
        <section className="card">
          <h2>Placement trends</h2>
          <p className="muted">Students placed and offers made, by month</p>
          <TrendsChart data={stats.trends} />
        </section>
        <section className="card">
          <h2>Your applications by status</h2>
          <StatusChart data={STATUSES.map((s) => ({ name: s, value: byStatus[s] }))} />
        </section>
      </div>

      <div className="grid-main">
        <section className="card">
          <h2>Company-wise placements</h2>
          <p className="muted">Students placed this academic year</p>
          <CompanyChart data={stats.companies} />
        </section>
        <section className="card">
          <h2>Upcoming deadlines</h2>
          {deadlines.length === 0 ? (
            <p className="muted">You have applied to every open drive.</p>
          ) : (
            <ul className="list">
              {deadlines.map((j) => (
                <li key={j.id}>
                  <div>
                    <strong>{j.company}</strong>
                    <span className="muted"> {j.role}</span>
                    <p className="muted small">Closes {formatDate(j.deadline, { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <span className={`deadline ${daysUntil(j.deadline) <= 3 ? 'urgent' : ''}`}>{deadlineLabel(j.deadline)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/jobs" className="text-link">See all openings</Link>
        </section>
      </div>

      {next && nextJob && (
        <section className="card next-interview">
          <h2>Next interview</h2>
          <p>
            <strong>{nextJob.company}</strong>, {next.round} on {formatDate(next.date, { weekday: 'long', day: 'numeric', month: 'long' })} at {next.time}
          </p>
          <Link to="/interviews" className="text-link">View interview details</Link>
        </section>
      )}
    </>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MapPin, Video } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import PageHeader from '../components/PageHeader'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { daysUntil, formatDate } from '../utils/format'

export default function Interviews() {
  const { jobs, interviews, applications, loading } = useAppData()
  const [tab, setTab] = useState('upcoming')

  const items = useMemo(() => {
    return interviews
      .map((i) => ({
        ...i,
        job: jobs.find((j) => j.id === i.jobId),
        application: applications.find((a) => a.jobId === i.jobId),
      }))
      .filter((i) => i.job && i.application)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [jobs, interviews, applications])

  if (loading) return <Loader label="Loading interviews" />

  const upcoming = items.filter((i) => daysUntil(i.date) >= 0)
  const past = items.filter((i) => daysUntil(i.date) < 0).reverse()
  const shown = tab === 'upcoming' ? upcoming : past

  return (
    <>
      <PageHeader title="Interview schedule" subtitle="Dates, venues and what to prepare" />
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'upcoming'} className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming <span>{upcoming.length}</span></button>
        <button role="tab" aria-selected={tab === 'past'} className={`tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>Completed <span>{past.length}</span></button>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={tab === 'upcoming' ? 'No interviews scheduled' : 'No completed interviews'}
          message="Interviews appear here once a company shortlists you."
          action={<Link to="/applications" className="btn">View my applications</Link>}
        />
      ) : (
        <div className="interview-list">
          {shown.map((i) => {
            const d = daysUntil(i.date)
            const date = new Date(i.date)
            return (
              <article className="card interview" key={i.id}>
                <div className="date-block">
                  <span className="date-day">{date.getDate()}</span>
                  <span className="date-month">{date.toLocaleDateString('en-IN', { month: 'short' })}</span>
                </div>
                <div className="interview-body">
                  <div className="interview-head">
                    <h3>{i.job.company}: {i.round}</h3>
                    <StatusBadge status={i.application.status} />
                  </div>
                  <p className="muted">{i.job.role} · {formatDate(i.date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <ul className="job-meta">
                    <li><Clock size={14} /> {i.time}</li>
                    <li>{i.mode === 'Online' ? <Video size={14} /> : <MapPin size={14} />} {i.venue}</li>
                  </ul>
                  <p className="small">{i.instructions}</p>
                  {d >= 0 && <p className={`deadline ${d <= 2 ? 'urgent' : ''}`}>{d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`}</p>}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}

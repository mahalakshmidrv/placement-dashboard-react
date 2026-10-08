import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import ApplicationStepper from '../components/ApplicationStepper'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { formatDate } from '../utils/format'
import { STATUSES } from '../utils/constants'

export default function Applications() {
  const { jobs, applications, withdrawApplication, loading } = useAppData()
  const [filter, setFilter] = useState('All')

  const rows = useMemo(
    () =>
      applications
        .map((a) => ({ ...a, job: jobs.find((j) => j.id === a.jobId) }))
        .filter((a) => a.job && (filter === 'All' || a.status === filter))
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)),
    [applications, jobs, filter]
  )

  if (loading) return <Loader label="Loading applications" />

  const count = (s) => applications.filter((a) => a.status === s).length

  return (
    <>
      <PageHeader title="My applications" subtitle={`${applications.length} total`} />

      <div className="tabs" role="tablist" aria-label="Filter by status">
        {['All', ...STATUSES].map((s) => (
          <button key={s} role="tab" aria-selected={filter === s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s} <span>{s === 'All' ? applications.length : count(s)}</span>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={applications.length === 0 ? "You haven't applied yet" : 'Nothing with this status'}
          message={applications.length === 0 ? 'Find an opening that fits and apply in a couple of minutes.' : 'Choose another status above.'}
          action={applications.length === 0 && <Link to="/jobs" className="btn">Browse job openings</Link>}
        />
      ) : (
        <div className="app-list">
          {rows.map(({ id, job, status, appliedAt }) => (
            <article className="card app-card" key={id}>
              <div className="app-head">
                <span className="company-mark" style={{ background: job.color }} aria-hidden="true">{job.company[0]}</span>
                <div className="app-title">
                  <h3>{job.role}</h3>
                  <p className="muted">{job.company} · {job.location} · {job.ctc}</p>
                </div>
                <StatusBadge status={status} />
              </div>
              <ApplicationStepper status={status} />
              <div className="app-foot">
                <span className="muted small">Applied on {formatDate(appliedAt)}</span>
                <div className="app-actions">
                  {status === 'Interview Scheduled' && <Link to="/interviews" className="text-link">View interview</Link>}
                  {(status === 'Applied' || status === 'Under Review') && (
                    <button
                      className="btn btn-ghost btn-small"
                      onClick={() => window.confirm(`Withdraw your application to ${job.company}?`) && withdrawApplication(id)}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

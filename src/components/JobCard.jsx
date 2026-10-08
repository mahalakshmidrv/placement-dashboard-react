import { Briefcase, Clock, IndianRupee, MapPin } from 'lucide-react'
import { daysUntil, deadlineLabel } from '../utils/format'

export default function JobCard({ job, applied, eligible, onOpen }) {
  const left = daysUntil(job.deadline)
  const closed = left < 0
  const urgent = !closed && left <= 3
  return (
    <article className="job-card">
      <div className="job-top">
        <span className="company-mark" style={{ background: job.color }} aria-hidden="true">{job.company[0]}</span>
        <div>
          <h3>{job.role}</h3>
          <p className="muted">{job.company}</p>
        </div>
      </div>
      <ul className="job-meta">
        <li><MapPin size={14} /> {job.location} ({job.mode})</li>
        <li><Briefcase size={14} /> {job.type}</li>
        <li><IndianRupee size={14} /> {job.ctc}</li>
      </ul>
      <div className="chips">
        {job.skills.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
      </div>
      <div className="job-foot">
        <span className={`deadline ${urgent ? 'urgent' : ''} ${closed ? 'closed' : ''}`}><Clock size={14} /> {deadlineLabel(job.deadline)}</span>
        {applied ? (
          <span className="badge badge-green">Applied</span>
        ) : !eligible ? (
          <span className="badge badge-neutral">Min CGPA {job.minCgpa}</span>
        ) : null}
        <button className="btn btn-small" onClick={onOpen}>{applied || closed || !eligible ? 'View' : 'View & apply'}</button>
      </div>
    </article>
  )
}

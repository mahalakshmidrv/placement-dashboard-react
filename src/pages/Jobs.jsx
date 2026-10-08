import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import useDebounce from '../hooks/useDebounce'
import PageHeader from '../components/PageHeader'
import JobCard from '../components/JobCard'
import Modal from '../components/Modal'
import ApplyForm from '../components/ApplyForm'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { daysUntil, deadlineLabel, formatDate } from '../utils/format'

const CATEGORIES = ['Product', 'Service', 'Startup', 'Core']
const TYPES = ['Full-time', 'Internship']
const MODES = ['On-site', 'Hybrid', 'Remote']

export default function Jobs() {
  const { user } = useAuth()
  const { jobs, applications, applyToJob, loading, error } = useAppData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [mode, setMode] = useState('')
  const [eligibleOnly, setEligibleOnly] = useState(false)
  const [sort, setSort] = useState('deadline')
  const [selected, setSelected] = useState(null)
  const [applying, setApplying] = useState(false)
  const [toast, setToast] = useState('')
  const searchRef = useRef(null)
  const debounced = useDebounce(query)
  const cgpa = parseFloat(user.cgpa) || 0

  // Press "/" anywhere on the page to jump to search.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(id)
  }, [toast])

  const appliedIds = useMemo(() => new Set(applications.map((a) => a.jobId)), [applications])

  const visible = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return jobs
      .filter((j) => {
        if (q && !`${j.company} ${j.role} ${j.location} ${j.skills.join(' ')}`.toLowerCase().includes(q)) return false
        if (category && j.category !== category) return false
        if (type && j.type !== type) return false
        if (mode && j.mode !== mode) return false
        if (eligibleOnly && j.minCgpa > cgpa) return false
        return true
      })
      .sort((a, b) => {
        if (sort === 'ctc') return b.ctcValue - a.ctcValue
        if (sort === 'company') return a.company.localeCompare(b.company)
        return new Date(a.deadline) - new Date(b.deadline)
      })
  }, [jobs, debounced, category, type, mode, eligibleOnly, sort, cgpa])

  const clearFilters = () => {
    setQuery(''); setCategory(''); setType(''); setMode(''); setEligibleOnly(false)
  }

  const close = useCallback(() => { setSelected(null); setApplying(false) }, [])

  const submitApplication = (details) => {
    applyToJob(selected, details)
    setToast(`Application sent to ${selected.company}`)
    close()
  }

  if (loading) return <Loader label="Loading job openings" />
  if (error) return <p className="alert">{error}</p>

  const job = selected
  const isApplied = job && appliedIds.has(job.id)
  const isClosed = job && daysUntil(job.deadline) < 0
  const isEligible = job && job.minCgpa <= cgpa
  const filtersActive = query || category || type || mode || eligibleOnly

  return (
    <>
      <PageHeader title="Job openings" subtitle={`${visible.length} of ${jobs.length} openings shown`} />

      <div className="filters card">
        <label className="search">
          <Search size={16} />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search company, role, skill or city  (press /)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search job openings"
          />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Company category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Job type">
          <option value="">All types</option>
          {TYPES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Work mode">
          <option value="">Any mode</option>
          {MODES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
          <option value="deadline">Closing soonest</option>
          <option value="ctc">Highest pay</option>
          <option value="company">Company A to Z</option>
        </select>
        <label className="check">
          <input type="checkbox" checked={eligibleOnly} onChange={(e) => setEligibleOnly(e.target.checked)} />
          <span>Only jobs I'm eligible for</span>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No openings match"
          message="Try a different keyword or remove a filter."
          action={filtersActive && <button className="btn" onClick={clearFilters}>Clear filters</button>}
        />
      ) : (
        <div className="job-grid">
          {visible.map((j) => (
            <JobCard
              key={j.id}
              job={j}
              applied={appliedIds.has(j.id)}
              eligible={j.minCgpa <= cgpa}
              onOpen={() => setSelected(j)}
            />
          ))}
        </div>
      )}

      {job && (
        <Modal title={applying ? `Apply to ${job.company}` : job.role} onClose={close} wide>
          {applying ? (
            <ApplyForm job={job} onSubmit={submitApplication} onCancel={() => setApplying(false)} />
          ) : (
            <div className="job-detail">
              <p className="muted">{job.company} · {job.location} ({job.mode}) · {job.type}</p>
              <p>{job.description}</p>
              <dl className="facts">
                <div><dt>Pay</dt><dd>{job.ctc}</dd></div>
                <div><dt>Openings</dt><dd>{job.openings}</dd></div>
                <div><dt>Minimum CGPA</dt><dd>{job.minCgpa}</dd></div>
                <div><dt>Apply by</dt><dd>{formatDate(job.deadline)} ({deadlineLabel(job.deadline)})</dd></div>
              </dl>
              <div className="chips">{job.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              {!isEligible && <p className="alert">Your CGPA ({cgpa}) is below the {job.minCgpa} required for this role. You can update it on your profile.</p>}
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={close}>Close</button>
                {isApplied ? (
                  <button className="btn" disabled>Already applied</button>
                ) : isClosed ? (
                  <button className="btn" disabled>Applications closed</button>
                ) : (
                  <button className="btn" disabled={!isEligible} onClick={() => setApplying(true)}>Apply now</button>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}

import { PIPELINE, STATUS_META } from '../utils/constants'

export default function ApplicationStepper({ status }) {
  const step = STATUS_META[status]?.step ?? 0
  const rejected = status === 'Rejected'
  return (
    <ol className={`stepper ${rejected ? 'stepper-rejected' : ''}`}>
      {PIPELINE.map((label, i) => {
        const done = !rejected && i <= step
        const current = !rejected && i === step
        return (
          <li key={label} className={`${done ? 'done' : ''} ${current ? 'current' : ''}`}>
            <span className="step-dot" />
            <span className="step-label">{label}</span>
          </li>
        )
      })}
      {rejected && <li className="rejected-note">Not selected for this role</li>}
    </ol>
  )
}

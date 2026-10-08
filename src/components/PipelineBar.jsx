import { PIPELINE } from '../utils/constants'

/** Segmented bar showing how many of the student's applications sit at each stage. */
export default function PipelineBar({ counts }) {
  const total = PIPELINE.reduce((sum, s) => sum + counts[s], 0)
  return (
    <div className="pipeline">
      <div className="pipeline-bar" role="img" aria-label={PIPELINE.map((s) => `${counts[s]} ${s}`).join(', ')}>
        {PIPELINE.map((stage, i) =>
          counts[stage] ? (
            <div key={stage} className={`seg seg-${i}`} style={{ flexGrow: counts[stage] }} title={`${stage}: ${counts[stage]}`} />
          ) : null
        )}
        {total === 0 && <div className="seg seg-empty" style={{ flexGrow: 1 }} />}
      </div>
      <ul className="pipeline-legend">
        {PIPELINE.map((stage, i) => (
          <li key={stage}>
            <span className={`dot seg-${i}`} />
            <strong>{counts[stage]}</strong> {stage}
          </li>
        ))}
      </ul>
    </div>
  )
}

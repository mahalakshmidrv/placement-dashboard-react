import { STATUS_META } from '../utils/constants'

export default function StatusBadge({ status }) {
  const tone = STATUS_META[status]?.tone || 'neutral'
  return <span className={`badge badge-${tone}`}>{status}</span>
}

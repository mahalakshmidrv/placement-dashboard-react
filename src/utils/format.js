const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export const formatDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(iso).toLocaleDateString('en-IN', opts)

export const daysUntil = (iso) =>
  Math.round((startOfDay(iso) - startOfDay(new Date())) / 86400000)

export const deadlineLabel = (iso) => {
  const n = daysUntil(iso)
  if (n < 0) return 'Closed'
  if (n === 0) return 'Closes today'
  if (n === 1) return 'Closes tomorrow'
  return `${n} days left`
}

export const timeAgo = (iso) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso)) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} h ago`
  const days = Math.round(hrs / 24)
  return `${days} d ago`
}

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

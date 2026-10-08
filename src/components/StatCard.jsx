export default function StatCard({ icon: Icon, label, value, note, tone = 'navy' }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon"><Icon size={20} /></div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
        {note && <p className="stat-note">{note}</p>}
      </div>
    </div>
  )
}

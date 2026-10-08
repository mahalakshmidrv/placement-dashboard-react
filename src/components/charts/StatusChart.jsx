import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = {
  Applied: '#8A97A6',
  'Under Review': '#F2B544',
  'Interview Scheduled': '#2D7DD2',
  Selected: '#2FA38A',
  Rejected: '#C8553D',
}

export default function StatusChart({ data }) {
  const rows = data.filter((d) => d.value > 0)
  if (!rows.length) return <p className="muted">Apply to a job to see your status split here.</p>
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={2}>
          {rows.map((r) => <Cell key={r.name} fill={COLORS[r.name]} />)}
        </Pie>
        <Tooltip />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

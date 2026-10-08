import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function CompanyChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="#E3E7EC" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis type="category" dataKey="company" width={78} tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip cursor={{ fill: '#F1F4F7' }} />
        <Bar dataKey="placed" name="Students placed" fill="#2FA38A" radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}

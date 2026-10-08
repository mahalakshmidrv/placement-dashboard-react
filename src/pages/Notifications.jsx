import { useState } from 'react'
import { Bell, Building2, CalendarClock, Megaphone, X } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import PageHeader from '../components/PageHeader'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { NOTIFICATION_TYPES } from '../utils/constants'
import { timeAgo } from '../utils/format'

const ICONS = { interview: CalendarClock, company: Building2, announcement: Megaphone }

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead, dismissNotification, loading } = useAppData()
  const [filter, setFilter] = useState('all')

  if (loading) return <Loader label="Loading notifications" />

  const shown = notifications.filter((n) => filter === 'all' || n.type === filter)

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount ? `${unreadCount} unread` : 'You are all caught up'}
        actions={<button className="btn btn-ghost" onClick={markAllRead} disabled={!unreadCount}>Mark all as read</button>}
      />

      <div className="tabs" role="tablist" aria-label="Filter notifications">
        <button role="tab" aria-selected={filter === 'all'} className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {Object.entries(NOTIFICATION_TYPES).map(([key, label]) => (
          <button key={key} role="tab" aria-selected={filter === key} className={`tab ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>{label}</button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState title="No notifications" message="Interview alerts, company updates and announcements will show up here." />
      ) : (
        <ul className="notes">
          {shown.map((n) => {
            const Icon = ICONS[n.type] || Bell
            return (
              <li key={n.id} className={`note ${n.read ? '' : 'unread'}`}>
                <span className={`note-icon type-${n.type}`}><Icon size={18} /></span>
                <button className="note-main" onClick={() => markRead(n.id)} aria-label={`${n.title}. ${n.read ? 'Read' : 'Mark as read'}`}>
                  <strong>{n.title}</strong>
                  <span>{n.message}</span>
                  <em>{timeAgo(n.createdAt)}</em>
                </button>
                <button className="icon-btn" onClick={() => dismissNotification(n.id)} aria-label="Dismiss notification"><X size={16} /></button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

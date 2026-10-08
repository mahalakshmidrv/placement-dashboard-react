import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export default function NotificationBell() {
  const { unreadCount } = useAppData()
  return (
    <Link to="/notifications" className="icon-btn bell" aria-label={`Notifications, ${unreadCount} unread`}>
      <Bell size={20} />
      {unreadCount > 0 && <span className="bell-count">{unreadCount}</span>}
    </Link>
  )
}

import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Briefcase, CalendarClock, ClipboardList, LayoutDashboard, LogOut, Menu, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import Logo from './Logo'
import NotificationBell from './NotificationBell'
import { initials } from '../utils/format'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Job Openings', icon: Briefcase },
  { to: '/applications', label: 'My Applications', icon: ClipboardList },
  { to: '/interviews', label: 'Interviews', icon: CalendarClock },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { unreadCount } = useAppData()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => setOpen(false), [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Logo light />
        <nav aria-label="Main">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
              {to === '/notifications' && unreadCount > 0 && <em className="nav-count">{unreadCount}</em>}
            </NavLink>
          ))}
        </nav>
        <button className="nav-link logout" onClick={handleLogout}>
          <LogOut size={18} /> <span>Log out</span>
        </button>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div className="topbar-right">
            <NotificationBell />
            <NavLink to="/profile" className="user-chip">
              <span className="avatar">{initials(user.name)}</span>
              <span className="user-name">{user.name}</span>
            </NavLink>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

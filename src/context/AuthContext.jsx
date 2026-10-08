import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { DEMO_USER } from '../utils/constants'

const AuthContext = createContext(null)

// NOTE: This is a front-end demo. Passwords are kept in localStorage only so the
// project works without a backend. A real app must authenticate on a server.
export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('pt_users', [DEMO_USER])
  const [sessionEmail, setSessionEmail] = useLocalStorage('pt_session', null)

  const user = useMemo(
    () => users.find((u) => u.email === sessionEmail) || null,
    [users, sessionEmail]
  )

  const login = useCallback(
    (email, password) => {
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (!found) return { ok: false, field: 'email', message: 'No account found with this email' }
      if (found.password !== password) return { ok: false, field: 'password', message: 'Incorrect password' }
      setSessionEmail(found.email)
      return { ok: true }
    },
    [users, setSessionEmail]
  )

  const register = useCallback(
    (data) => {
      const email = data.email.trim().toLowerCase()
      if (users.some((u) => u.email.toLowerCase() === email)) {
        return { ok: false, field: 'email', message: 'An account with this email already exists' }
      }
      const newUser = {
        name: data.name.trim(),
        email,
        password: data.password,
        phone: '',
        department: data.department,
        year: '4',
        cgpa: data.cgpa,
        skills: '',
        about: '',
        resumeLink: '',
      }
      setUsers((prev) => [...prev, newUser])
      setSessionEmail(email)
      return { ok: true }
    },
    [users, setUsers, setSessionEmail]
  )

  const logout = useCallback(() => setSessionEmail(null), [setSessionEmail])

  const updateProfile = useCallback(
    (changes) => {
      setUsers((prev) => prev.map((u) => (u.email === sessionEmail ? { ...u, ...changes } : u)))
    },
    [setUsers, sessionEmail]
  )

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

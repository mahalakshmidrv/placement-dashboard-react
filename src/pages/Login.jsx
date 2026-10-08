import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import { validateLogin } from '../utils/validators'
import FormField from '../components/FormField'
import Logo from '../components/Logo'
import { DEMO_USER } from '../utils/constants'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const form = useForm({ email: '', password: '' }, validateLogin)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const submit = (v) => {
    const res = login(v.email, v.password)
    if (!res.ok) return setServerError(res.message)
    navigate(location.state?.from || '/dashboard', { replace: true })
  }

  const useDemo = () => {
    form.reset({ email: DEMO_USER.email, password: DEMO_USER.password })
    setServerError('')
  }

  return (
    <div className="auth">
      <section className="auth-side">
        <Logo light />
        <h1>Every application, interview and offer in one place.</h1>
        <p>Search drives, apply in minutes and see exactly where each application stands.</p>
      </section>
      <section className="auth-panel">
        <form className="auth-form" onSubmit={form.handleSubmit(submit)} noValidate>
          <h2>Log in</h2>
          {serverError && <p className="alert" role="alert">{serverError}</p>}
          <FormField label="College email" type="email" autoComplete="email" {...form.fieldProps('email')} />
          <FormField label="Password" type="password" autoComplete="current-password" {...form.fieldProps('password')} />
          <button className="btn btn-block" type="submit">Log in</button>
          <button className="btn btn-ghost btn-block" type="button" onClick={useDemo}>Fill demo account</button>
          <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </div>
  )
}

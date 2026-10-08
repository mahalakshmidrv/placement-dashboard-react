import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import { validateRegister } from '../utils/validators'
import FormField from '../components/FormField'
import Logo from '../components/Logo'
import { DEPARTMENTS } from '../utils/constants'

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const form = useForm(
    { name: '', email: '', department: '', cgpa: '', password: '', confirm: '' },
    validateRegister
  )

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const submit = (v) => {
    const res = register(v)
    if (!res.ok) return setServerError(res.message)
    navigate('/profile', { replace: true, state: { welcome: true } })
  }

  return (
    <div className="auth">
      <section className="auth-side">
        <Logo light />
        <h1>Create your placement profile.</h1>
        <p>Add your details once. Recruiters and your placement cell see the same up-to-date profile.</p>
      </section>
      <section className="auth-panel">
        <form className="auth-form" onSubmit={form.handleSubmit(submit)} noValidate>
          <h2>Create account</h2>
          {serverError && <p className="alert" role="alert">{serverError}</p>}
          <FormField label="Full name" autoComplete="name" {...form.fieldProps('name')} />
          <FormField label="College email" type="email" autoComplete="email" {...form.fieldProps('email')} />
          <div className="grid-2">
            <FormField label="Department" as="select" options={DEPARTMENTS} {...form.fieldProps('department')} />
            <FormField label="CGPA" type="number" step="0.01" min="0" max="10" {...form.fieldProps('cgpa')} />
          </div>
          <FormField label="Password" type="password" autoComplete="new-password" hint="Use 8+ characters with upper case, lower case and a number." {...form.fieldProps('password')} />
          <FormField label="Confirm password" type="password" autoComplete="new-password" {...form.fieldProps('confirm')} />
          <button className="btn btn-block" type="submit">Create account</button>
          <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
        </form>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import { validateProfile } from '../utils/validators'
import FormField from '../components/FormField'
import PageHeader from '../components/PageHeader'
import { DEPARTMENTS, DEMO_USER } from '../utils/constants'
import { initials } from '../utils/format'

const FIELDS = ['phone', 'department', 'year', 'cgpa', 'skills', 'about', 'resumeLink']

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const location = useLocation()
  const [saved, setSaved] = useState(false)
  const form = useForm(
    {
      name: user.name, phone: user.phone, department: user.department, year: user.year,
      cgpa: String(user.cgpa), skills: user.skills, about: user.about, resumeLink: user.resumeLink,
    },
    validateProfile
  )

  const completeness = Math.round(
    (FIELDS.filter((f) => String(form.values[f] || '').trim()).length / FIELDS.length) * 100
  )

  const save = (v) => {
    updateProfile({ ...v, name: v.name.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const skills = form.values.skills.split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <>
      <PageHeader title="Profile" subtitle="Companies see these details when you apply" />
      {location.state?.welcome && <p className="alert alert-info">Account created. Complete your profile so applications are quick to fill.</p>}

      <div className="profile-grid">
        <aside className="card profile-card">
          <span className="avatar avatar-lg">{initials(form.values.name || user.name)}</span>
          <h2>{form.values.name || user.name}</h2>
          <p className="muted">{user.email}</p>
          <div className="meter" aria-label={`Profile ${completeness}% complete`}>
            <div className="meter-fill" style={{ width: `${completeness}%` }} />
          </div>
          <p className="small muted">{completeness}% complete</p>
          {skills.length > 0 && <div className="chips">{skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>}
          {user.email === DEMO_USER.email && <p className="small muted">Demo account: changes are saved in this browser only.</p>}
        </aside>

        <form className="card form" onSubmit={form.handleSubmit(save)} noValidate>
          <h2>Personal and academic details</h2>
          <div className="grid-2">
            <FormField label="Full name" {...form.fieldProps('name')} />
            <FormField label="Phone number" type="tel" inputMode="numeric" maxLength={10} {...form.fieldProps('phone')} />
            <FormField label="Department" as="select" options={DEPARTMENTS} {...form.fieldProps('department')} />
            <FormField label="Year of study" as="select" options={[{ value: '1', label: 'First year' }, { value: '2', label: 'Second year' }, { value: '3', label: 'Third year' }, { value: '4', label: 'Final year' }]} {...form.fieldProps('year')} />
            <FormField label="CGPA" type="number" step="0.01" min="0" max="10" {...form.fieldProps('cgpa')} />
            <FormField label="Resume link" type="url" placeholder="https://" {...form.fieldProps('resumeLink')} />
          </div>
          <FormField label="Skills" hint="Separate skills with commas, for example React, Java, SQL" {...form.fieldProps('skills')} />
          <FormField label="About you" as="textarea" hint={`${form.values.about.length}/300 characters`} {...form.fieldProps('about')} />
          <div className="form-actions">
            {saved && <span className="saved" role="status">Profile saved</span>}
            <button type="submit" className="btn">Save changes</button>
          </div>
        </form>
      </div>
    </>
  )
}

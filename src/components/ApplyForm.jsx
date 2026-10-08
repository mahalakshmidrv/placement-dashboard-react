import FormField from './FormField'
import useForm from '../hooks/useForm'
import { validateApplication } from '../utils/validators'
import { useAuth } from '../context/AuthContext'

export default function ApplyForm({ job, onSubmit, onCancel }) {
  const { user } = useAuth()
  const form = useForm(
    { phone: user.phone, resumeLink: user.resumeLink, coverNote: '', agree: false },
    validateApplication
  )
  const { fieldProps, values } = form

  return (
    <form className="form" onSubmit={form.handleSubmit((v) => onSubmit({ ...v }))} noValidate>
      <p className="muted">Applying for <strong>{job.role}</strong> at {job.company}. Your name, email, department and CGPA are shared from your profile.</p>
      <div className="grid-2">
        <FormField label="Phone number" type="tel" inputMode="numeric" maxLength={10} {...fieldProps('phone')} />
        <FormField label="Resume link" type="url" placeholder="https://" {...fieldProps('resumeLink')} />
      </div>
      <FormField
        label="Why are you a good fit?"
        as="textarea"
        hint={`${values.coverNote.length}/500 characters`}
        {...fieldProps('coverNote')}
      />
      <FormField as="checkbox" label="The details above are correct and I can attend the selection process." {...fieldProps('agree')} />
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn">Submit application</button>
      </div>
    </form>
  )
}

import { useId } from 'react'

/** Reusable labelled input / select / textarea / checkbox with an inline error. */
export default function FormField({ label, as = 'input', error, hint, options = [], children, ...props }) {
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  const common = { id, 'aria-invalid': !!error, 'aria-describedby': describedBy, ...props }

  if (as === 'checkbox') {
    const { checked, ...rest } = common
    return (
      <div className="field field-check">
        <label className="check">
          <input type="checkbox" checked={checked} {...rest} />
          <span>{label}</span>
        </label>
        {error && <p className="field-error" id={`${id}-err`} role="alert">{error}</p>}
      </div>
    )
  }

  let control
  if (as === 'select') {
    control = (
      <select {...common}>
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    )
  } else if (as === 'textarea') {
    control = <textarea rows={4} {...common} />
  } else {
    control = <input {...common} />
  }

  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {control}
      {children}
      {error ? (
        <p className="field-error" id={`${id}-err`} role="alert">{error}</p>
      ) : hint ? (
        <p className="field-hint" id={`${id}-hint`}>{hint}</p>
      ) : null}
    </div>
  )
}

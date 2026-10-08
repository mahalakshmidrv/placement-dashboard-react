import { useState } from 'react'

/**
 * Small form helper: tracks values, touched fields and validation errors.
 * `validate(values)` must return an object of { field: message } (empty when valid).
 */
export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const next = { ...values, [name]: type === 'checkbox' ? checked : value }
    setValues(next)
    if (touched[name]) setErrors(validate(next))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = (onValid) => (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])))
    if (Object.keys(found).length === 0) onValid(values)
  }

  const reset = (next = initialValues) => {
    setValues(next)
    setErrors({})
    setTouched({})
  }

  const fieldProps = (name) => ({
    name,
    value: values[name],
    checked: !!values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : '',
  })

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset, fieldProps }
}

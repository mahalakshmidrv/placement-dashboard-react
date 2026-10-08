const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[6-9]\d{9}$/
const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i

const clean = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg))

export function validateLogin(v) {
  return clean({
    email: !v.email.trim() ? 'Enter your email address' : !EMAIL.test(v.email) ? 'Enter a valid email address' : '',
    password: !v.password ? 'Enter your password' : '',
  })
}

export function passwordIssues(p) {
  const issues = []
  if (p.length < 8) issues.push('at least 8 characters')
  if (!/[A-Z]/.test(p)) issues.push('an uppercase letter')
  if (!/[a-z]/.test(p)) issues.push('a lowercase letter')
  if (!/\d/.test(p)) issues.push('a number')
  return issues
}

export function validateRegister(v) {
  const issues = passwordIssues(v.password)
  const cgpa = parseFloat(v.cgpa)
  return clean({
    name: v.name.trim().length < 3 ? 'Enter your full name (at least 3 characters)' : '',
    email: !v.email.trim() ? 'Enter your email address' : !EMAIL.test(v.email) ? 'Enter a valid email address' : '',
    department: !v.department ? 'Choose your department' : '',
    cgpa: v.cgpa === '' ? 'Enter your CGPA' : isNaN(cgpa) || cgpa < 0 || cgpa > 10 ? 'CGPA must be between 0 and 10' : '',
    password: !v.password ? 'Create a password' : issues.length ? `Password needs ${issues.join(', ')}` : '',
    confirm: !v.confirm ? 'Re-enter your password' : v.confirm !== v.password ? 'Passwords do not match' : '',
  })
}

export function validateProfile(v) {
  const cgpa = parseFloat(v.cgpa)
  return clean({
    name: v.name.trim().length < 3 ? 'Enter your full name (at least 3 characters)' : '',
    phone: !v.phone ? 'Enter your phone number' : !PHONE.test(v.phone) ? 'Enter a 10-digit mobile number' : '',
    department: !v.department ? 'Choose your department' : '',
    year: !v.year ? 'Choose your year of study' : '',
    cgpa: v.cgpa === '' ? 'Enter your CGPA' : isNaN(cgpa) || cgpa < 0 || cgpa > 10 ? 'CGPA must be between 0 and 10' : '',
    skills: !v.skills.trim() ? 'Add at least one skill, separated by commas' : '',
    about: v.about.length > 300 ? 'Keep this under 300 characters' : '',
    resumeLink: v.resumeLink && !URL_RE.test(v.resumeLink) ? 'Enter a full link starting with http:// or https://' : '',
  })
}

export function validateApplication(v) {
  return clean({
    phone: !v.phone ? 'Enter a phone number recruiters can call' : !PHONE.test(v.phone) ? 'Enter a 10-digit mobile number' : '',
    resumeLink: !v.resumeLink ? 'Add a link to your resume' : !URL_RE.test(v.resumeLink) ? 'Enter a full link starting with http:// or https://' : '',
    coverNote: v.coverNote.trim().length < 30 ? 'Write at least 30 characters about why you fit this role' : v.coverNote.length > 500 ? 'Keep this under 500 characters' : '',
    agree: !v.agree ? 'Confirm that your details are correct' : '',
  })
}

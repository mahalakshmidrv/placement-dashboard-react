export const DEMO_USER = {
  name: 'Aarav Menon',
  email: 'demo@student.edu',
  password: 'Demo@123',
  phone: '9876543210',
  department: 'Computer Science',
  year: '4',
  cgpa: '8.2',
  skills: 'React, JavaScript, Java, SQL',
  about: 'Final-year student interested in front-end development and building reliable web products.',
  resumeLink: 'https://example.com/aarav-menon-resume.pdf',
}

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
]

export const STATUSES = ['Applied', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected']

export const STATUS_META = {
  Applied: { tone: 'neutral', step: 0 },
  'Under Review': { tone: 'amber', step: 1 },
  'Interview Scheduled': { tone: 'blue', step: 2 },
  Selected: { tone: 'green', step: 3 },
  Rejected: { tone: 'red', step: -1 },
}

export const PIPELINE = ['Applied', 'Under Review', 'Interview', 'Selected']

export const NOTIFICATION_TYPES = {
  interview: 'Interview alerts',
  company: 'Company updates',
  announcement: 'Announcements',
}

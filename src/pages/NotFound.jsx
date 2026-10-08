import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>Page not found</h1>
      <p>The page you opened does not exist or has moved.</p>
      <Link to="/dashboard" className="btn">Go to dashboard</Link>
    </div>
  )
}

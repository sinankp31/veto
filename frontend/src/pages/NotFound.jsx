import { Link } from 'react-router-dom'
export default function NotFound() {
  return <main className="page"><div className="state"><h1>404</h1><p>That page doesn’t exist.</p><Link className="btn" to="/">GO HOME</Link></div></main>
}

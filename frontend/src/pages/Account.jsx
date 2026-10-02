import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export default function Account() {
  const { user, ready, login, register, logout } = useAuth()
  const { notify } = useUI()
  const [params] = useSearchParams()
  const loc = useLocation()
  const nav = useNavigate()
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { setErrors({}); setFormError('') }, [mode])
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // Same rules as the backend validators, so people get instant feedback.
  const validate = () => {
    const e = {}
    if (mode === 'signup' && (form.name.trim().length < 3 || form.name.trim().length > 50)) e.name = 'Name must be between 3 and 50 characters'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const v = validate()
    setErrors(v)
    setFormError('')
    if (Object.keys(v).length) return
    setBusy(true)
    try {
      const u = mode === 'login'
        ? await login({ email: form.email.trim(), password: form.password })
        : await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      notify(`Welcome${u?.name ? `, ${u.name.split(' ')[0]}` : ''}`)
      nav(loc.state?.from || '/', { replace: true })
    } catch (e) {
      setErrors(e.fields || {})
      setFormError(Object.keys(e.fields || {}).length ? '' : e.message)
    } finally {
      setBusy(false)
    }
  }

  if (!ready) return <main className="auth"><div className="auth-card"><p>Loading…</p></div></main>

  if (user && !busy)
    return (
      <main className="auth bg-img">
        <div className="auth-card">
          <h2>HELLO, {user.name.toUpperCase()}</h2>
          <p className="muted">{user.email}</p>
          <p className="muted">ACCOUNT TYPE: {user.role.toUpperCase()}</p>
          <div className="stack">
            <Link className="btn block" to="/shop">CONTINUE SHOPPING</Link>
            {user.role === 'seller' && <Link className="btn ghost block" to="/studio">OPEN SELLER STUDIO</Link>}
            <button className="btn ghost block" onClick={() => { logout(); notify('Signed out') }}>SIGN OUT</button>
          </div>
        </div>
      </main>
    )

  return (
    <main className="auth bg-img">
      <div className="auth-card">
        <div className="seg wide">
          <button className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>LOG IN</button>
          <button className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')}>SIGN UP</button>
        </div>
        <h2>{mode === 'login' ? 'SIGN IN TO ACCOUNT' : 'CREATE AN ACCOUNT'}</h2>
        {loc.state?.notice && <p className="notice">{loc.state.notice}</p>}

        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <label className={`field ${errors.name ? 'err' : ''}`}>
              <span>FULL NAME</span>
              <input value={form.name} onChange={set('name')} autoComplete="name" />
              {errors.name && <em>{errors.name}</em>}
            </label>
          )}
          <label className={`field ${errors.email ? 'err' : ''}`}>
            <span>EMAIL ADDRESS</span>
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <em>{errors.email}</em>}
          </label>
          <label className={`field ${errors.password ? 'err' : ''}`}>
            <span>PASSWORD</span>
            <input type="password" value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            {errors.password && <em>{errors.password}</em>}
          </label>
          {formError && <p className="form-error">{formError}</p>}

          <button className="btn split" disabled={busy}>
            <span>{busy ? 'PLEASE WAIT…' : mode === 'login' ? 'LOG IN TO ACCOUNT' : 'CREATE ACCOUNT'}</span>
            <i><ArrowRight /></i>
          </button>
        </form>

        <div className="perks">
          <div className="perks-head">
            <strong>{mode === 'login' ? 'NOT YET A MEMBER?' : 'ALREADY A MEMBER?'}</strong>
            <button className="textlink" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'SIGN UP' : 'LOG IN'}</button>
          </div>
          <ul>
            <li><ArrowRight width={18} height={18} /> Save items to your bag</li>
            <li><ArrowRight width={18} height={18} /> Check stock by size before you buy</li>
            <li><ArrowRight width={18} height={18} /> Pick up where you left off on any device</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

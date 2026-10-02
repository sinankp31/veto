import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { useUI } from '../context/UIContext'
import { api, get, patch } from '../lib/api'
import { money, sortedSizes } from '../lib/format'
import { SIZES } from '../config'

const MAX_IMAGES = 5
const MAX_MB = 5

function MyProducts({ onNew }) {
  const { reload } = useProducts()
  const { notify } = useUI()
  const [list, setList] = useState(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState('')

  const load = async () => {
    try {
      const json = await get('/api/product/seller', true)
      setList([...(json.data || [])].sort((a, b) => (a._id < b._id ? 1 : -1)))
    } catch (e) {
      setError(e.message)
    }
  }
  useEffect(() => { load() }, [])

  const toggle = async (p) => {
    setPending(p._id)
    try {
      const json = await patch(`/api/product/${p.published ? 'unlist' : 'list'}/${p._id}`, undefined, true)
      notify(json.message)
      await load()
      reload() // refresh the public storefront list too
    } catch (e) {
      notify(e.message, 'error')
    } finally {
      setPending('')
    }
  }

  if (error) return <div className="state"><p>{error}</p></div>
  if (!list) return <div className="state"><p>Loading…</p></div>
  if (!list.length) return <div className="state"><h3>NO PRODUCTS YET</h3><button className="btn" onClick={onNew}>ADD YOUR FIRST PRODUCT</button></div>

  return (
    <div className="rows">
      {list.map((p) => (
        <div className="srow" key={p._id}>
          <div className="srow-img">{p.images?.[0] ? <img src={p.images[0]} alt="" /> : <div className="img-ph">—</div>}</div>
          <div className="srow-main">
            <strong>{p.title}</strong>
            <span className="price">{money(p.price.amount, p.price.currency)}</span>
            <span className="muted">{sortedSizes(p).map((s) => `${s.size}:${s.stock}`).join('  ') || 'NO SIZES'}</span>
          </div>
          <span className={`status ${p.published ? 'live' : 'draft'}`}>{p.published ? 'LIVE' : 'DRAFT'}</span>
          <div className="srow-actions">
            {p.published && <Link className="textlink" to={`/product/${p._id}`}>VIEW</Link>}
            <button className="btn small" disabled={pending === p._id} onClick={() => toggle(p)}>{p.published ? 'UNLIST' : 'PUBLISH'}</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function NewProduct({ onDone }) {
  const { notify } = useUI()
  const [f, setF] = useState({ title: '', description: '', amount: '', currency: 'INR' })
  const [stock, setStock] = useState(Object.fromEntries(SIZES.map((s) => [s, ''])))
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews])

  const addFiles = (e) => {
    const picked = [...e.target.files]
    e.target.value = ''
    const ok = picked.filter((x) => x.type.startsWith('image/') && x.size <= MAX_MB * 1024 * 1024)
    if (ok.length < picked.length) notify(`Only images up to ${MAX_MB}MB are allowed`, 'warn')
    setFiles((cur) => [...cur, ...ok].slice(0, MAX_IMAGES))
  }

  const sizes = SIZES.filter((s) => stock[s] !== '').map((s) => ({ size: s, stock: Number(stock[s]) }))

  const validate = () => {
    const e = {}
    if (f.title.trim().length < 2 || f.title.trim().length > 50) e.title = 'Title must be 2–50 characters'
    if (f.description.trim().length < 20 || f.description.trim().length > 500) e.description = 'Description must be 20–500 characters'
    if (f.amount === '' || Number(f.amount) < 0) e.amount = 'Enter a valid price'
    if (!sizes.length) e.sizes = 'Enter stock for at least one size'
    else if (sizes.some((s) => !Number.isInteger(s.stock) || s.stock < 0)) e.sizes = 'Stock must be a whole number, 0 or more'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    const fd = new FormData()
    fd.append('title', f.title.trim())
    fd.append('description', f.description.trim())
    fd.append('price', JSON.stringify({ amount: Number(f.amount), currency: f.currency }))
    fd.append('sizes', JSON.stringify(sizes))
    files.forEach((file) => fd.append('images', file))
    setBusy(true)
    try {
      await api('/api/product', { method: 'POST', body: fd, auth: true })
      notify('Product created as a draft. Publish it to make it live.')
      onDone()
    } catch (e) {
      setErrors({ ...e.fields, form: Object.keys(e.fields).length ? '' : e.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="studio-form" onSubmit={submit} noValidate>
      <label className={`field ${errors.title ? 'err' : ''}`}>
        <span>TITLE</span>
        <input value={f.title} maxLength={50} onChange={(e) => setF({ ...f, title: e.target.value })} />
        {errors.title && <em>{errors.title}</em>}
      </label>
      <label className={`field ${errors.description ? 'err' : ''}`}>
        <span>DESCRIPTION ({f.description.length}/500)</span>
        <textarea rows={5} maxLength={500} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        {errors.description && <em>{errors.description}</em>}
      </label>
      <div className="two">
        <label className={`field ${errors.amount ? 'err' : ''}`}>
          <span>PRICE</span>
          <input type="number" min="0" step="any" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
          {errors.amount && <em>{errors.amount}</em>}
        </label>
        <label className="field">
          <span>CURRENCY</span>
          <select value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
            <option>INR</option><option>USD</option>
          </select>
        </label>
      </div>

      <div className={`field ${errors.sizes ? 'err' : ''}`}>
        <span>STOCK PER SIZE (leave blank to not offer that size)</span>
        <div className="stock-grid">
          {SIZES.map((s) => (
            <label key={s}>
              <b>{s}</b>
              <input type="number" min="0" step="1" placeholder="–" value={stock[s]} onChange={(e) => setStock({ ...stock, [s]: e.target.value })} />
            </label>
          ))}
        </div>
        {errors.sizes && <em>{errors.sizes}</em>}
      </div>

      <div className="field">
        <span>IMAGES ({files.length}/{MAX_IMAGES}) · first image is the cover</span>
        <div className="thumbs">
          {previews.map((src, i) => (
            <div key={src} className="thumb">
              <img src={src} alt="" />
              <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remove">×</button>
            </div>
          ))}
          {files.length < MAX_IMAGES && (
            <label className="thumb add">+<input type="file" accept="image/*" multiple hidden onChange={addFiles} /></label>
          )}
        </div>
      </div>

      {errors.form && <p className="form-error">{errors.form}</p>}
      <button className="btn" disabled={busy}>{busy ? 'UPLOADING…' : 'CREATE PRODUCT'}</button>
    </form>
  )
}

export default function Studio() {
  const { user, ready, isSeller } = useAuth()
  const [tab, setTab] = useState('products')
  const [nonce, setNonce] = useState(0)

  if (!ready) return <main className="page"><div className="state"><p>Loading…</p></div></main>
  if (!user) return <Navigate to="/account" state={{ from: '/studio', notice: 'Sign in with your seller account.' }} replace />
  if (!isSeller)
    return (
      <main className="page"><div className="state"><h2>SELLERS ONLY</h2><p>Your account doesn’t have the seller role.</p><Link className="btn" to="/shop">BACK TO SHOP</Link></div></main>
    )

  return (
    <main className="page">
      <div className="page-title">
        <h1>SELLER STUDIO</h1>
        <div className="seg">
          <button className={tab === 'products' ? 'on' : ''} onClick={() => setTab('products')}>MY PRODUCTS</button>
          <button className={tab === 'new' ? 'on' : ''} onClick={() => setTab('new')}>NEW PRODUCT</button>
        </div>
      </div>
      {tab === 'products'
        ? <MyProducts key={nonce} onNew={() => setTab('new')} />
        : <NewProduct onDone={() => { setNonce((n) => n + 1); setTab('products') }} />}
    </main>
  )
}

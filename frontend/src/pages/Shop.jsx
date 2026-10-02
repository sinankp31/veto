import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { SIZES } from '../config'

export default function Shop() {
  const { products, loading, error, reload } = useProducts()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const sort = params.get('sort') || 'new'
  const size = params.get('size') || ''

  const set = (k, v) => {
    const next = new URLSearchParams(params)
    v ? next.set(k, v) : next.delete(k)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    let l = products.filter((p) => !q || `${p.title} ${p.description}`.toLowerCase().includes(q.toLowerCase()))
    if (size) l = l.filter((p) => p.sizes.some((s) => s.size === size && s.stock > 0))
    if (sort === 'low') l = [...l].sort((a, b) => a.price.amount - b.price.amount)
    if (sort === 'high') l = [...l].sort((a, b) => b.price.amount - a.price.amount)
    return l // already newest-first from the provider
  }, [products, q, sort, size])

  return (
    <main className="page">
      <div className="page-title">
        <h1>{q ? `RESULTS FOR “${q.toUpperCase()}”` : 'SHOP ALL'}</h1>
        <span className="muted">{loading ? '' : `${list.length} ITEM${list.length === 1 ? '' : 'S'}`}</span>
      </div>

      <div className="toolbar">
        <div className="chips">
          <span className="muted">SIZE</span>
          <button className={!size ? 'on' : ''} onClick={() => set('size', '')}>ALL</button>
          {SIZES.map((s) => <button key={s} className={size === s ? 'on' : ''} onClick={() => set('size', s)}>{s}</button>)}
        </div>
        <label className="sort">
          <span className="muted">SORT</span>
          <select value={sort} onChange={(e) => set('sort', e.target.value)}>
            <option value="new">NEWEST</option>
            <option value="low">PRICE: LOW → HIGH</option>
            <option value="high">PRICE: HIGH → LOW</option>
          </select>
        </label>
        {q && <button className="textlink" onClick={() => set('q', '')}>CLEAR SEARCH ×</button>}
      </div>

      {loading ? (
        <div className="grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card skeleton" />)}</div>
      ) : error ? (
        <div className="state"><p>{error}</p><button className="btn" onClick={reload}>TRY AGAIN</button></div>
      ) : list.length === 0 ? (
        <div className="state"><p>Nothing matches your filters.</p></div>
      ) : (
        <div className="grid">{list.map((p) => <ProductCard key={p._id} product={p} />)}</div>
      )}
    </main>
  )
}

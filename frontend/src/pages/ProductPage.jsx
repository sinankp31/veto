import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BookmarkIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { money, isNew, sortedSizes, totalStock } from '../lib/format'
import { FREE_DELIVERY_THRESHOLD_INR } from '../config'

export default function ProductPage() {
  const { id } = useParams()
  const { byId, loading } = useProducts()
  const { user } = useAuth()
  const { addItem, busy, wishlist, toggleWish } = useCart()
  const nav = useNavigate()
  const loc = useLocation()
  const product = byId[id]
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => { setSize(''); setQty(1); window.scrollTo(0, 0) }, [id])

  if (loading) return <main className="page"><div className="state"><p>Loading…</p></div></main>
  if (!product)
    return (
      <main className="page"><div className="state"><h2>PRODUCT NOT FOUND</h2><p>It may have been unlisted.</p><Link className="btn" to="/shop">BACK TO SHOP</Link></div></main>
    )

  const sizes = sortedSizes(product)
  const chosen = sizes.find((s) => s.size === size)
  const stock = totalStock(product)
  const wished = wishlist.includes(product._id)
  const freeShip = product.price.currency === 'INR' && product.price.amount >= FREE_DELIVERY_THRESHOLD_INR

  const submit = async () => {
    if (!user) return nav('/account', { state: { from: loc.pathname, notice: 'Sign in to add items to your bag.' } })
    if (!size) return
    await addItem(product._id, size, qty)
  }

  return (
    <main className="pdp">
      <div className="gallery">
        {(product.images?.length ? product.images : [null]).map((src, i) => (
          <div key={i} className={`g-item ${i === 0 && product.images?.length % 2 === 1 ? 'full' : ''}`}>
            {src ? <img src={src} alt={`${product.title} ${i + 1}`} /> : <div className="img-ph">NO IMAGE</div>}
          </div>
        ))}
      </div>

      <aside className="pdp-side">
        <div className="panel">
          <div className="panel-top">
            <div className="tags static">
              {isNew(product) && <span className="tag">NEW</span>}
              {stock === 0 && <span className="tag solid">SOLD OUT</span>}
            </div>
            <button className={`wish static ${wished ? 'on' : ''}`} onClick={() => toggleWish(product._id)} aria-label="Save">
              <BookmarkIcon filled={wished} width={18} height={18} />
            </button>
          </div>
          <div className="title-row">
            <h1>{product.title}</h1>
            <span className="price">{money(product.price.amount, product.price.currency)}</span>
          </div>
          <p className="desc">{product.description}</p>
        </div>

        <div className="panel">
          <div className="muted label">SIZE</div>
          <div className="size-row">
            {sizes.map((s) => (
              <button key={s.size} disabled={s.stock < 1} className={size === s.size ? 'on' : ''} onClick={() => { setSize(s.size); setQty((q) => Math.min(q, s.stock)) }}>
                {s.size}
              </button>
            ))}
          </div>
          {chosen && chosen.stock <= 3 && <p className="warn-text">ONLY {chosen.stock} LEFT IN {chosen.size}</p>}
          {chosen && (
            <div className="qty">
              <span className="muted">QTY</span>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <b>{qty}</b>
              <button onClick={() => setQty((q) => Math.min(chosen.stock, q + 1))}>+</button>
            </div>
          )}
        </div>
        <div className="strip">{freeShip ? 'THIS ITEM QUALIFIES FOR FREE SHIPPING' : `FREE SHIPPING ON ORDERS OVER ${money(FREE_DELIVERY_THRESHOLD_INR)}`}</div>

        <button className="btn block big" disabled={stock === 0 || busy} onClick={submit}>
          {stock === 0 ? 'SOLD OUT' : busy ? 'ADDING…' : !size ? 'SELECT SIZE' : user ? 'ADD TO BAG' : 'SIGN IN TO ADD'}
        </button>
      </aside>
    </main>
  )
}

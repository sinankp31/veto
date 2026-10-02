import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BagIcon, BookmarkIcon, CloseIcon } from './Icons'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { useUI } from '../context/UIContext'
import { money, totalStock } from '../lib/format'
import { FREE_DELIVERY_THRESHOLD_INR } from '../config'

function MiniRow({ product, children }) {
  return (
    <div className="mini">
      <Link to={`/product/${product._id}`} className="mini-img"><img src={product.images?.[0]} alt="" /></Link>
      <div className="mini-body">
        <Link to={`/product/${product._id}`} className="card-title">{product.title}</Link>
        {children}
        <div className="card-row"><span className="price">{money(product.price.amount, product.price.currency)}</span></div>
      </div>
    </div>
  )
}

export default function BagDrawer() {
  const { open, setOpen, tab, setTab, items, count, totals, inrTotal, freeLeft, wishlist, toggleWish } = useCart()
  const { user } = useAuth()
  const { products, byId } = useProducts()
  const { notify } = useUI()
  const nav = useNavigate()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open, setOpen])

  const suggestions = products.filter((p) => totalStock(p) > 0).slice(0, 3)
  const wished = wishlist.map((id) => byId[id]).filter(Boolean)
  const pct = Math.min(100, (inrTotal / FREE_DELIVERY_THRESHOLD_INR) * 100)

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer-head">
          <strong>{tab === 'bag' ? `BAG${count ? ` (${count})` : ''}` : 'SAVED'}</strong>
          <div className="seg">
            <button className={tab === 'bag' ? 'on' : ''} onClick={() => setTab('bag')} aria-label="Bag"><BagIcon width={18} height={18} /></button>
            <button className={tab === 'wishlist' ? 'on' : ''} onClick={() => setTab('wishlist')} aria-label="Saved"><BookmarkIcon width={18} height={18} /></button>
          </div>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close"><CloseIcon /></button>
        </div>

        {tab === 'bag' ? (
          <>
            <div className="ship">
              <p>{inrTotal >= FREE_DELIVERY_THRESHOLD_INR ? 'YOU QUALIFY FOR FREE DELIVERY' : `SPEND ${money(freeLeft)} MORE FOR FREE DELIVERY`}</p>
              <div className="bar"><i style={{ width: `${pct}%` }} /></div>
            </div>

            <div className="drawer-body">
              {!user ? (
                <div className="empty">
                  <h3>SIGN IN TO USE YOUR BAG</h3>
                  <p>Your bag is saved to your account.</p>
                  <button className="btn" onClick={() => { setOpen(false); nav('/account') }}>LOG IN / SIGN UP</button>
                </div>
              ) : items.length === 0 ? (
                <>
                  <div className="empty"><h3>YOUR BAG IS EMPTY</h3><p>Here are some suggestions...</p></div>
                  {suggestions.map((p) => (
                    <MiniRow key={p._id} product={p}>
                      <Link className="add-link" to={`/product/${p._id}`} onClick={() => setOpen(false)}>+ ADD</Link>
                    </MiniRow>
                  ))}
                </>
              ) : (
                items.map((i) =>
                  i.product ? (
                    <MiniRow key={i.key} product={i.product}>
                      <p className="meta">SIZE {i.size} &nbsp;·&nbsp; QTY {i.quantity}</p>
                    </MiniRow>
                  ) : (
                    <div key={i.key} className="mini"><p className="meta">This item is no longer available.</p></div>
                  ),
                )
              )}
            </div>

            {user && items.length > 0 && (
              <div className="drawer-foot">
                <div className="sub">
                  <span>SUBTOTAL</span>
                  <span>{Object.entries(totals).map(([c, a]) => money(a, c)).join(' + ')}</span>
                </div>
                <button className="btn block" onClick={() => notify('Checkout is not available yet.', 'warn')}>CHECKOUT</button>
              </div>
            )}
          </>
        ) : (
          <div className="drawer-body">
            {wished.length === 0 ? (
              <div className="empty"><h3>NOTHING SAVED YET</h3><p>Tap the bookmark on any product to save it here.</p></div>
            ) : (
              wished.map((p) => (
                <MiniRow key={p._id} product={p}>
                  <button className="add-link" onClick={() => toggleWish(p._id)}>REMOVE</button>
                </MiniRow>
              ))
            )}
          </div>
        )}
      </aside>
    </>
  )
}

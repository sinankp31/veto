import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookmarkIcon } from './Icons'
import { useCart } from '../context/CartContext'
import { money, totalStock, isNew, sortedSizes } from '../lib/format'

export default function ProductCard({ product, wide }) {
  const { addItem, wishlist, toggleWish } = useCart()
  const [picking, setPicking] = useState(false)
  const stock = totalStock(product)
  const wished = wishlist.includes(product._id)
  const [img1, img2] = product.images || []

  const quickAdd = async (size) => {
    await addItem(product._id, size, 1)
    setPicking(false)
  }

  return (
    <article className={`card ${wide ? 'card-wide' : ''}`}>
      <div className="card-media">
        <Link to={`/product/${product._id}`} className="card-img" aria-label={product.title}>
          {img1 ? <img src={img1} alt={product.title} loading="lazy" /> : <div className="img-ph">NO IMAGE</div>}
          {img2 && <img className="alt" src={img2} alt="" loading="lazy" />}
        </Link>
        <div className="tags">
          {isNew(product) && <span className="tag">NEW</span>}
          {stock === 0 ? <span className="tag solid">SOLD OUT</span> : stock <= 5 && <span className="tag">LOW STOCK</span>}
        </div>
        <button className={`wish ${wished ? 'on' : ''}`} aria-label="Save" onClick={() => toggleWish(product._id)}>
          <BookmarkIcon filled={wished} width={18} height={18} />
        </button>
      </div>

      <div className="card-info">
        <Link to={`/product/${product._id}`} className="card-title">{product.title}</Link>
        <div className="card-row">
          <span className="price">{money(product.price.amount, product.price.currency)}</span>
          {stock > 0 && (
            <button className="add-link" onClick={() => setPicking((p) => !p)}>{picking ? '– CLOSE' : '+ ADD'}</button>
          )}
        </div>
        {picking && (
          <div className="quick-sizes">
            {sortedSizes(product).map((s) => (
              <button key={s.size} disabled={s.stock < 1} onClick={() => quickAdd(s.size)}>{s.size}</button>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

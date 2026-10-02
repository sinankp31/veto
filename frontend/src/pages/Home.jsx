import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { ArrowRight, ChevronLeft, ChevronRight } from '../components/Icons'
import { useProducts } from '../context/ProductsContext'

export default function Home() {
  const { products, loading, error, reload } = useProducts()
  const track = useRef()
  const scroll = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  const latest = products.slice(0, 10)

  return (
    <>
      <Hero />

      <section className="section" id="new">
        <div className="section-head">
          <h2>NEW ARRIVALS</h2>
          <div className="row-gap">
            <Link to="/shop" className="textlink strong">SHOP ALL <ArrowRight width={16} height={16} /></Link>
            <button className="icon-btn boxed" onClick={() => scroll(-1)} aria-label="Previous"><ChevronLeft /></button>
            <button className="icon-btn boxed" onClick={() => scroll(1)} aria-label="Next"><ChevronRight /></button>
          </div>
        </div>

        {loading ? (
          <div className="rail">{[0, 1, 2, 3].map((i) => <div key={i} className="card card-wide skeleton" />)}</div>
        ) : error ? (
          <div className="state"><p>{error}</p><button className="btn" onClick={reload}>TRY AGAIN</button></div>
        ) : latest.length === 0 ? (
          <div className="state"><p>No products are live yet. Check back soon.</p></div>
        ) : (
          <div className="rail" ref={track}>
            {latest.map((p) => <ProductCard key={p._id} product={p} wide />)}
          </div>
        )}
      </section>

      <section className="lookbook" id="lookbook">
        <div className="lookbook-img" style={{ backgroundImage: 'url(/images/lookbook.jpg)' }} />
        <div className="lookbook-copy">
          <h2>LAYERED STYLING &amp; SEASONAL TEXTURES</h2>
          <p>
            Our latest additions continue the current autumn collection: layered styling, vintage references
            and a mix of colour and texture, built to be worn, not kept.
          </p>
          <Link to="/shop?sort=new" className="textlink tan-link">VIEW THE LATEST <ArrowRight width={16} height={16} /></Link>
        </div>
      </section>
    </>
  )
}

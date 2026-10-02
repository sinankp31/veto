import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from './Icons'
import { HERO_SLIDES } from '../config'

export default function Hero() {
  const [i, setI] = useState(0)
  const n = HERO_SLIDES.length
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500)
    return () => clearInterval(t)
  }, [n, i])

  return (
    <section className="hero">
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.title}
          className={`slide ${idx === i ? 'active' : ''} v${idx % 3}`}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-hidden={idx !== i}
        >
          <div className="slide-copy">
            <h1>{s.title}</h1>
            <p>{s.text}</p>
            <Link to={s.to} className="btn tan">{s.cta}</Link>
          </div>
        </div>
      ))}
      <button className="hero-arrow l" aria-label="Previous" onClick={() => setI((i - 1 + n) % n)}><ChevronLeft /></button>
      <button className="hero-arrow r" aria-label="Next" onClick={() => setI((i + 1) % n)}><ChevronRight /></button>
      <div className="dots">
        {HERO_SLIDES.map((_, idx) => (
          <button key={idx} className={idx === i ? 'on' : ''} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} />
        ))}
      </div>
    </section>
  )
}

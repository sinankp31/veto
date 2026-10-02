import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloseIcon, SearchIcon } from './Icons'
import { useUI } from '../context/UIContext'

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI()
  const [q, setQ] = useState('')
  const ref = useRef()
  const nav = useNavigate()

  useEffect(() => {
    if (searchOpen) setTimeout(() => ref.current?.focus(), 50)
    const esc = (e) => e.key === 'Escape' && setSearchOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [searchOpen, setSearchOpen])

  if (!searchOpen) return null
  const submit = (e) => {
    e.preventDefault()
    nav(`/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
    setSearchOpen(false)
    setQ('')
  }
  return (
    <div className="search-overlay" onClick={() => setSearchOpen(false)}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <SearchIcon />
        <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH PRODUCTS" />
        <button type="button" className="icon-btn" aria-label="Close" onClick={() => setSearchOpen(false)}><CloseIcon /></button>
      </form>
    </div>
  )
}

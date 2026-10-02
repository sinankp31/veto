import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BagIcon, BookmarkIcon, MenuIcon, SearchIcon, UserIcon, CloseIcon } from './Icons'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { BRAND } from '../config'

export default function Header() {
  const { pathname } = useLocation()
  const { user, isSeller, logout } = useAuth()
  const { count, openBag, wishlist } = useCart()
  const { setSearchOpen, notify } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setMenu(false), [pathname])

  const overlay = (pathname === '/' || pathname === '/account') && !scrolled && !menu
  const links = (
    <>
      <NavLink to="/shop">SHOP</NavLink>
      <NavLink to="/shop?sort=new">NEW ARRIVALS</NavLink>
      <a href="/#lookbook">LOOKBOOK</a>
      {isSeller && <NavLink to="/studio">STUDIO</NavLink>}
    </>
  )

  return (
    <header className={`header ${overlay ? 'on-hero' : ''}`}>
      <button className="icon-btn burger" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
        {menu ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav className="nav nav-left">{links}</nav>

      <Link to="/" className="wordmark" aria-label={BRAND.name}>
        {BRAND.name}<span>.</span>
      </Link>

      <div className="nav nav-right">
        {user ? (
          <button className="textlink hide-sm" onClick={() => { logout(); notify('Signed out') }}>
            SIGN OUT
          </button>
        ) : (
          <Link className="textlink hide-sm" to="/account">ACCOUNT</Link>
        )}
        <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
        <button className="icon-btn badge-wrap" aria-label="Wishlist" onClick={() => openBag('wishlist')}>
          <BookmarkIcon />
          {wishlist.length > 0 && <i className="dot" />}
        </button>
        <Link className="icon-btn" aria-label={user ? `Signed in as ${user.name}` : 'Sign in'} title={user?.name} to="/account"><UserIcon /></Link>
        <button className="icon-btn badge-wrap" aria-label="Bag" onClick={() => openBag('bag')}>
          <BagIcon />
          <b className="count">{count}</b>
        </button>
      </div>

      {menu && (
        <div className="mobile-menu" onClick={() => setMenu(false)}>
          {links}
          {user ? <button onClick={() => { logout(); notify('Signed out') }}>SIGN OUT</button> : <Link to="/account">ACCOUNT</Link>}
        </div>
      )}
    </header>
  )
}

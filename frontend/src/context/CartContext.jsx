import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { get, post } from '../lib/api'
import { useAuth } from './AuthContext'
import { useProducts } from './ProductsContext'
import { useUI } from './UIContext'
import { FREE_DELIVERY_THRESHOLD_INR } from '../config'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

const WISH_KEY = 'veto_wishlist'
const readWish = () => {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const { byId } = useProducts()
  const { notify } = useUI()

  const [raw, setRaw] = useState([]) // [{ product: id, quantity, size, _id }]
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('bag')
  const [busy, setBusy] = useState(false)
  const [wishlist, setWishlist] = useState(readWish)

  const refresh = useCallback(async () => {
    if (!user) return setRaw([])
    try {
      const json = await get('/api/cart', true)
      setRaw(json.data?.products || [])
    } catch {
      /* keep previous */
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  // GET /api/cart returns bare product ids, so join with the product list here.
  const items = useMemo(
    () => raw.map((r) => ({ key: r._id || `${r.product}-${r.size}`, size: r.size, quantity: r.quantity, product: byId[r.product], productId: r.product })),
    [raw, byId],
  )
  const count = items.reduce((n, i) => n + i.quantity, 0)

  // Subtotal per currency (a bag could in theory mix INR and USD).
  const totals = useMemo(() => {
    const t = {}
    for (const i of items) {
      if (!i.product) continue
      const c = i.product.price.currency
      t[c] = (t[c] || 0) + i.product.price.amount * i.quantity
    }
    return t
  }, [items])
  const inrTotal = totals.INR || 0
  const freeLeft = Math.max(0, FREE_DELIVERY_THRESHOLD_INR - inrTotal)

  const openBag = useCallback((which = 'bag') => {
    setTab(which)
    setOpen(true)
  }, [])

  const addItem = useCallback(
    async (productId, size, quantity = 1) => {
      if (!user) {
        notify('Please sign in to add items to your bag', 'warn')
        return { needsAuth: true }
      }
      setBusy(true)
      try {
        const json = await post('/api/cart', { productId, size, quantity }, true)
        await refresh()
        notify(json.message || 'Added to bag')
        openBag('bag')
        return { ok: true }
      } catch (e) {
        notify(e.message, 'error')
        return { error: e.message }
      } finally {
        setBusy(false)
      }
    },
    [user, refresh, notify, openBag],
  )

  const toggleWish = useCallback((id) => {
    setWishlist((w) => {
      const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id]
      localStorage.setItem(WISH_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = {
    items, count, totals, inrTotal, freeLeft, busy,
    open, setOpen, tab, setTab, openBag,
    addItem, refresh,
    wishlist, toggleWish,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

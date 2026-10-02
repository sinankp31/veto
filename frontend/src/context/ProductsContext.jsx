import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { get } from '../lib/api'

const ProductsContext = createContext(null)
export const useProducts = () => useContext(ProductsContext)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const json = await get('/api/product')
      // newest first (ObjectIds sort chronologically)
      setProducts([...(json.data || [])].sort((a, b) => (a._id < b._id ? 1 : -1)))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p._id, p])), [products])
  const value = useMemo(() => ({ products, byId, loading, error, reload: load }), [products, byId, loading, error, load])
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

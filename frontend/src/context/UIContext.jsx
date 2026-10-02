import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const UIContext = createContext(null)
export const useUI = () => useContext(UIContext)

export function UIProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const timer = useRef()

  const notify = useCallback((message, tone = 'ok') => {
    clearTimeout(timer.current)
    setToast({ message, tone, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const value = useMemo(() => ({ toast, notify, searchOpen, setSearchOpen }), [toast, notify, searchOpen])
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

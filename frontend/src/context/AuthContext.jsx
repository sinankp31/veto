import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { post, refreshSession, setAccessToken, parseJwt, SESSION_FLAG } from '../lib/api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function toUser(data) {
  // The backend puts the role inside the JWT only, so read it from there.
  const claims = parseJwt(data.accessToken)
  return { ...data.user, role: claims.role || 'user' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // Restore session from the refresh-token cookie on first load.
  useEffect(() => {
    let alive = true
    if (!localStorage.getItem(SESSION_FLAG)) {
      setReady(true)
      return
    }
    refreshSession()
      .then((data) => alive && setUser(toUser(data)))
      .catch(() => {})
      .finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('veto:session-expired', onExpired)
    return () => window.removeEventListener('veto:session-expired', onExpired)
  }, [])

  const finish = (json) => {
    setAccessToken(json.data.accessToken)
    localStorage.setItem(SESSION_FLAG, '1')
    const u = toUser(json.data)
    setUser(u)
    return u
  }

  const login = useCallback(async ({ email, password }) => finish(await post('/api/auth/login', { email, password })), [])
  const register = useCallback(
    async ({ name, email, password }) => finish(await post('/api/auth/register', { name, email, password })),
    [],
  )
  // The backend has no logout route, so we drop the session on the client side.
  const logout = useCallback(() => {
    setAccessToken(null)
    localStorage.removeItem(SESSION_FLAG)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, register, logout, isSeller: user?.role === 'seller' }),
    [user, ready, login, register, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

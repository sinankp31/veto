import { API_URL } from '../config'

/**
 * Thin fetch wrapper around the Express backend.
 *  - Access token lives in memory only (Authorization: Bearer ...).
 *  - Refresh token is an httpOnly cookie, so every request uses credentials: 'include'.
 *  - On a 401 from a protected route we silently call /api/auth/refresh ONCE (shared
 *    between concurrent requests, because the backend rotates the refresh token and a
 *    second parallel refresh would invalidate the session) and retry.
 */
let accessToken = null
let refreshPromise = null

export const SESSION_FLAG = 'veto_has_session'

export const setAccessToken = (t) => {
  accessToken = t
}

export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
  /** { email: 'msg', password: 'msg' } built from express-validator or custom error arrays */
  get fields() {
    const out = {}
    for (const e of this.errors || []) {
      const key = e.path || e.field || e.param
      if (key && !out[key]) out[key] = e.msg || e.message
    }
    return out
  }
}

export function parseJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(payload))))
  } catch {
    return {}
  }
}

async function send(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  let payload
  if (body instanceof FormData) {
    payload = body // browser sets multipart boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload, credentials: 'include' })
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0)
  }
  let json = null
  try {
    json = await res.json()
  } catch {
    /* empty body */
  }
  return { res, json }
}

export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { res, json } = await send('/api/auth/refresh', { method: 'POST' })
      if (!res.ok || !json?.data?.accessToken) {
        setAccessToken(null)
        localStorage.removeItem(SESSION_FLAG)
        throw new ApiError(json?.message || 'Session expired', res.status)
      }
      setAccessToken(json.data.accessToken)
      return json.data
    })().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export async function api(path, opts = {}) {
  let { res, json } = await send(path, opts)

  if (res.status === 401 && opts.auth) {
    try {
      await refreshSession()
      ;({ res, json } = await send(path, opts))
    } catch {
      window.dispatchEvent(new Event('veto:session-expired'))
    }
  }

  if (!res.ok) {
    throw new ApiError(json?.message || json?.error || `Request failed (${res.status})`, res.status, json?.errors)
  }
  return json
}

export const get = (path, auth = false) => api(path, { auth })
export const post = (path, body, auth = false) => api(path, { method: 'POST', body, auth })
export const patch = (path, body, auth = false) => api(path, { method: 'PATCH', body, auth })

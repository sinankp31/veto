const fmtCache = {}
export function money(amount, currency = 'INR') {
  const key = currency
  fmtCache[key] ||= new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })
  return fmtCache[key].format(amount ?? 0)
}

export const totalStock = (p) => (p.sizes || []).reduce((n, s) => n + (s.stock || 0), 0)

/** Mongo ObjectIds embed their creation time in the first 4 bytes. */
export const createdAt = (p) => new Date(parseInt(String(p._id).slice(0, 8), 16) * 1000)
export const isNew = (p, days = 30) => Date.now() - createdAt(p).getTime() < days * 864e5

export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const sortedSizes = (p) =>
  [...(p.sizes || [])].sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size))

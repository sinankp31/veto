const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
export const SearchIcon = (p) => <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
export const BookmarkIcon = ({ filled, ...p }) => <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}><path d="M6 3h12v18l-6-4.5L6 21z" /></svg>
export const UserIcon = (p) => <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>
export const BagIcon = (p) => <svg {...base} {...p}><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
export const CloseIcon = (p) => <svg {...base} {...p}><path d="M5 5l14 14M19 5 5 19" /></svg>
export const ArrowRight = (p) => <svg {...base} {...p}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
export const ChevronLeft = (p) => <svg {...base} {...p}><path d="m15 5-7 7 7 7" /></svg>
export const ChevronRight = (p) => <svg {...base} {...p}><path d="m9 5 7 7-7 7" /></svg>
export const MenuIcon = (p) => <svg {...base} {...p}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
export const PlusIcon = (p) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>

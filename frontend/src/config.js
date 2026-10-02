// Everything brand-related that you may want to tweak lives here.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export const BRAND = {
  name: 'VETO',
  address: ['12 YOUR STREET,', 'YOUR CITY 000000'],
  hours: ['MON-FRI: 11-7', 'SAT: 10-7', 'SUN: 11-5:30'],
  socials: [
    { label: 'INSTAGRAM', href: '#' },
    { label: 'TIKTOK', href: '#' },
    { label: 'YOUTUBE', href: '#' },
  ],
}

// Spend this much (in INR) for free delivery - drives the progress bar in the bag.
export const FREE_DELIVERY_THRESHOLD_INR = 3000

// Home page hero slides. Drop matching images in /public/images (see README there).
export const HERO_SLIDES = [
  {
    image: '/images/hero-1.jpg',
    title: 'JOIN THE FAMILY',
    text: 'Create an account to save your bag, track your picks and be first in line for new drops.',
    cta: 'SIGN UP',
    to: '/account?mode=signup',
  },
  {
    image: '/images/hero-2.jpg',
    title: 'NEW ARRIVALS',
    text: 'Fresh jackets, knits and layers: the latest additions to the autumn collection.',
    cta: 'SHOP NEW',
    to: '/shop',
  },
  {
    image: '/images/hero-3.jpg',
    title: 'LAYERED & TEXTURED',
    text: 'Vintage references, heavy fabrics and a mix of colour for the colder months.',
    cta: 'BROWSE ALL',
    to: '/shop',
  },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

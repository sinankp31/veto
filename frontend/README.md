# VETO frontend

React 18 + Vite + React Router. No UI library; all styling is in `src/styles.css`.

## Run

```bash
# 1. backend (already yours)
cd backend && npm run dev          # http://localhost:3000

# 2. frontend
cd frontend
npm install
npm run dev                        # http://localhost:5173
```

`frontend/.env` holds `VITE_API_URL` (defaults to `http://localhost:3000`). Your backend's CORS
allows `http://localhost:5173` by default, which is the port Vite is pinned to. When you deploy,
add the real site URL to `FRONTEND_ORIGINS` in `backend/.env` (comma separated) and set
`VITE_API_URL` to the deployed API.

## Where things are

| Path | What |
|---|---|
| `public/images/` | **Drop your images here** (see the README in that folder) |
| `src/config.js` | Brand name, hero slide text/images, free-delivery threshold, footer address |
| `src/lib/api.js` | Fetch client: bearer token, httpOnly refresh cookie, auto-refresh on 401 |
| `src/context/` | Auth, products, cart (+ local wishlist), toast/search UI state |
| `src/pages/` | Home, Shop, ProductPage, Account (login/sign-up), Studio (seller), NotFound |
| `src/components/` | Header, Hero, ProductCard, BagDrawer, SearchOverlay, Footer, Toast |

## Backend endpoints used

| Feature | Endpoint |
|---|---|
| Sign up / log in | `POST /api/auth/register`, `POST /api/auth/login` |
| Restore session | `POST /api/auth/refresh` (cookie) |
| Storefront | `GET /api/product` |
| Add to bag / read bag | `POST /api/cart`, `GET /api/cart` |
| Seller: list own, create, publish/unlist | `GET /api/product/seller`, `POST /api/product` (multipart), `PATCH /api/product/list/:id`, `PATCH /api/product/unlist/:id` |

## Things the backend doesn't provide yet (so the UI works around them)

- **No logout route**: "Sign out" just drops the token client-side.
- **Cart can't remove / change quantity**, and **no checkout/order route**: the bag is view + add only; Checkout shows a notice.
- **`GET /api/cart` returns bare product ids**: the bag joins them with the product list in the browser.
- **No `GET /api/product/:id`**: the product page looks the item up in the list.
- **Role isn't in login/register/me responses**: it's read from the JWT payload.
- **New products are created unpublished** (`published` defaults to `false`): the Studio shows them as DRAFT with a PUBLISH button.
- **No categories / gender / sale flag**: nav is Shop, New Arrivals (newest, from the ObjectId timestamp), Lookbook.
- **Wishlist ("saved")** is stored in the browser's localStorage only.
- **Newsletter box** in the footer is UI only.
- **Becoming a seller**: there's no endpoint, set `role: "seller"` on the user in MongoDB.

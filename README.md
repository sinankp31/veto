# VETO

VETO is a clothing storefront and seller catalog application. The repository contains a React storefront, an Express REST API, MongoDB persistence, JWT-based authentication, and ImageKit product-image uploads.

## Features

- Browse published products, search titles and descriptions, filter by size, and sort by price or recency.
- Register and sign in with an access token and an HTTP-only refresh-token cookie.
- Maintain a server-backed cart and check size availability before adding a product.
- Save products to a browser-local wishlist.
- Use the seller Studio to create products, view the seller's catalog, and list or unlist products.
- Upload up to five product images, stored with ImageKit.

## Technology

- Frontend: React 18, Vite, React Router
- Backend: Node.js, Express 5, Mongoose, MongoDB
- Authentication: JSON Web Tokens and bcryptjs
- Product images: ImageKit Node SDK and Multer memory storage

## Repository Layout

```text
backend/
  src/
    app/            Express app and middleware setup
    configs/        environment, MongoDB, and Multer configuration
    controllers/    auth, product, and cart request handlers
    middlewares/    authentication, authorization, and request parsing
    models/         Mongoose user, product, and cart models
    routes/         API route definitions
    services/       ImageKit upload service
    validators/     express-validator request validation
  test/             Node.js test suite
frontend/
  public/images/    Optional local hero and lookbook images
  src/
    components/     Shared storefront UI
    context/        Auth, products, cart, and UI state
    pages/          Home, shop, product, account, and seller Studio pages
    lib/            API and formatting helpers
```

## Requirements

- Node.js 20 or later and npm
- A MongoDB database, local or hosted
- ImageKit credentials to upload product photos

## Setup

Install dependencies separately in each application:

```sh
cd backend
npm install

cd ../frontend
npm install
```

### Backend environment

Create `backend/.env` (this file is ignored by Git) with values for your environment:

```dotenv
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/veto
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
FRONTEND_ORIGINS=http://localhost:5173
```

Use separate, unpredictable secrets for access and refresh tokens. For example, run this twice to generate two different values:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

`FRONTEND_ORIGINS` accepts a comma-separated list of exact origins. It defaults to `http://localhost:5173`. The backend requires MongoDB to connect before it starts listening. ImageKit credentials are required for product image uploads; other API features do not upload images.

For production, set `NODE_ENV=production`, use HTTPS, and set `FRONTEND_ORIGINS` to the deployed frontend origin or origins. Production refresh cookies use `Secure` and `SameSite=None`.

### Frontend environment

The frontend can use the included `frontend/.env.example`. To change the API URL, create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Vite is configured to use port `5173` with `strictPort`; if that port is occupied, stop the other process or update the Vite and backend CORS configuration together.

## Run Locally

Start the backend in one terminal:

```sh
cd backend
npm run dev
```

Start the frontend in another terminal:

```sh
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API listens at `http://localhost:3000` when `PORT=3000` is set.

## Tests and Build

Run backend tests:

```sh
cd backend
npm test
```

Build the frontend for production:

```sh
cd frontend
npm run build
```

Preview the production frontend build locally:

```sh
npm run preview
```

## Authentication and Roles

Registration creates a regular `user` account. There is no public endpoint for granting seller access; seller roles must be assigned through a trusted administrative process. Do not accept a user-supplied role from an unauthenticated registration request.

The API returns a short-lived access token in the JSON response. Send it on protected requests as:

```http
Authorization: Bearer <access-token>
```

The refresh token is stored in an HTTP-only cookie scoped to `/api/auth`. Browser requests include credentials; the frontend API client already sets `credentials: 'include'` and refreshes an expired access token once before retrying a protected request. If calling the API from a different frontend origin, the browser must allow credentials and that exact origin must be listed in `FRONTEND_ORIGINS`.

## API Reference

Base URL for local development: `http://localhost:3000`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a regular user; body: `{ "name", "email", "password" }` |
| `POST` | `/api/auth/login` | Public | Log in; body: `{ "email", "password" }` |
| `POST` | `/api/auth/refresh` | Refresh cookie | Rotate refresh token and return a new access token |
| `GET` | `/api/auth/me` | Access token | Return the current user's name, email, and ID |
| `GET` | `/api/product` | Public | List published products |
| `POST` | `/api/product` | Seller access token | Create a product using multipart form data |
| `GET` | `/api/product/seller` | Seller access token | List the authenticated seller's products |
| `PATCH` | `/api/product/list/:id` | Product owner, seller token | Publish a product |
| `PATCH` | `/api/product/unlist/:id` | Product owner, seller token | Unpublish a product |
| `GET` | `/api/cart` | Access token | Get or create the authenticated user's cart |
| `POST` | `/api/cart` | Access token | Add a product and size to the cart |

Successful API responses generally use a JSON envelope with `success`, `message`, and, when applicable, `data`. Validation failures return HTTP `400`; missing or invalid authentication returns `401`; role authorization failures return `403`; missing products return `404`.

### Create a product

`POST /api/product` expects `multipart/form-data`. Authenticate with a seller access token. Include these fields:

| Field | Format | Notes |
|---|---|---|
| `title` | Text | 2–50 characters |
| `description` | Text | 20–500 characters |
| `price` | JSON text | For example: `{"amount":1499,"currency":"INR"}`; currencies: `INR`, `USD` |
| `sizes` | JSON text | For example: `[{"size":"M","stock":5},{"size":"L","stock":2}]`; sizes: `XS`, `S`, `M`, `L`, `XL`, `XXL` |
| `images` | One or more files | Optional; up to 5 files, each up to 5 MB |

The seller ID is taken from the verified access token, not the request body. New products are controlled by the model's `published` default; see [Known Limitations](#known-limitations) for a current mismatch with the Studio message.

### Cart requests

Add an item with JSON, authenticated as the user who owns the cart:

```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1,
  "size": "M"
}
```

The selected size must exist, the product must be published, and requested quantity must be available in stock.

## Known Limitations

- There is no server-side logout endpoint; the frontend clears its local access token and session flag, but does not revoke the refresh-token cookie.
- Cart endpoints currently support reading the cart and adding items only. There are no remove-item, quantity-update, checkout, or order endpoints.
- `GET /api/cart` returns product IDs rather than populated product documents; the frontend joins them with the public product list.
- There is no `GET /api/product/:id`; product details are found from the storefront product list.
- Wishlist data is stored in browser `localStorage`, not in MongoDB.
- Seller provisioning is manual; registration always creates a regular user.
- **Publication default mismatch:** `backend/src/models/product.model.js` currently defaults `published` to `true`, while the seller Studio says a newly created product is a draft. As written, a new product is published immediately. Align the model default or the UI message before relying on draft behavior.
- The frontend contains placeholder brand contact details and optional local hero/lookbook assets in `frontend/public/images/`.

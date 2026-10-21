# ITGeeks Store

An admin-focused service-commerce platform for managing an e-commerce services business. Administrators manage the service catalog and customer orders from a protected dashboard. Customers can browse the catalog, get AI-assisted service recommendations, and place orders using Razorpay or cash on delivery.

## Live application

The live frontend is deployed on Vercel. The backend API can be hosted separately.

[Open the live ITGeeks Store](https://mern-shopify-store-builder.vercel.app/)

## Features

- **Admin dashboard:** Review orders, update fulfillment status, add and remove services, and review AI recommendation feedback.
- **Service catalog:** Browse, search, and filter services backed by MongoDB.
- **AI service finder:** Match a customer's written needs to services in the live catalog using OpenAI's Responses API. The server validates recommended product IDs against MongoDB before returning them.
- **Recommendation evaluation:** Customers can rate recommendations as helpful or not relevant. The admin dashboard displays request and rating counts, helpful rate, and recent feedback.
- **Shopping cart:** Add services and adjust quantities. The cart persists in the browser's `localStorage`.
- **Checkout:** Place a cash-on-delivery order or pay online with Razorpay.
- **Admin authentication:** Password verification with bcrypt and signed JWTs for protected admin API routes.
- **Editorial design system:** Warm neutral palette, serif display typography, and responsive layouts.

## Technology

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| AI | OpenAI Responses API |
| Payments | Razorpay Checkout and Orders API |
| Authentication | bcryptjs, JSON Web Tokens |

## Project structure

```text
client/
  src/
    components/       Shared UI and service finder
    context/           Admin authentication state
    pages/             Store, cart, checkout, payment, and admin pages
    utils/             Cart operations
  .env.example         Frontend API URL example
server/
  middleware/          Admin JWT authorization
  models/              Admin, order, product, and AI feedback schemas
  routes/              Product, order, payment, login, and AI endpoints
  index.js             Express app and MongoDB connection
```

## Local development

The following setup is for developers who want to run or modify the project locally. It is not needed to use the deployed application.

### Requirements

- Node.js and npm
- MongoDB connection string (local MongoDB or MongoDB Atlas)
- Razorpay API keys for the backend to start payment routes
- OpenAI API key to use the AI service finder (the rest of the app can run without it)

### Setup

The frontend and backend are separate npm applications; install and run each in its own terminal.

### 1. Configure the backend

Create `server/.env` with your own values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-6-astra
SEED_SECRET=choose_a_temporary_seed_secret
```

`OPENAI_API_KEY` is optional if you do not plan to use the AI service finder. `OPENAI_MODEL` defaults to `gpt-6-astra`. Razorpay keys are required by the current payment route during server startup; use Test Mode keys for development. Keep all secrets in the backend environment and never put them in frontend variables.

### 2. Install dependencies

From the project root, run these commands in their respective terminals:

```sh
cd server
npm install
```

```sh
cd client
npm install
```

### 3. Configure the frontend (optional for local development)

The frontend defaults to `http://localhost:5000` for its API. To override this, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Vite environment variables are exposed to frontend code, so only use `VITE_` variables for public configuration such as the API base URL. Do not put secret keys in `client/.env`.

### 4. Start the application

In the backend terminal:

```sh
cd server
npm run dev
```

In a second terminal:

```sh
cd client
npm run dev
```

Vite prints the local frontend address (normally `http://localhost:5173`). The API listens on port `5000` unless `PORT` is changed.

## Admin account

The admin login page sends credentials to `POST /api/admin-auth/login`. The backend looks up an `Admin` document in MongoDB and compares the submitted password with its bcrypt hash. This repository does not include a public admin registration endpoint or an automatic admin account creation script. Ensure a valid admin record exists in the database before logging in. The demo credentials displayed by the UI only work if the matching account has been provisioned in MongoDB.

Admin JWTs are held in frontend memory and expire after one hour. Reloading the browser clears the frontend token, so the admin must log in again.

## Main routes

| Route | Purpose |
|---|---|
| `/` and `/admin` | Admin login |
| `/admin/dashboard` | Protected admin dashboard |
| `/store` | Customer storefront |
| `/product/:id` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Customer details |
| `/payment` | Payment method selection and Razorpay Checkout |
| `/order-success` | Order confirmation page |

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/products` | Public | List catalog services |
| `GET` | `/api/products/:id` | Public | Get one service |
| `POST` | `/api/products` | Admin JWT | Add a service |
| `PUT` | `/api/products/:id` | Admin JWT | Update a service |
| `DELETE` | `/api/products/:id` | Admin JWT | Delete a service |
| `POST` | `/api/admin-auth/login` | Public | Log in as admin and receive a JWT |
| `GET` | `/api/orders` | Admin JWT | List orders |
| `PATCH` | `/api/orders/:id/status` | Admin JWT | Update fulfillment status |
| `POST` | `/api/payment/create-order` | Public | Create a Razorpay order and save a pending order |
| `POST` | `/api/payment/verify` | Public | Verify Razorpay payment signature and mark order paid |
| `POST` | `/api/payment/cod` | Public | Create a cash-on-delivery order |
| `POST` | `/api/assistant/recommend` | Public | Recommend services from the catalog using AI |
| `POST` | `/api/assistant/feedback/:id` | Public | Record a recommendation rating |
| `GET` | `/api/assistant/feedback/admin` | Admin JWT | View AI feedback metrics and recent ratings |
| `POST` | `/api/seed` | Seed secret header | Replace the catalog with sample services |

Admin requests send the JWT as `Authorization: Bearer <token>`.

## Key flows

### Product browsing

The frontend requests `GET /api/products`. Express routes the request to the product router, which reads the catalog through the Mongoose `Product` model and returns JSON.

### AI recommendations and feedback

The frontend posts the customer's description to `/api/assistant/recommend`. The backend reads the catalog, asks the configured OpenAI model for structured recommendations, and validates returned product IDs against the database. It stores the request and recommendations as a service-finder session and returns a session ID. Customers can submit one helpful/not-relevant rating for that session. Admin-only metrics summarize requests and ratings.

### Online payment

The backend calculates the cart total, creates a Razorpay order, and saves a pending MongoDB order. Razorpay Checkout returns the payment ID, order ID, and signature to the frontend. The frontend sends that response to the backend, which recomputes and timing-safely compares the HMAC signature before marking the saved order paid.

### Cash on delivery

The frontend posts the cart and customer information to `/api/payment/cod`. The backend calculates the total and creates an order with `paymentMethod: "cod"` and `paymentStatus: "pending"`.

## Development commands

Run commands from the relevant application directory.

```sh
# Backend
cd server
npm run dev
npm start
```

```sh
# Frontend
cd client
npm run dev
npm run build
npm run lint
npm test
```

## Important configuration and data notes

- The `/api/seed` endpoint deletes all existing products before inserting sample products. Set `SEED_SECRET` only when needed, send it in the `x-seed-secret` header, and do not use this endpoint against a catalog you need to keep.
- Use separate Razorpay Test Mode and Live Mode keys. Do not commit `.env` files or expose `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, or `OPENAI_API_KEY` to the browser.
- Feedback records include the customer's service request and the recommendations shown. The storefront tells customers that this information is retained for admin review.
- The cart is client-side state persisted in `localStorage`; orders and catalog records are stored in MongoDB.

## Troubleshooting

- **MongoDB authentication failure:** Check `MONGO_URI` in `server/.env`, including the database username, password, URL-encoding of special characters, and Atlas network access settings.
- **Razorpay configuration error at startup:** Confirm both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` exist in `server/.env`, then restart the backend.
- **AI service finder is not configured:** Add a non-empty `OPENAI_API_KEY` to `server/.env` and restart the backend.
- **AI model/API error:** Check `OPENAI_MODEL`, the key's model access, usage limits, and the backend terminal's service-finder diagnostic.
- **Frontend cannot reach the API:** Confirm the backend is running and that `VITE_API_URL` points to it. `CLIENT_URL` on the backend should include the frontend origin.

## License

No license file is currently included. Add a license before redistributing the project if you want to grant others explicit reuse rights.

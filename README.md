# TECHNOVA Frontend

Next.js and React front end for the TECHNOVA Computers point of sale and
inventory management system.

## Running locally

The API is expected at `http://localhost:8000`. See the
[backend repository](https://github.com/dev-priyankara/technova-backend) and
its `LOCAL_SETUP.md` for the database, API and demo account setup.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Environment

`API_URL` in `lib/auth.ts` falls back to `http://localhost:8000/api`. To point
the UI somewhere else, create `.env.local`:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The registration verification and password reset screens use EmailJS:

```text
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

Without these values the verification emails are not sent, and the backend
reports a password reset configuration error.

## Roles and routes

| Route      | Audience                                                     |
| ---------- | ------------------------------------------------------------ |
| `/`        | Public storefront, catalogue and AI product recommendation    |
| `/cart`    | Cart and checkout                                            |
| `/login`, `/register` | Authentication and customer registration           |
| `/admin`   | Products, inventory, orders, POS sales, suppliers, users, reports, AI monitoring |
| `/cashier` | POS terminal, shift, transactions, customers                 |
| `/customer`| Orders, profile, settings                                    |
| `/supplier`| Deliveries, products, restock requests, returns, profile     |

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Development server on port 3000   |
| `npm run build` | Production build with type check  |
| `npm start`     | Serve the production build        |
| `npm run lint`  | ESLint                            |

## Notes

Session cookies are `HttpOnly`. The API client sends
`X-Requested-With: TECHNOVA` on writes, which the backend requires for CSRF
protection.

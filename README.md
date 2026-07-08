# Milk Shop ERP

A full-featured ERP system for running a dairy/ milk shop — manages customers, suppliers, inventory, daily deliveries, expenses, staff attendance & salaries.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite
- **Backend:** Hono (Cloudflare Pages Functions)
- **Database:** Cloudflare D1 (SQLite)
- **Auth:** PIN-based login

## Features

- **Dashboard** — Overview cards (total customers, pending collection, low stock items, unpaid expenses) with interactive charts
- **Customers** — CRUD with running balance (collection minus sales) and edit support
- **Suppliers** — CRUD with balance tracking and edit support
- **Inventory** — Stock tracking with categories, batch numbers, expiry dates, min-stock alerts, quantity adjustments, and edit support
- **Delivery** — Monthly subscription model with daily record grid; mark litres delivered per customer each day; future dates blocked; per-month summary with paid/pending indicators
- **Collection** — Record payments against customer balances
- **Expenses** — Custom bill entries with paid/unpaid toggle; dedicated salary tab to pay workers; PATCH support to mark bills paid
- **Staff** — Employee management with daily Present/Absent/Leave grid; salary disbursal handled via Expenses
- **Settings** — Language toggle (English / Urdu), dark mode

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`. The API (Hono) runs on the Vite proxy at `http://localhost:8788`.

### Database Migrations

```bash
npx wrangler d1 migrations apply milk-shop-db --remote
npx wrangler d1 migrations apply milk-shop-db --local
```

### Deploy

```bash
npm run deploy
```

### Generate CF Types

```bash
npm run cf-typegen
```

## Project Structure

```
webapp/
├── functions/api/[[route]].ts   # Hono API (all endpoints)
├── migrations/                  # D1 SQL migrations
├── public/                      # Static assets
├── src/
│   ├── components/              # React views
│   ├── context/                 # AppContext (data layer) & AuthContext
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   ├── types.ts                 # Shared TypeScript types
│   └── translations.ts          # i18n (EN/UR)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc               # Cloudflare Pages config
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create customer |
| PATCH | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |
| GET | `/api/suppliers` | List suppliers |
| POST | `/api/suppliers` | Create supplier |
| PATCH | `/api/suppliers/:id` | Update supplier |
| DELETE | `/api/suppliers/:id` | Delete supplier |
| GET | `/api/inventory` | List inventory items |
| POST | `/api/inventory` | Create inventory item |
| PATCH | `/api/inventory/:id` | Update / adjust inventory |
| DELETE | `/api/inventory/:id` | Delete inventory item |
| GET | `/api/deliveries?month=&year=` | Get delivery records |
| POST | `/api/deliveries` | Record daily delivery |
| POST | `/api/deliveries/pay` | Mark delivery month paid |
| PATCH | `/api/deliveries/customer/:id` | Update delivery customer |
| GET | `/api/expenses` | List expenses |
| POST | `/api/expenses` | Create expense |
| PATCH | `/api/expenses/:id` | Update expense (toggle paid) |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/employees` | List employees |
| POST | `/api/employees` | Create employee |
| PATCH | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/attendance?month=&year=` | Get attendance records |
| POST | `/api/attendance` | Record attendance |
| GET | `/api/collection` | List collection records |
| POST | `/api/collection` | Record payment |
| GET | `/api/dashboard` | Dashboard summary stats |
| GET | `/api/charts` | Chart data |
| GET | `/api/audit-log` | Audit trail |
| POST | `/api/login` | PIN-based login |
| PATCH | `/api/settings/pin` | Change PIN |


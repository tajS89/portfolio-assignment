# Financial Portfolio Application

A full‑stack financial portfolio application with a **Node.js backend** and a **React + TypeScript frontend**.
It includes user authentication, token validation, and an interactive dashboard for visualising portfolio data (dummy).

---

## 🚀 Prerequisites

Ensure the following are installed:

- **Node.js** >= 20.19
- **npm** >= 10.8

---

## 🛠️ Backend

The backend exposes three main APIs:

- **POST /login** — authenticate user
- **GET /validate-token** — validate JWT or session token
- **GET /portfolio** — return portfolio data for the authenticated user

---

## 💻 Frontend

The frontend is built with React + TypeScript and includes:

- **Public Login Page**
  - Uses local storage to store auth token after logging in
  - Redirects to dashboard upon successful login

- **Secure Dashboard**
  - Portfolio Balance Donut Chart with toggle between asset class view and individual asset view
  - Positions Table displaying the same data as the chart in tabular form
  - Historical Performance Chart showing portfolio value over time ( 7D/15D/30D )
  - Logout option available in the Dashboard Header
  - Change theme functionality  available in the dashboard header

---

## 📁 Folder Structure

```
root/
├─ backend/          # Node.js backend
├─ frontend/         # React + TypeScript frontend
|_ shared/           # Stores shared typed
```

---

## ▶️ Usage

**Environment Setup:**

Before starting, configure the environment files for both backend and frontend:

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and update with your required configuration
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env and update with your required configuration
```

**Start backend:**

```bash
cd backend
npm install
npm run build
npm run start
```

Backend runs at: `http://localhost:3001`

**Backend Commands:**
- `npm run lint` - Checks the codebase for linting issues and style consistency.
- `npm run dev` — Run backend in development mode with auto-reload

**Start frontend:**

```bash
cd frontend
npm install
npm run build
npm run start
```

Open `http://localhost:4173` in your browser.

Login using credentials test / Password1_

**Frontend Commands:**
- `npm run lint` - Checks the codebase for linting issues and style consistency.
- `npm run dev` — Run frontend in development mode with hot module replacement
- `npm run test` — Run frontend tests

---

## 📝 Notes

- Both backend and frontend must be running for full functionality.
- Update `.env` for environment‑specific configuration.
- Historical data is currently fetched in a single request. For larger datasets, a separate endpoint would be introduced to support pagination using a cursor ID and page size.

# Full Stack Task Management System — Screen 1 (Login)

A clean full-stack implementation of **Screen 1 — Login** from the Figma design.

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js (App Router) + TypeScript   |
| Styling    | Tailwind CSS                        |
| Backend    | NestJS + TypeScript                 |
| Database   | PostgreSQL                          |
| ORM        | Prisma                              |
| API        | REST (HTTP-only cookie auth)        |

## Project Structure

```text
project/
├── frontend/                  # Next.js App Router frontend
│   ├── app/
│   │   ├── page.tsx           # Redirects / → /login
│   │   ├── login/page.tsx     # Login screen
│   │   ├── dashboard/page.tsx # Placeholder dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Tailwind + theme tokens
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginCard.tsx  # Login card (client component)
│   │   │   └── GoogleIcon.tsx # Reusable Google "G" mark
│   │   ├── ui/
│   │   │   └── Button.tsx     # Reusable button w/ loading spinner
│   │   └── logo/
│   │       └── PyramidLogo.tsx
│   ├── lib/
│   │   ├── api.ts             # Reusable fetch wrapper
│   │   └── auth.ts            # Guest login API call
│   ├── types/
│   │   └── auth.ts            # Shared auth types
│   ├── tailwind.config.ts     # Design tokens (theme-ready)
│   ├── .env.example
│   └── package.json
│
└── backend/                   # NestJS backend
    ├── src/
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.module.ts
    │   │   └── dto/
    │   │       ├── guest-login.dto.ts
    │   │       └── index.ts
    │   ├── users/
    │   │   ├── users.service.ts
    │   │   ├── users.module.ts
    │   │   └── users.repository.ts
    │   ├── prisma/
    │   │   ├── prisma.service.ts
    │   │   └── prisma.module.ts
    │   ├── app.module.ts
    │   └── main.ts            # CORS + validation + cookie parser
    ├── prisma/
    │   └── schema.prisma      # User model (UUID ids)
    ├── .env.example
    └── package.json
```

## Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally (or a hosted instance)
- npm

## Environment Variables

### Frontend — `frontend/.env`

```env
# URL of the NestJS backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend — `backend/.env`

```env
# PostgreSQL connection string used by Prisma
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow?schema=public"

# Port the NestJS server listens on
PORT=3001

# Allowed frontend origin for CORS (no wildcard in production)
FRONTEND_URL="http://localhost:3000"

# Set to "production" to enable secure cookies (requires HTTPS)
NODE_ENV=development
```

Copy the examples:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Database Migration / Setup

1. Start PostgreSQL and create the database:

   ```bash
   createdb taskflow
   ```

   or via `psql`:

   ```sql
   CREATE DATABASE taskflow;
   ```

2. Update `backend/.env` with your real `DATABASE_URL`.

3. Install backend dependencies and run the initial migration:

   ```bash
   cd backend
   npm install
   npx prisma migrate dev --name init
   ```

   This creates the `users` table and generates the Prisma client.

## Local Development Commands

### One-time setup

```bash
# 1. Start PostgreSQL (e.g. via Homebrew)
brew services start postgresql

# 2. Create the database
createdb taskflow
```

### Terminal 1 — Backend (port 3001)

```bash
cd /Users/siddhantsharma/fullstack-assignment/backend
npm install                  # first time only
npx prisma migrate dev       # first time only (creates the users table)
npm run start:dev            # starts NestJS on http://localhost:3001
```

> `backend/.env` is already created with `PORT=3001` and `FRONTEND_URL=http://localhost:3000`.

### Terminal 2 — Frontend (port 3000)

```bash
cd /Users/siddhantsharma/fullstack-assignment/frontend
npm install                  # first time only
npm run dev                  # starts Next.js on http://localhost:3000
```

> `frontend/.env` is already created with `NEXT_PUBLIC_API_URL=http://localhost:3001`.

Then open **http://localhost:3000** in your browser — the app redirects to `/login`.
Click **Continue as Guest** → calls `POST http://localhost:3001/auth/guest` → redirects to `/dashboard`.

### Quick start (both servers already installed)

```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm run dev
```

## API

### `POST /auth/guest`

Creates a guest user in PostgreSQL and returns a session in an HTTP-only cookie.

**Request body** (optional — used to resume an existing session):

```json
{
  "sessionToken": "uuid"
}
```

**Response `200 OK`:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": null,
    "name": "Guest",
    "isGuest": true,
    "createdAt": "2026-08-14T...",
    "updatedAt": "2026-08-14T..."
  },
  "message": "Guest login successful"
}
```

**Errors:**

| Status | Body                                    |
| ------ | --------------------------------------- |
| 401    | `{ "message": "Invalid session token" }`|
| 500    | Internal server error                   |

## How Guest Login Works

```
User clicks Continue as Guest
        ↓
POST /auth/guest  (frontend calls NestJS)
        ↓
NestJS AuthService.loginAsGuest()
        ↓
UsersService.createGuestUser() → creates row in PostgreSQL
        ↓
A random session token is generated and mapped to the user
        ↓
NestJS sets an HTTP-only, SameSite=Lax cookie (taskflow_session)
        ↓
Frontend stores nothing sensitive — the cookie is sent automatically
        ↓
router.push('/dashboard')
```

### Session details

- The session token is stored in an **HTTP-only** cookie, so it is not readable from JavaScript (XSS-safe).
- `SameSite=Lax` prevents CSRF on cross-site requests.
- `Secure` is enabled automatically when `NODE_ENV=production`.
- The in-memory `Map` in `AuthService` can be swapped for a `Session` table or JWT strategy later without changing the controller contract.
- On repeat visits, the browser sends `taskflow_session` and the backend resumes the same guest user instead of creating a new one.

## Google Button

The **"Login with Google"** button is preserved visually exactly as shown in the Figma, including the official multicolor Google "G" mark. It is currently disabled because no OAuth credentials are configured. The component is isolated in `LoginCard.tsx` so OAuth can be wired in later (e.g., via `next-auth` or a backend OAuth endpoint) without touching the rest of the screen.

## Theming

Theme tokens are defined as CSS custom properties in `frontend/app/globals.css` (`:root`) and mapped in `frontend/tailwind.config.ts`. The login screen matches the Figma design exactly, and future screens can extend or swap palettes simply by changing these variables. A theme-persistence layer (e.g., localStorage + `class` on `<html>`) can be added when additional designs are implemented.

## Design Fidelity

The login screen reproduces the Figma design:

- Pyramid logo centered above the card
- Card centered horizontally and vertically on the viewport
- `Let's get back on track` heading (2xl / bold)
- Subtitle in muted foreground
- Full-width black **Continue as Guest** button
- Divider + outlined **Login with Google** button
- Terms-of-service caption below the card
- Responsive: card uses `max-w-sm`, page uses `min-h-screen` + `px-4` so it fits mobile without horizontal scroll

# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm run dev

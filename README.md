# Food Delivery App (React + Express + PostgreSQL)

A food ordering starter project with a Vite + React frontend, an Express API backend, and PostgreSQL database support.

## Why this repo is GitHub-ready

- No sensitive credentials should be committed.
- Local `.env` files are ignored via `.gitignore`.
- Build artifacts and dependencies are ignored.
- A license file is included for open-source distribution.

## Features

- User signup/login
- Restaurant login
- Admin access
- PostgreSQL-backed data storage
- Seeded restaurant, menu, and review data
- Docker Compose support for local development

## Prerequisites

- Node.js 18+ or compatible
- npm
- PostgreSQL (unless using Docker Compose)

## Setup

1. Copy the environment example:

```bash
cp backend/.env.example backend/.env
```

2. Set `DATABASE_URL` and `JWT_SECRET` in `backend/.env`.

3. Install and run the backend:

```bash
cd backend
npm install
npm start
```

4. Install and run the frontend:

```bash
cd frontend
npm install
npm start
```

5. Open the app:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`

## Docker Compose

To run the full stack locally with Docker Compose:

```bash
docker compose up -d
```

The PostgreSQL service listens on `5432` and Adminer is available at `http://localhost:8080`.

## Notes

- Do not commit local `.env` files.
- Keep `backend/.env.example` as the canonical setup reference.
- If you add a Git repository, initialize it in the project root and commit the ignored files settings first.

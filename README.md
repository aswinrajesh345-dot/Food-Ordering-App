# QuickBite Food Ordering App

QuickBite is a full-stack food ordering web app built with React, Express, and PostgreSQL. It lets users browse restaurants, view menu items, place orders, write reviews, and authenticate as customers, restaurants, or admins.

## What this project does

- Displays a modern food ordering interface with restaurant cards and cuisine-based browsing
- Supports customer signup/login and order placement
- Supports restaurant login for restaurant-specific access
- Supports admin login for user and restaurant management
- Uses a PostgreSQL database with seeded sample data for restaurants, menu items, orders, and reviews

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT + bcrypt
- Container support: Docker Compose

## Project structure

```text
backend/       # Express API, auth routes, and database logic
frontend/      # React frontend app
backend/db/    # SQL schema and seed data
docker-compose.yml
README.md
```

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL, or Docker Desktop if you want to run the database in containers

## Getting started

1. Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

2. Fill in the values in `backend/.env`:

- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_ORIGIN` (optional)

3. Start the backend:

```bash
cd backend
npm install
npm start
```

4. Start the frontend in a new terminal:

```bash
cd frontend
npm install
npm start
```

5. Open the app in your browser:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Running with Docker Compose

If you prefer to run PostgreSQL locally with Docker:

```bash
docker compose up -d
```

This starts the database service and Adminer for easy database inspection.

## Demo credentials

The backend seeds demo accounts for convenience:

- Customer: `demo@quickbite.com` / `demo123`
- Restaurant: `pastapalace@gmail.com` / `abcd12345`
- Admin: `admin@gmail.com` / `admin12345`

## Notes

- Do not commit your local `.env` file.
- Use `backend/.env.example` as the template for configuration.
- The app includes seeded content so it can run immediately after setup.

# QuickBite Food Ordering App

QuickBite is a full-stack food ordering web app built with React, Express, and PostgreSQL.

## Features

- Browse restaurants and menu items
- Sign up or log in as a customer
- Place orders
- Leave reviews
- Access restaurant and admin flows

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT + bcrypt

## Project Structure

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
- PostgreSQL, or Docker Desktop for container-based setup

## Getting Started

1. Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

2. Update the values in `backend/.env`:

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
npm run dev
```

5. Open the app in your browser:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Docker Compose

```bash
docker compose up -d
```

## Notes

- Do not commit your local `.env` file.
- Use `backend/.env.example` as the template for configuration.

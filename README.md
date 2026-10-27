# Study planner (demo)

Java 21 + Spring Boot 3 + PostgreSQL + Next.js 14.

## Run

1. Database: `docker compose up -d`
   (no Docker? create a local Postgres database `studyplanner` with user/password `planner`/`planner`)
2. Backend: `cd backend && mvn spring-boot:run`  -> http://localhost:8080
   Tables are created automatically and demo data is added on first start.
3. Frontend: `cd frontend && npm install && npm run dev`  -> http://localhost:3000

## API

- `GET/POST /api/subjects`, `DELETE /api/subjects/{id}`
- `GET/POST /api/tasks`, `PUT/DELETE /api/tasks/{id}`

# TransitOps — Smart Transport Operations Platform

Odoo Hackathon 2026. Fleet, driver, trip and maintenance management with automatic
status transitions and a KPI dashboard.

## Stack
- Backend: Spring Boot 3 + Spring Data JPA + H2 (file DB), REST API on `:8080`
- Frontend: React (Vite) + Bootstrap 5, dev server on `:5173`

## Run backend
Open this folder in IntelliJ and run `TransitOpsApplication`, or:
```
./gradlew bootRun
```

## Run frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 — login `manager@transitops.com` / `admin123`.

## Team
- Ishlok Dwivedi — backend, trip engine
- Krishna Singh — frontend

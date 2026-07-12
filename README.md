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

## API Endpoints
Base URL: `http://localhost:8080/api`

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/login` | Authenticate. Body `{email, password}` → returns name/role, 401 if invalid |
| GET | `/dashboard` | Live KPIs: available, onTrip, inShop, activeTrips, pendingTrips, utilization% |
| GET | `/vehicles` | List all vehicles |
| POST | `/vehicles` | Add vehicle. Rejects duplicate `regNumber` (400) |
| GET | `/drivers` | List all drivers |
| POST | `/drivers` | Add driver |
| GET | `/trips` | List all trips |
| GET | `/trips/options` | Only AVAILABLE vehicles + non-expired-license drivers (for dropdowns) |
| POST | `/trips` | Create trip. Rejects cargo > vehicle max load (400) |
| POST | `/trips/{id}/dispatch` | Dispatch. Enforces available vehicle+driver, valid license, capacity |
| POST | `/trips/{id}/complete` | Body `{finalOdometer, fuelUsed}`. Frees vehicle/driver, updates odometer |
| POST | `/trips/{id}/cancel` | Cancel; releases vehicle/driver if dispatched |

H2 console: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:file:./data/transitops`, user `sa`, no password).

## Quick API test (curl / Postman)
```bash
# Login
curl -X POST http://localhost:8080/api/login -H "Content-Type: application/json" \
  -d '{"email":"manager@transitops.com","password":"admin123"}'

# Dashboard KPIs
curl http://localhost:8080/api/dashboard

# Add a vehicle
curl -X POST http://localhost:8080/api/vehicles -H "Content-Type: application/json" \
  -d '{"regNumber":"TRK-09","name":"Ashok Leyland","type":"Truck","maxLoad":1000,"odometer":5000}'

# Create a trip (cargo must be <= vehicle maxLoad)
curl -X POST http://localhost:8080/api/trips -H "Content-Type: application/json" \
  -d '{"source":"Delhi","destination":"Agra","vehicleId":1,"driverId":1,"cargoWeight":300,"plannedDistance":200}'

# Dispatch it (vehicle+driver flip to ON_TRIP)
curl -X POST http://localhost:8080/api/trips/1/dispatch

# Complete it (frees vehicle+driver, updates odometer)
curl -X POST http://localhost:8080/api/trips/1/complete -H "Content-Type: application/json" \
  -d '{"finalOdometer":12500,"fuelUsed":25}'
```

## Team
- Ishlok Dwivedi — backend, trip engine
- Krishna Singh — frontend

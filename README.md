# Clear Pro Backend (Express + MongoDB)

Functional API to power the Clear Pro Admin Dashboard and Doctor Portal fronts.

## Quick Start
1) `cp .env.example .env` and edit values if needed.
2) `npm install`
3) Start MongoDB locally (e.g. `mongod`).
4) `npm run start` (or `npm run dev` with nodemon).

A seed admin user is created automatically on first run if not found:
- Email: `admin@clearproaligner.com`
- Password: `admin123`

## Folders
- `src/models` Mongoose schemas
- `src/routes` Express routes
- `src/middleware` auth and error handlers
- `uploads` uploaded files served statically at `/uploads`

## API Base
All endpoints are prefixed with `/api` to match the front-end files.

## Key Endpoints
- `POST /api/auth/login` – Login, returns JWT
- `GET /api/auth/me` – Current user info
- `GET /api/dashboard/stats` – Counts for cards
- `GET /api/doctors` – List doctors
- `POST /api/doctors` – Create doctor
- `GET /api/cases` – List cases (doctor sees own by default)
- `POST /api/cases` – Create a case (without files)
- `GET /api/cases/:id` – Case details
- `PATCH /api/cases/:id` – Update case
- `POST /api/files/upload` – Upload multiple files (STL/photos/xrays) with query params

## Uploading Files
POST `/api/files/upload?type=stl|photos|xrays&caseId=<id>` using `multipart/form-data`
- Field name: `files` (multiple)
- Returns an array of stored file objects with public URLs

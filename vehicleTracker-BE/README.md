# Vehicle Tracker Backend API

Backend API untuk aplikasi Vehicle Tracker Dashboard yang dibangun menggunakan Node.js, TypeScript, Express.js, dan PostgreSQL.

## Fitur Utama

- **Authentication & Authorization**: JWT-based auth dengan access & refresh tokens
- **User Management**: CRUD operations untuk user management
- **Vehicle Management**: Mengelola data kendaraan dan status real-time
- **Vehicle Status Tracking**: Tracking status kendaraan (trip, idle, stopped)
- **Report Generation**: Generate laporan Excel dari data perjalanan
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Unit tests dan integration tests
- **Security**: Rate limiting, helmet, CORS protection
- **Validation**: Request validation menggunakan Zod

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm atau yarn

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Excel Generation**: ExcelJS
- **Security**: Helmet, CORS, Rate Limiting

## Struktur Project

```
src/
├── config/          # Konfigurasi aplikasi
├── controllers/     # API controllers
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── middlewares/     # Express middlewares
├── validators/      # Request validators (Zod)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── database/       # Database migrations & seeds
├── routes/         # API routes
├── __tests__/      # Test files
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd vehicle-tracker-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env file dengan konfigurasi database dan JWT secrets
```

### 4. Setup Database

```bash
# Buat database PostgreSQL
createdb vehicle_tracker

# Jalankan migrations
npm run migrate

# Seed data dummy
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Database Schema

### Users Table

```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- full_name (VARCHAR)
- role (ENUM: admin, user)
- created_at, updated_at (TIMESTAMP)
```

### Vehicles Table

```sql
- id (SERIAL PRIMARY KEY)
- license_plate (VARCHAR UNIQUE)
- brand, model (VARCHAR)
- year (INTEGER)
- color (VARCHAR)
- fuel_type (ENUM: gasoline, diesel, electric, hybrid)
- created_at, updated_at (TIMESTAMP)
```

### Vehicle Statuses Table

```sql
- id (SERIAL PRIMARY KEY)
- vehicle_id (INTEGER REFERENCES vehicles)
- status (ENUM: trip, idle, stopped)
- latitude, longitude (DECIMAL)
- speed, fuel_level (DECIMAL)
- engine_temp (INTEGER)
- timestamp (TIMESTAMP)
- created_at (TIMESTAMP)
```

## Authentication

API menggunakan JWT authentication dengan access dan refresh tokens:

- **Access Token**: Expired dalam 15 menit, digunakan untuk request API
- **Refresh Token**: Expired dalam 7 hari, digunakan untuk refresh access token

### Demo Credentials

```
Admin User:
- Email: admin@vehicletracker.com
- Password: password123

Regular User:
- Email: user@vehicletracker.com
- Password: password123
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user data

### Users (Admin only)

- `GET /api/users` - Get all users (paginated)
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Vehicles

- `GET /api/vehicles` - Get all vehicles (paginated, searchable)
- `GET /api/vehicles/:id` - Get vehicle by ID
- `GET /api/vehicles/:id/status` - Get vehicle status by date range

### Reports

- `GET /api/reports/data` - Get report data as JSON
- `GET /api/reports/download` - Download Excel report

## 📖 API Documentation

Setelah server berjalan, buka browser dan akses:

- Swagger UI: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

## Testing

### Menjalankan Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage

- **Unit Tests**: Minimal 5 services/functions
- **Integration Tests**: Minimal 3 endpoints
- **Coverage Target**: >80%

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
npm run test:coverage # Run tests with coverage
npm run lint        # Lint code
npm run lint:fix    # Fix linting issues
npm run migrate     # Run database migrations
npm run seed        # Seed database with dummy data
npm run db:reset    # Reset database (migrate + seed)
```

## Docker

### Build Image

```bash
docker build -t vehicle-tracker-backend .
```

### Run Container

```bash
docker run -p 3000:3000 --env-file .env vehicle-tracker-backend
```

## Deployment

### Manual Deployment

1. **Build aplikasi**:

```bash
npm run build
```

2. **Setup environment di server**:

```bash
cp .env.example .env
# Edit .env dengan konfigurasi production
```

3. **Setup database**:

```bash
npm run migrate
npm run seed
```

4. **Start aplikasi**:

```bash
npm start
```

### Docker Deployment

1. **Build dan push image**:

```bash
docker build -t your-registry/vehicle-tracker-backend .
docker push your-registry/vehicle-tracker-backend
```

2. **Deploy menggunakan docker-compose** (lihat root project)

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: API rate limiting
- **JWT**: Secure authentication
- **Password Hashing**: bcrypt dengan salt rounds 12
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries

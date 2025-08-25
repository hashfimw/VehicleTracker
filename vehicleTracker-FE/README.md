# Vehicle Tracker Frontend

A modern React-based frontend for the Vehicle Tracker system, built with TypeScript, Vite, TailwindCSS, and ShadCN UI.

## Features

- JWT Authentication with token refresh
- Protected routes and role-based access
- Real-time vehicle tracking dashboard
- Vehicle status monitoring by date
- Excel report generation and download
- Responsive design with modern UI components
- State management with Zustand + React Query
- Form validation with React Hook Form + Zod
- Type-safe API integration

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + ShadCN UI
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React

## Quick Start

1. **Clone and install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your backend URL
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Vehicle Tracker
```

## Demo Credentials

- **Admin**: admin@example.com / password123
- **User**: user@example.com / password123

## Deployment

### Docker

```bash
# Build image
docker build -t vehicle-tracker-frontend .

# Run container
docker run -p 80:80 vehicle-tracker-frontend
```

### Docker Compose

```bash
docker-compose up --build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── layout/         # Layout components
│   └── common/         # Common components
├── pages/              # Page components
├── hooks/              # Custom hooks
├── lib/                # Utilities & configurations
├── store/              # Zustand stores
├── types/              # TypeScript types
├── services/           # API services
└── App.tsx
```

## Key Features Implementation

### Authentication Flow

- JWT tokens stored in Zustand store
- Automatic token refresh on API calls
- Protected routes with role-based access

### Vehicle Management

- Real-time vehicle status tracking
- Pagination and search functionality
- Detailed vehicle status history by date

### Reports System

- Interactive report filters
- Excel report generation
- Real-time report preview

### Responsive Design

- Mobile-first approach with TailwindCSS
- Modern UI components from ShadCN
- Consistent design system

## Integration with Backend

This frontend is designed to work seamlessly with the Vehicle Tracker backend API. It handles:

- Authentication via `/auth` endpoints
- Vehicle data via `/vehicles` endpoints
- User management via `/users` endpoints (admin only)
- Report generation via `/reports` endpoints

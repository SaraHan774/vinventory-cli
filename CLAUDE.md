# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vinventory is a wine inventory management system with a multi-client architecture. The project recently migrated from a dual-API structure (Supabase + SQLite) to a unified API-first architecture supporting multiple clients (Web, Mobile, CLI, Desktop) through a single TypeScript Express backend with Supabase PostgreSQL.

## Architecture

### Multi-Client Architecture
```
Frontend (React) ──┐
Mobile App ────────┼──→ Backend API (TypeScript/Express) ──→ Supabase PostgreSQL
CLI (Kotlin) ──────┤    - REST + WebSocket
Desktop App ───────┘    - Business Logic
                        - Realtime Features
```

### Module Structure
- **backend/**: TypeScript Express API server with Supabase integration (port 8590)
- **frontend/**: React + Vite web application (port 5174)
- **cli/**: Kotlin command-line interface application
- **shared/**: Common domain models (Kotlin) used across modules

### Key Components

**Backend (TypeScript/Express)**
- Entry point: `backend/src/index.ts`
- Routes: `backend/src/routes/wineRoutes.ts` (route definitions)
- Controllers: `backend/src/controllers/wineController.ts` (HTTP request/response handling)
- Services: `backend/src/services/wineService.ts` (business logic)
- Errors: `backend/src/errors/HttpErrors.ts` (custom error classes)
- Middleware: `backend/src/middleware/validation.ts` (Zod validation), `errorHandler.ts` (error handling)
- Utils: `backend/src/utils/responseUtils.ts` (response formatting)
- Database: Supabase PostgreSQL (configured in `backend/src/config/supabase.ts`)
- API versioning: `/api/v1/*` endpoints
- Architecture: Clean layered pattern (Routes → Controllers → Services → Database)

**Frontend (React)**
- Entry point: `frontend/src/main.tsx`
- Router: `frontend/src/App.tsx`
- API client: `frontend/src/lib/api.ts`
- State management: React Query (@tanstack/react-query)
- UI: Material-UI with custom wine theme

**CLI (Kotlin)**
- Entry point: `cli/src/main/kotlin/Main.kt`
- API client: `cli/src/main/kotlin/api/WineApiClient.kt` (Ktor client)
- DI: Koin (`cli/src/main/kotlin/di/AppModule.kt`)
- Architecture: Service layer with error handling

## Development Commands

### Backend (TypeScript/Express)
```bash
cd backend
npm install           # Install dependencies
npm run dev          # Run development server with watch mode (tsx)
npm run build        # Build TypeScript to JavaScript
npm start            # Run production server
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Frontend (React)
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Run Vite dev server (http://localhost:5174)
npm run build        # Build for production (TypeScript + Vite)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### CLI (Kotlin)
```bash
cd cli
./gradlew run        # Run CLI application
./gradlew build      # Build JAR
./gradlew test       # Run tests
./gradlew jar        # Create executable JAR
```

### Multi-Module (Gradle)
```bash
./gradlew build      # Build all modules
./gradlew clean      # Clean all build artifacts
./gradlew test       # Run all tests
```

## Environment Configuration

### Backend (.env)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=8590
NODE_ENV=development
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8590
```

### CLI (environment variables)
```bash
API_BASE_URL=http://localhost:8590
```

## Testing

### Backend Tests
- Located in `backend/src/__tests__/`
- Framework: Jest with TypeScript (ts-jest)
- Mock setup: `backend/src/__tests__/setup.ts`
- Supabase mocks: `backend/src/__tests__/mocks/supabaseMock.ts`
- Route tests: 22/22 passing in `backend/src/__tests__/routes/wineRoutes.test.ts`
- **Important**: Test setup must include `errorHandler` middleware for proper error response testing
  ```typescript
  app.use('/api/v1/wines', wineRoutes);
  app.use(errorHandler);
  ```

### CLI Tests
- Located in `cli/src/test/kotlin/`
- Framework: JUnit 5 with MockK
- Run with: `./gradlew test` from cli directory

## API Endpoints

Base URL: `http://localhost:8590/api/v1`

### Health & Info
- `GET /health` - Health check with database status
- `GET /api` - API information and endpoints

### Wines
- `GET /wines` - Get all wines (supports query parameters for filtering)
- `GET /wines/:id` - Get wine by ID
- `POST /wines` - Create new wine
- `PUT /wines/:id` - Update wine
- `DELETE /wines/:id` - Delete wine
- `PUT /wines/:id/quantity` - Update wine quantity
- `GET /wines/alerts/low-stock?threshold=5` - Get low stock wines

## Backend Architecture Pattern

The backend follows a clean architecture pattern with clear separation of concerns:

### Layer Structure
```
Routes (87 lines)
  ↓ Route definitions only
Validation Middleware
  ↓ Zod schema validation
Controllers
  ↓ HTTP request/response handling
Services
  ↓ Business logic
Custom Errors
  ↓ Type-safe error handling
Error Handler
  ↓ Consistent error responses
Database (Supabase)
```

### Key Files and Responsibilities

**Routes** (`backend/src/routes/wineRoutes.ts`)
- Define API endpoints with HTTP methods
- Apply validation middleware
- Delegate to controllers via `asyncHandler`
- **Important**: Specific routes (e.g., `/alerts/low-stock`) must come BEFORE dynamic parameter routes (e.g., `/:id`)

**Controllers** (`backend/src/controllers/wineController.ts`)
- Handle HTTP-specific concerns (req/res/next)
- Extract and validate request data
- Call service methods
- Use response utilities for consistent formatting
- Propagate errors to error handler

**Services** (`backend/src/services/wineService.ts`)
- Implement business logic
- Interact with database
- Throw custom errors (NotFoundError, InternalServerError)
- No HTTP concerns

**Custom Errors** (`backend/src/errors/HttpErrors.ts`)
- `HttpError` - Base class with status code
- `NotFoundError` - 404 errors
- `ValidationError` - 400 validation errors
- `BadRequestError` - 400 bad request
- `ConflictError` - 409 conflict
- `InternalServerError` - 500 internal errors

**Validation Middleware** (`backend/src/middleware/validation.ts`)
- Factory function to create validation middleware
- Uses Zod schemas for type-safe validation
- Validates request body, params, or query
- Throws ValidationError on failure
- Pre-defined schemas: `createWineSchema`, `updateWineSchema`, `wineIdSchema`, `lowStockQuerySchema`

**Response Utilities** (`backend/src/utils/responseUtils.ts`)
- `sendSuccess(res, data, message, status)` - Standard success response
- `sendCreated(res, data, message)` - 201 Created response
- `sendError(res, status, code, message)` - Error response
- Ensures consistent API response format across all endpoints

**Error Handler** (`backend/src/middleware/errorHandler.ts`)
- Global error handler for all uncaught errors
- Detects custom HttpError instances and extracts status/code
- Falls back to message-based inference for generic Error objects
- Shows error details in development/test environments
- Returns generic message in production for 500 errors

### Benefits of This Pattern
- **Less Code**: Eliminated ~200 lines of repetitive error handling
- **Type Safety**: Custom error classes with proper HTTP status codes
- **Consistency**: All responses follow the same format
- **Maintainability**: Changes in one place affect all routes
- **Testability**: Controllers and middleware can be unit tested
- **Bug Prevention**: Fixed critical route ordering issue

## Important Implementation Details

### Data Models
The `Wine` domain model is defined in `shared/src/main/kotlin/com/august/domain/model/Wine.kt` with these fields:
- `id`: String (UUID)
- `name`: String
- `countryCode`: String (e.g., "KR", "FR", "IT")
- `vintage`: Int (year)
- `price`: Double
- `quantity`: Int
- `createdAt`, `updatedAt`: String (nullable timestamps)

### Database
- **Table name**: `wines` in Supabase PostgreSQL
- The backend uses Supabase JS client for all database operations
- No ORM - direct Supabase client usage in service layer

### API Client Headers
All clients send identifying headers:
- `X-Client-Type`: "web" | "cli" | "mobile"
- `X-Client-Version`: Current version number

### Error Handling

**Backend:**
- Custom error classes in `backend/src/errors/HttpErrors.ts`:
  - `HttpError` - Base class with statusCode and errorCode
  - `NotFoundError` (404), `ValidationError` (400), `BadRequestError` (400)
  - `ConflictError` (409), `InternalServerError` (500)
- Services throw custom errors instead of generic Error objects
- Global error handler in `backend/src/middleware/errorHandler.ts`:
  - Catches all errors and converts to consistent API responses
  - Detects HttpError instances and extracts status/code
  - Falls back to message-based inference for legacy errors
  - Shows details in dev/test, generic message in production
- Validation middleware in `backend/src/middleware/validation.ts`:
  - Uses Zod schemas for type-safe validation
  - Automatically validates request body, params, or query
  - Throws ValidationError with formatted error messages

**CLI:**
- `InventoryServiceErrorHandler` with `ConsoleAlertService`

**Frontend:**
- React Query error boundaries with Material-UI Snackbar

### CORS Configuration
Backend CORS is configured to allow requests from frontend (default: `http://localhost:5174`). Update `FRONTEND_URL` environment variable for different origins.

## Migration Context

The project recently migrated from:
- **Before**: Frontend → Supabase (direct), Backend → SQLite, CLI → Local services
- **After**: All clients → TypeScript Backend API → Supabase PostgreSQL

See `ARCHITECTURE_MIGRATION.md` for complete migration details. Many files in the git status show deletions of old SQLite-based repository implementations (v1) in favor of the new API client approach (v2).

## Tech Stack

- **Backend**: TypeScript, Express, Supabase JS Client, Jest
- **Frontend**: React, TypeScript, Vite, Material-UI, React Query, Axios
- **CLI**: Kotlin, Ktor Client, Koin (DI), Kotlinx Serialization
- **Database**: Supabase PostgreSQL with Realtime features
- **Build Tools**: Gradle (multi-module), npm/pnpm, Vite

## JVM Configuration

- **Kotlin version**: 2.0.20
- **JVM target**: 17
- **Java toolchain**: 17
- Configured in root `build.gradle.kts` with consistent settings across all subprojects

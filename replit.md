# PiMaint - Raspberry Pi Management Suite

## Overview

PiMaint is a comprehensive web-based management suite for Raspberry Pi systems. It provides a centralized dashboard for monitoring system health, managing modular bash scripts, and automating routine maintenance tasks. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and WebSocket connections for real-time updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket client for live updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: WebSocket server for bidirectional communication
- **Session Storage**: In-memory storage with planned database persistence

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with schema-first approach
- **Session Storage**: Currently using in-memory storage (MemStorage class)
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Key Components

### Database Schema
The application uses four main tables:
- **modules**: Stores bash script modules with metadata (name, category, description, script content)
- **executions**: Tracks module execution history with status and output
- **systemMetrics**: Records system performance data (CPU, memory, storage, temperature)
- **activities**: Logs system activities and events

### Core Modules
- **Module Management**: CRUD operations for bash script modules
- **Execution Engine**: WebSocket-based module execution with real-time output
- **System Monitoring**: Real-time system metrics collection and display
- **Activity Logging**: Comprehensive activity tracking and history

### UI Components
- **Dashboard**: Main interface showing system overview and metrics
- **Sidebar Navigation**: Category-based module organization
- **Module Cards**: Interactive cards for different module categories (System, Security, Network)
- **Terminal Modal**: Real-time execution output display
- **System Metrics**: Visual system health indicators

## Data Flow

### Module Execution Flow
1. User clicks "Run" on a module card
2. Frontend opens terminal modal and sends WebSocket message
3. Backend receives execution request and creates execution record
4. Module script is executed with real-time output streaming
5. WebSocket sends progress updates to frontend
6. Execution completion triggers database update and client notification

### System Metrics Flow
1. Backend periodically collects system metrics
2. Metrics are stored in database and broadcast via WebSocket
3. Frontend receives real-time updates and updates UI components
4. Dashboard displays current system status and historical data

### Real-time Communication
- WebSocket connection established on client load
- Bidirectional communication for module execution and system updates
- Message types: execution-started, output, execution-completed, metrics-update, error

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Libraries**: Radix UI primitives, Tailwind CSS, Lucide React icons
- **State Management**: TanStack Query for server state
- **Development**: Vite, TypeScript, PostCSS, Autoprefixer

### Backend Dependencies
- **Core**: Express.js, WebSocket (ws), TypeScript
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple
- **Utilities**: date-fns, nanoid, zod for validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Build Tools
- **Vite**: Frontend build tool with HMR and optimizations
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Production backend bundling
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Neon Database (serverless PostgreSQL)
- **WebSocket**: Integrated with Express server

### Production Build
- **Frontend**: Vite build to `dist/public` directory
- **Backend**: ESBuild bundle to `dist/index.js`
- **Static Serving**: Express serves built frontend files
- **Database**: Production PostgreSQL via DATABASE_URL environment variable

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection (development/production)
- **REPL_ID**: Replit-specific configuration for development features

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack while maintaining clear separation between frontend and backend concerns.
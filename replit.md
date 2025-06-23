# Discord Emoji Hub

## Overview

Discord Emoji Hub is a full-stack web application designed for sharing, discovering, and managing Discord emojis. The platform provides a community-driven ecosystem where users can upload, browse, like, and download high-quality emoji files optimized for Discord usage.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and caching
- **UI Components**: Radix UI primitives with Tailwind CSS styling (shadcn/ui design system)
- **Styling**: Tailwind CSS with custom Discord-themed color palette
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Upload**: Multer middleware for handling multipart form data
- **WebSocket**: Native WebSocket server for real-time updates
- **Rate Limiting**: In-memory rate limiting for uploads and likes

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Storage**: Local filesystem storage in `/storage` directory
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Database Schema
- **Emojis Table**: Stores emoji metadata including ID, name, file information, dimensions, categories, tags, likes, downloads, and timestamps
- **Schema Validation**: Zod schemas for runtime type validation and API request/response validation

### API Endpoints
- `GET /api/stats` - Platform statistics (total emojis, downloads, likes)
- `GET /api/emojis` - List emojis with filtering, pagination, and sorting
- `POST /api/emojis` - Upload new emoji with metadata
- `PUT /api/emojis/:id/like` - Increment emoji likes
- `PUT /api/emojis/:id/download` - Increment download count and serve file
- `GET /api/emoji/:id/file` - Serve emoji file
- `DELETE /api/emojis/:id` - Delete emoji (admin functionality)

### Real-time Features
- WebSocket connection for live statistics updates
- Automatic reconnection with exponential backoff
- Live updates for likes, downloads, and new uploads

### File Upload System
- Support for PNG, GIF, and APNG formats
- File size limit of 256KB
- Automatic image dimension detection
- Unique 6-digit zero-padded ID generation
- Drag-and-drop interface with progress tracking

## Data Flow

1. **Upload Flow**: Client uploads emoji → Multer processes file → Validation → Database insertion → File system storage → WebSocket broadcast
2. **Browse Flow**: Client requests emojis → Database query with filters → Response with pagination → Client caching via TanStack Query
3. **Interaction Flow**: Like/Download actions → Rate limiting check → Database update → WebSocket broadcast → Client state update

## External Dependencies

### Core Dependencies
- **Database**: `@neondatabase/serverless` for Neon Database connectivity
- **ORM**: `drizzle-orm` and `drizzle-zod` for database operations and validation
- **UI Library**: Extensive Radix UI component collection for accessible components
- **File Processing**: `multer` for file uploads
- **Session Management**: `connect-pg-simple` for PostgreSQL session storage

### Development Tools
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Quality**: ESBuild for production bundling
- **Development Experience**: Replit integration with runtime error overlay

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: ESBuild bundles Node.js server to `dist/index.js`
- Static Assets: Express serves built frontend from production build

### Environment Configuration
- **Development**: Vite dev server with Express API proxy
- **Production**: Single Express server serving both API and static files
- **Database**: Environment variable `DATABASE_URL` for connection string

### Replit Integration
- Configured for Node.js 20 runtime with PostgreSQL 16
- Automatic deployment with build and start scripts
- WebSocket support through configured ports

## Changelog
- June 22, 2025. Initial setup
- June 22, 2025. Fixed Browse page SelectItem errors, removed GitHub stats from Info page, created full JavaScript and Python SDKs

## User Preferences

Preferred communication style: Simple, everyday language.
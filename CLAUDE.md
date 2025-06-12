# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React frontend application built with Vite, TypeScript, and modern tooling. The project uses several key libraries for UI components and functionality:

- **Build System**: Vite with TypeScript
- **Package Manager**: pnpm (uses pnpm-lock.yaml)
- **UI Framework**: React 19 with TypeScript
- **Styling**: TailwindCSS (configured via @tailwindcss/postcss)
- **Icons**: Tabler Icons and Lucide React
- **Routing**: TanStack Router
- **Tables**: TanStack React Table
- **Charts**: Recharts  
- **Drag & Drop**: DND Kit
- **Form Validation**: Zod
- **Notifications**: Sonner
- **Theming**: next-themes
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## Common Commands

### Development
- `pnpm dev` - Start development server with HMR
- `pnpm build` - Build for production (runs TypeScript check then Vite build)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint on all files

### Package Management
- Use `pnpm` instead of npm for all package operations
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add dependency
- `pnpm add -D <package>` - Add dev dependency

## Architecture Notes

### TypeScript Configuration
- Uses composite TypeScript setup with separate configs:
  - `tsconfig.json` - Root config with project references
  - `tsconfig.app.json` - App-specific TypeScript config
  - `tsconfig.node.json` - Node/build tooling config

### ESLint Configuration
- Modern flat config format in `eslint.config.js`
- Configured for React with hooks and refresh plugins
- TypeScript-aware linting enabled

### Build System
- Vite for fast development and building
- React plugin configured for JSX support
- TypeScript compilation happens before Vite build

### Component Architecture
Based on the dependencies, this appears to be set up for:
- Modern React patterns (hooks, function components)
- Accessible UI components (Radix UI primitives)
- Responsive design with TailwindCSS
- Data visualization with charts
- Interactive features (drag-and-drop, data tables)

## Key File Locations
- Main app entry: `src/main.tsx`
- Root route: `src/routes/__root.tsx`
- Global styles: `src/styles.css`
- Type definitions: `src/vite-env.d.ts`
- Components: `src/components/` (UI components in `src/components/ui/`)
- Routes: `src/routes/` (file-based routing)

## Current Migration Status

### ✅ Completed
- TanStack Router setup with file-based routing
- shadcn/ui component library configured
- Basic application layout with sidebar navigation
- Core routes created: `/dashboard`, `/evidence`, `/exceptions`, `/workpapers`, `/controls`
- Root route redirects from `/` to `/dashboard`

### 🔄 In Progress  
- Migrating existing UI components and pages
- Adding data management and content

### 📋 Routes Structure
- `/` - Redirects to `/dashboard`
- `/dashboard` - Main dashboard with overview cards
- `/evidence` - Evidence management
- `/exceptions` - Exception tracking  
- `/workpapers` - Workpaper management
- `/controls` - Control management

## Development Notes
- Uses file-based routing (routes defined in `src/routes/`)
- TanStack Router automatically generates route tree
- Sidebar navigation implemented with shadcn/ui sidebar component
- Home route (/) redirects to dashboard for better UX
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Authentication**: better-auth with email/password and GitHub OAuth
- **Database**: PostgreSQL with Prisma ORM (using pg adapter)
- **Package Manager**: pnpm (always use pnpm, never npm)

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Database operations
pnpm prisma generate        # Generate Prisma client after schema changes
pnpm prisma migrate dev     # Create and apply migrations in dev
pnpm prisma migrate deploy  # Apply migrations in production
pnpm prisma studio          # Open Prisma Studio GUI
```

## Architecture Overview

### Prisma Configuration (Custom Output Path)

**CRITICAL**: This project uses a non-standard Prisma setup where the client is generated to `app/generated/prisma` instead of the default `node_modules/.prisma/client`.

- **Schema location**: `prisma/schema.prisma`
- **Generated client output**: `app/generated/prisma` (see `output` in schema)
- **Import pattern**: Always use `@/app/generated/prisma/client` for Prisma imports
- **Prisma singleton**: Use `@/lib/prisma` for the pre-configured client instance

After any schema changes, you MUST run `pnpm prisma generate` to regenerate the client in the correct location.

### Authentication Architecture

The app uses **better-auth** with a dual-configuration pattern:

1. **Server-side config** (`lib/auth.ts`):
   - Exports the `auth` instance used in API routes
   - Configured with Prisma adapter using the PostgreSQL database
   - Supports email/password and GitHub OAuth
   - Requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` env vars

2. **Client-side config** (`lib/auth-client.ts`):
   - Exports React hooks and auth methods (`signIn`, `signUp`, `useSession`)
   - Points to `baseURL: "http://localhost:3000"` (update for production)
   - Used in client components for authentication UI

3. **API route** (`app/api/auth/[...all]/route.ts`):
   - Catch-all route handler that processes all auth requests
   - Uses `toNextJsHandler` to expose better-auth as Next.js route handlers

### Path Aliases

- `@/*` maps to project root (configured in `tsconfig.json`)
- Example: `@/lib/prisma`, `@/components/ui/button`

### Directory Structure

```
app/
├── api/auth/[...all]/     # Better-auth API routes
├── generated/prisma/      # Prisma client output (gitignored)
├── layout.tsx             # Root layout with providers
├── page.tsx               # Homepage
└── globals.css            # Global styles with Tailwind

lib/
├── auth.ts                # Server-side auth config
├── auth-client.ts         # Client-side auth hooks
├── prisma.ts              # Prisma singleton with pg adapter
└── utils.ts               # Utility functions (cn, etc.)

components/
├── ui/                    # shadcn/ui components
├── header.tsx             # Site header component
├── theme-provider.tsx     # Next-themes provider
└── toggle-button.tsx      # Theme toggle component

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Migration files
└── prisma.config.ts       # Prisma configuration with DATABASE_URL
```

## Database Schema

The app uses a better-auth compatible schema with four tables:
- `User`: Core user data with email verification
- `Session`: User sessions with tokens and metadata (IP, user agent)
- `Account`: OAuth accounts and credentials (supports multiple providers per user)
- `Verification`: Email verification tokens and expiry

All tables use cascading deletes for data integrity (sessions/accounts delete when user is deleted).

## Environment Variables Required

```bash
DATABASE_URL="postgresql://..."      # PostgreSQL connection string
GITHUB_CLIENT_ID="..."              # For GitHub OAuth
GITHUB_CLIENT_SECRET="..."          # For GitHub OAuth
```

## Important Notes

- Always use `pnpm` instead of npm for package management
- The Prisma client is NOT in node_modules - it's in `app/generated/prisma`
- After schema changes: `pnpm prisma generate` then `pnpm prisma migrate dev`
- Client components need "use client" directive when using auth hooks
- Update `lib/auth-client.ts` baseURL for production deployment

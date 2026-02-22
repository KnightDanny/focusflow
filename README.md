# FocusFlow

A productivity app for focused work and study — Pomodoro timer, task management, and analytics.

Built with Next.js 15, Tailwind CSS, Prisma, and Auth.js.

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Google OAuth credentials

# Run database migration
npx prisma migrate dev

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/api/auth/callback/google` as authorized redirect URI
6. Copy the Client ID and Client Secret to `.env.local`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Auth.js v5 (Google OAuth)
- **Database**: Prisma + SQLite (dev) / PostgreSQL (prod)
- **State**: Zustand
- **Icons**: Lucide React
- **Notifications**: Sonner

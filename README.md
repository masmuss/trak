# trak

Ticketing & reporting platform with Telegram bot integration.

## Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) (Runes mode)
- **Database**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- **Auth**: [Better Auth](https://www.better-auth.com)
- **UI**: [shadcn-svelte](https://shadcn-svelte.com) + Tailwind CSS v4
- **Package Manager**: pnpm 11
- **Monorepo**: Turborepo + pnpm workspaces

## Struktur

```
trak/
├── apps/
│   ├── web/          # SvelteKit app (ticketing portal)
│   └── bot/          # Telegram bot (WIP)
├── packages/
│   ├── database/     # Drizzle schema, migrations, client
│   └── shared/       # Types, constants bersama
├── docs/decisions/   # Architecture Decision Records
└── ...
```

## Prasyarat

- Node.js >= 22
- pnpm 11
- PostgreSQL (via Docker atau lokal)

## Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp apps/web/.env.example apps/web/.env

# Push database schema
pnpm db:push

# (Opsional) Seed data
pnpm db:seed

# Start development
pnpm dev
```

## Scripts

| Script             | Description                               |
| ------------------ | ----------------------------------------- |
| `pnpm dev`         | Start semua workspace di dev mode         |
| `pnpm build`       | Build semua workspace                     |
| `pnpm preview`     | Preview production build (web)            |
| `pnpm lint`        | Lint semua workspace via turbo            |
| `pnpm check`       | Type check semua workspace (svelte-check) |
| `pnpm test:unit`   | Unit test (vitest)                        |
| `pnpm test:e2e`    | E2E test (Playwright)                     |
| `pnpm format`      | Format semua file dengan prettier         |
| `pnpm db:push`     | Push schema ke database                   |
| `pnpm db:generate` | Generate migration files                  |
| `pnpm db:migrate`  | Apply migration                           |
| `pnpm db:studio`   | Buka Drizzle Studio                       |
| `pnpm db:seed`     | Seed database                             |

## Environment Variables (`apps/web/.env`)

```env
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
ORIGIN=http://localhost:5173
BETTER_AUTH_SECRET=<your-secret>
```

## Keputusan Arsitektur

Lihat [docs/decisions/monorepo.md](docs/decisions/monorepo.md) untuk penjelasan kenapa pake monorepo + turborepo.

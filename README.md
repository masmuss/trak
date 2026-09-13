# trak

Ticketing & reporting platform with Telegram bot integration.

## Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) (Runes mode)
- **Database**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- **Auth**: [Better Auth](https://www.better-auth.com)
- **UI**: [shadcn-svelte](https://shadcn-svelte.com) + Tailwind CSS v4
- **Bot**: [grammY](https://grammy.dev)
- **Storage**: MinIO (S3-compatible) for attachments
- **Test**: Vitest (unit) + Playwright (e2e)
- **Package Manager**: pnpm 11
- **Monorepo**: Turborepo + pnpm workspaces

## Arsitektur

```mermaid
graph TB
  subgraph User
    A["👤 Agent (Web)"]
    B["📱 Pelapor (Telegram)"]
  end

  subgraph Apps
    C["🌐 apps/web<br/>SvelteKit Portal"]
    D["🤖 apps/bot<br/>Telegram Bot"]
  end

  subgraph Packages
    E["📦 @trak/services<br/>Domain Logic"]
    F["🗄️ @trak/database<br/>Schema + Client"]
    G["🔷 @trak/shared<br/>Types"]
  end

  subgraph Infrastructure
    H["🐘 PostgreSQL<br/>bot_sessions + notifications"]
    I["🪣 MinIO (S3)<br/>attachments"]
  end

  A -->|"HTTPS"| C
  B -->|"Telegram API"| D

  C --> E
  D --> E
  E --> F
  F --> H
  D --> H

  C --> G
  E --> G

  C -->|"proxy"| I
  D -->|"fileId only"| B

  H -.->|"LISTEN/NOTIFY"| D

  linkStyle 0,1 stroke:#666
```

**Alur Data:**

```mermaid
sequenceDiagram
    actor P as Pelapor (Telegram)
    participant B as apps/bot
    participant S as @trak/services
    participant D as PostgreSQL
    participant W as apps/web

    Note over P,W: Registrasi
    P->>B: /start
    B->>S: validateInviteCode(code)
    S->>D: cek invite_codes
    D-->>S: valid
    S-->>B: { valid, inviteCodeId }
    B->>S: createReporter(telegramId, inviteCodeId)
    S->>D: insert reporters
    B-->>P: ✅ Selamat datang

    Note over P,W: Laporan
    P->>B: /report → title → body → kategori → lampiran
    B->>S: submitReportWithAttachments(input + attachments)
    S->>D: tx: insert reports + report_attachments + audit (ticket.created)
    B-->>P: ✅ Laporan terkirim (TKT-XXXX)

    Note over P,W: Update Status + Notifikasi
    W->>S: updateTicketStatus(id, newStatus, actor)
    S->>D: tx: update reports + insert status_histories + audit (ticket.status_changed)
    W->>S: createNotification(reporterTelegramId, message)
    S->>D: insert notifications
    Note over S: pg_notify('notifications', payload)
    S-->>D: SELECT pg_notify(...)
    D-->>B: 🔔 LISTEN notifications
    B->>S: markNotificationRead(notificationId)
    S->>D: update notifications set is_read = true
    B-->>P: 🔄 Status tiket diperbarui
```

## Struktur

```
trak/
├── apps/
│   ├── web/          # SvelteKit portal (agent dashboard)
│   └── bot/          # Telegram bot (pelapor)
├── packages/
│   ├── database/     # Drizzle schema, migrations, client
│   ├── services/     # Domain logic layer (shared across apps) + vitest suites
│   └── shared/       # Browser-safe literals + server types
├── .env              # Global DATABASE_URL
└── ...
```

## Prasyarat

- Node.js >= 24
- pnpm 11
- PostgreSQL + MinIO (via Docker: `docker compose up -d`)

## Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
cp apps/bot/.env.example apps/bot/.env

# Start infra (PostgreSQL + MinIO)
docker compose up -d

# Push database schema
pnpm db:push

# (Opsional) Seed data
pnpm db:seed

# Start development (web + bot)
pnpm dev
```

## Scripts

| Script                              | Description                               |
| ----------------------------------- | ----------------------------------------- |
| `pnpm dev`                          | Start semua workspace di dev mode         |
| `pnpm build`                        | Build semua workspace                     |
| `pnpm preview`                      | Preview production build (web)            |
| `pnpm lint`                         | Lint semua workspace via turbo            |
| `pnpm check`                        | Type check semua workspace (svelte-check) |
| `pnpm test:unit`                    | Unit test web (vitest)                    |
| `pnpm test:e2e`                     | E2E test (Playwright)                     |
| `pnpm --filter @trak/services test` | Service tests vs `trak_test` (vitest)     |
| `pnpm format`                       | Format semua file dengan prettier         |
| `pnpm db:push`                      | Push schema ke database                   |
| `pnpm db:generate`                  | Generate migration files                  |
| `pnpm db:migrate`                   | Apply migration                           |
| `pnpm db:studio`                    | Buka Drizzle Studio                       |
| `pnpm db:seed`                      | Seed database                             |

## Testing

Service tests (`packages/services`, vitest) run against a real PostgreSQL
database — never mocks for queries:

```bash
# 1. Create + schema-push the test database once
docker exec <pg-container> psql -U root -d local -c "CREATE DATABASE trak_test"
# apply uuid_generate_v7() first (see drizzle/0005_*.sql header), then:
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/trak_test" \
  pnpm --filter @trak/database exec drizzle-kit push --force

# 2. Run (DATABASE_URL_TEST overrides, else derives trak_test from DATABASE_URL)
pnpm --filter @trak/services test
```

Test files share one database, so they run sequentially
(`fileParallelism: false`) with per-test TRUNCATE.

Web unit tests (`apps/web`, vitest) include the Telegram proxy
(`$lib/server/telegram.ts`, mocked fetch) and the MinIO roundtrip
(`$lib/server/storage.spec.ts`) — MinIO must be up (`docker compose up -d`).

E2E (`apps/web/e2e`, Playwright) needs seeded local DB (`pnpm db:seed`,
login `admin@trak.id` / `adminpassword123`):

```bash
pnpm --filter @trak/web exec playwright test
```

## Environment Variables

Root `.env` (dibaca oleh semua apps):

```env
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
TELEGRAM_BOT_TOKEN=<your-bot-token>

MINIO_ROOT_USER=trak
MINIO_ROOT_PASSWORD=trak-local-password
MINIO_ENDPOINT=http://localhost:9000
MINIO_BUCKET=attachments
MINIO_REGION=us-east-1
```

`apps/web/.env`:

```env
ORIGIN=http://localhost:5173
BETTER_AUTH_SECRET=<your-secret>
```

`TELEGRAM_BOT_TOKEN` is required by both the bot and the authenticated web
attachment proxy. Keep it server-side in the root `.env`; it is never exposed
to the browser.

`apps/bot/.env`:

```env

```

# trak

Ticketing & reporting platform with Telegram bot integration.

## Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) (Runes mode)
- **Database**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- **Auth**: [Better Auth](https://www.better-auth.com)
- **UI**: [shadcn-svelte](https://shadcn-svelte.com) + Tailwind CSS v4
- **Bot**: [grammY](https://grammy.dev)
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
    B->>S: createReport(reporterId, title, body, categoryId)
    S->>D: insert reports
    B->>S: addReportAttachment(fileId, storageUrl)
    S->>D: insert report_attachments
    B-->>P: ✅ Laporan terkirim (TKT-XXXX)

    Note over P,W: Update Status + Notifikasi
    W->>S: updateTicketStatus(id, newStatus, userId)
    S->>D: update reports + insert status_histories
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
│   ├── services/     # Domain logic layer (shared across apps)
│   └── shared/       # Types, constants
├── .env              # Global DATABASE_URL
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
cp .env.example .env
cp apps/bot/.env.example apps/bot/.env

# Push database schema
pnpm db:push

# (Opsional) Seed data
pnpm db:seed

# Start development (web + bot)
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

## Environment Variables

Root `.env` (dibaca oleh semua apps):

```env
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
```

`apps/web/.env`:

```env
ORIGIN=http://localhost:5173
BETTER_AUTH_SECRET=<your-secret>
```

`apps/bot/.env`:

```env
TELEGRAM_BOT_TOKEN=<your-bot-token>
```

## Keputusan Arsitektur

Lihat [docs/decisions/monorepo.md](docs/decisions/monorepo.md) untuk penjelasan kenapa pake monorepo + turborepo.

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, vitest, playwright, tailwindcss, drizzle, mcp, eslint

---

## Goal

- Provide Telegram bot for end-to-end report creation + agent panel for ticket management via `@trak/services`.

## Constraints & Preferences

- Bot uses `@trak/services`, never imports `@trak/database` directly (except session adapter + listen from `@trak/database` package).
- All database interaction goes through `@trak/services`.
- Bot uses grammY framework with PostgreSQL session middleware.
- Notifications use PostgreSQL LISTEN/NOTIFY, not polling.
- Single source of truth for `DATABASE_URL` in root `.env`.
- Priority set by agent (panel), not reporter (bot).
- SLA deadlines auto-calculated from priority.

## Progress

### Done

- Created `packages/services/` with 7 domain modules: `category.service`, `user.service`, `account.service`, `report.service`, `invite-code.service`, `reporter.service`, `dashboard.service`, plus `notification.service`.
- Refactored all web app routes to use `@trak/services` — zero direct `@trak/database` imports.
- Replaced `window.confirm()` with `AlertDialog` (`bind:open` pattern) in 4 components.
- Added shadcn-svelte `Switch` component; replaced Active/Inactive badges with toggle in categories list.
- Removed `/categories` nav item from sidebar.
- Built complete `@trak/bot` app with grammY: invite-gated registration (`/start`), `/report` conversation flow (title → body → category → attachments → confirm), `/status`, `/help`.
- Post-submit action buttons: `📝 Buat laporan baru` + `📋 Perintah`.
- Attachment saved to DB via `addReportAttachment`.
- **`ticket_code` column** (`varchar(20) not null unique`) added to `reports`, migration 0003–0004. `createReport` auto-generates `TKT-XXXXXXXX`. `getTicketByTicketCode` queries column directly, not UUID prefix LIKE.
- **`/status` response enriched** — body, attachment count, updatedAt, full status history timeline.
- **PR #23 merged** to `main` (feat/ticket-code → main).
- **UUID v4 → UUID v7** migration (0005): `uuid_generate_v7()` PostgreSQL function with `pgcrypto`. All 7 PK columns use time-ordered UUIDs. Bug fixed: `((timestamp_ms >> N) & 255)::INT` mask-before-cast prevents integer overflow.
- **Priority + SLA columns** added to `reports` (migration 0006): `priority` enum (LOW/MEDIUM/HIGH/CRITICAL), `slaResponseDue`, `slaResolveDue`, `firstRespondedAt`, `resolvedAt`, `isSlaBreached`.
- `calculateSLA(priority)` function in `report.service.ts` — returns responseDue + resolveDue deadlines.
- Migration 0005–0006 applied to DB (reset + migrate + seed). `pnpm db:seed` works.
- Root `db:seed` script fixed: uses `pnpm --filter @trak/web db:seed` with `--env-file=../../.env`.
- PostgreSQL session storage — `bot_sessions` table with `key` + `jsonb`, `createPgSessionAdapter<T>()` in `@trak/database`.
- README updated with mermaid architecture graph + sequence diagram.
- **Priority management system**: `updateTicketPriority`, `checkSlaBreach` services; `PriorityBadge` component with color-coded icons (CRITICAL=red/WarningCircle, HIGH=orange/Warning, MEDIUM=yellow/Circle, LOW=slate/Flag); priority column in tickets table; priority form in detail view with SLA deadline display and breach indicator; priority change notifications.
- **SLA recalculated on priority change** from ticket's `createdAt`, not current time. `checkSlaBreach` side-effect updates `isSlaBreached` column.

### Blocked

- _(none)_

## Key Decisions

- External `packages/services` over `lib/services`: bot imports same package without touching web app, no circular dependency.
- Services import `db` singleton directly (not injected).
- Route-level validation stays in route files — services handle only database operations.
- `bind:open` pattern for AlertDialog instead of controlled `open` prop.
- Reply keyboard buttons use emoji labels instead of slash commands.
- **PostgreSQL LISTEN/NOTIFY** over polling: real-time, zero infra, using existing DB connection.
- **PostgreSQL session storage** over file/redis: zero new infra, survive restart, scale to N instances.
- Prefix for ticket code: `TKT-` (12 chars total, `varchar(20)`).
- **UUID v7 over UUID v4**: time-ordered reduces B-Tree page fragmentation, better write performance.
- **Priority set by agent, not reporter**: default MEDIUM on create, agent adjusts via panel.
- **SLA deadlines on priority change**: recalculated from ticket `createdAt` each update.
- **Function `uuid_generate_v7()` in PostgreSQL** (not app-level): transparent to Drizzle, no code changes needed for existing inserts.

## Next Steps

1. Add filter-by-priority in ticket list (agent panel).
2. Wire `lastActivityAt` trigger or cron for stale ticket detection.
3. Show SLA warning colors in ticket list (green/yellow/red based on deadline proximity).
4. Migrate bot back to main.

## Critical Context

- Project uses `pnpm`, not `npm`.
- Repository: `git@github.com:masmuss/trak.git`
- Active branch: `feat/report-priority`.
- `DATABASE_URL` lives in root `.env`, loaded automatically by `@trak/database` import.
- Per-app `.env` files only contain non-DB vars: `TELEGRAM_BOT_TOKEN`, `ORIGIN`, `BETTER_AUTH_SECRET`.
- DB reset + full migrate (0000–0006) + re-seed done. No pending migrations.
- `uuid_generate_v7()` function now works correctly (tested: returns valid UUID v7).

## Relevant Files

- `packages/database/src/schema.ts` — all tables: `reports` (now has priority + SLA fields), `reporters`, `categories`, `notifications`, `botSessions`, `statusHistories`, etc.
- `packages/database/drizzle/0005_green_spot.sql` — `uuid_generate_v7()` function + ALTER DEFAULT for 7 tables
- `packages/database/drizzle/0006_careful_trauma.sql` — priority enum + SLA columns on `reports`
- `packages/database/src/index.ts` — `db` proxy, `initDb()`, `listen()`, `createPgSessionAdapter`, `getDb()`
- `packages/services/src/report.service.ts` — ticket CRUD, `calculateSLA()`, `createReport`, `updateTicketPriority`, `checkSlaBreach`, `getTicketByTicketCode`, `getTicketById`
- `packages/services/src/index.ts` — barrel exports
- `packages/shared/src/types.ts` — `Priority` type, `TicketDetails` includes SLA fields
- `apps/web/src/routes/(authenticated)/tickets/[id]/+page.server.ts` — form actions (`updateStatus`, `updatePriority`)
- `apps/web/src/lib/features/tickets/components/priority-badge.svelte` — priority badge with icon/color per level
- `apps/web/src/lib/features/tickets/components/status-badge.svelte` — pattern for badges
- `apps/web/src/lib/features/tickets/components/ticket-priority-form.svelte` — priority selector + SLA display + breach alert
- `apps/web/src/lib/features/tickets/components/columns.svelte` — table columns (includes priority)
- `apps/web/src/lib/features/tickets/components/ticket-detail-view.svelte` — layout (includes priority form)
- `apps/web/src/lib/features/tickets/components/ticket-description.svelte` — header with priority badge
- `apps/bot/src/handlers/commands.ts` — `/status` (enriched), `/start`, `/help`
- `apps/bot/src/handlers/callbacks.ts` — uses `createReport` returned `ticketCode` directly
- `root package.json` — `db:seed` uses `pnpm --filter @trak/web db:seed`

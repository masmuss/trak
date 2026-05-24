# Monorepo dengan pnpm Workspace + Turborepo

## Kenapa Monorepo?

Proyek ini punya tiga entitas yang perlu berbagi kode:

| Entitas             | Peran                                 |
| ------------------- | ------------------------------------- |
| `apps/web`          | SvelteKit frontend (ticketing portal) |
| `apps/bot`          | Telegram bot                          |
| `packages/database` | Schema & client Drizzle ORM           |
| `packages/shared`   | Types & constants bersama             |

### Masalah yang Dipecahkan

- **Duplikasi kode**: Schema database, types, dan constants sebelumnya di-copy manually ke bot. Satu perubahan berarti sinkronisasi manual di 2 tempat.
- **Versioning implicit**: Tanpa package, ga ada cara jelas buat nge-track versi shared code.
- **Dependency management**: Shared dependencies kayak `drizzle-orm`, `postgres`, dan typescript harus di-install di tiap entitas secara terpisah.

## Kenapa pnpm Workspace?

- **Disk space**: pnpm pake hard links, bukan copy. Satu versi dependency cukup disimpan sekali.
- **Strictness**: pnpm ga hoist dependency secara default. Nge-prevent akses ke dependency yang ga di-declare di `package.json`.
- **Kecepatan**: Lebih cepet dari npm/yarn di install parallel.
- **Fitur monorepo**: `pnpm-workspace.yaml`, `--filter`, dan catalog built-in.

## Kenapa Turborepo?

- **Task caching**: Build, lint, check — hasil di-cache. Kalo source ga berubah, hasil dari cache dipake.
- **Parallel execution**: Jalanin task di semua workspace secara paralel. Contoh: `turbo lint` jalanin eslint di web + check type di shared secara bersamaan.
- **Dependency graph**: `dependsOn: ["^build"]` — nge-pastiin package dependencies kebuild duluan sebelum consumer-nya.
- **Zero config**: Ga perlu konfigurasi rumit. Cuma perlu define tasks di `turbo.json`.

## Struktur

```
trak/
├── apps/
│   ├── web/          # SvelteKit app
│   └── bot/          # Telegram bot (WIP)
├── packages/
│   ├── database/     # Drizzle schema, migrations, client
│   └── shared/       # Types, constants
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Scripts Penting

```bash
pnpm dev            # Run semua workspace di dev mode
pnpm build          # Build semua workspace
pnpm lint           # Lint semua workspace
pnpm check          # Type check semua workspace
pnpm test:unit      # Unit test
pnpm format         # Format semua file

# Filter per workspace
pnpm --filter @trak/web dev
pnpm --filter @trak/database db:push
```

## Catatan

- pnpm 11 — migrasi dari `.npmrc` ke `pnpm-workspace.yaml` buat konfigurasi non-auth. Contoh: `allowBuilds`.
- Turborepo dipake purely buat task orchestration + caching, bukan buat dependency management.
- Pre-commit hooks: prettier (format) + svelte-check (type safe). Eslint jalan via `turbo lint`.

# Roadmap

Prioritas berdasar dampak ÷ effort. P1 = incomplete without this, P4 = nice later.

## P1 — Core Workflow Gap

| #   | Feature                                              | Why                                                                                                |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | **Filter by priority + SLA status** di tabel tiket   | Priority & SLA udah ada di DB, panel belum bisa filter. Tanpa ini fitur prioritas setengah matang. |
| 2   | **SLA warning colors** di tabel (hijau/kuning/merah) | Agent perlu lihat deadline mendesak tanpa buka detail satu-satu.                                   |
| 3   | **Assign ticket ke agent**                           | Sekarang tiket mengambang tanpa pemilik. Agent panel harus bisa assign & lihat tiket sendiri.      |

## P2 — Significant Value

| #   | Feature                                                                  | Why                                                                                  |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 4   | **Dashboard** — chart tiket/hari, SLA breach rate, category distribution | Landing page masih kosong. Agent butuh overview.                                     |
| 5   | **Agent notification via bot** saat diassign / SLA breach                | Biar agent tau real-time tanpa refresh panel. LISTEN/NOTIFY infrastructure udah ada. |
| 6   | **Stale ticket detection** — cron/trigger `lastActivityAt`               | Tiket open > 48h tanpa response harus escalate.                                      |
| 7   | **Filter "My Tickets"** di sidebar nav                                   | Agent cukup lihat tiket assigned ke dirinya.                                         |

## P3 — Polish & DX

| #   | Feature                                                       | Why                                                                                             |
| --- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 8   | **Ticket comments** — agent & reporter bisa reply di timeline | Kolaborasi tanpa buka external chat. Bot Bisa reply via Telegram.                               |
| 9   | **Activity log UI** — timeline component yang lebih rich      | Sekarang cuma text list. Bisa tampilkan perubahan priority, assignment, dll dengan visual diff. |
| 10  | **Export CSV/PDF** dari panel                                 | Reporting ke atasan / archive.                                                                  |

## P4 — Future

| #   | Feature                             | Why                                            |
| --- | ----------------------------------- | ---------------------------------------------- |
| 11  | **Webhook on ticket create/update** | Integrasi external (Slack, email, dll).        |
| 12  | **Multiple categories per ticket**  | Labels/tags instead of single category.        |
| 13  | **Knowledge base / FAQ** di bot     | Reporter bisa cari solusi sebelum bikin tiket. |
| 14  | **SSO / OAuth** login               | Ganti better-auth dengan provider external.    |

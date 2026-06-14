# [1.2.0](https://github.com/masmuss/trak/compare/v1.1.0...v1.2.0) (2026-06-14)


### Features

* **bot:** add stale session cleanup with daily cron ([d288198](https://github.com/masmuss/trak/commit/d288198262c2955d7d560747ff0bc1d1f2bf6362))

# [1.1.0](https://github.com/masmuss/trak/compare/v1.0.0...v1.1.0) (2026-06-13)


### Bug Fixes

* **web:** prevent toolbar overflow with flex-wrap ([1d598f1](https://github.com/masmuss/trak/commit/1d598f1441635b1f5842eb810446d06a604f705e))
* **web:** use explicit onPaginationChange callback to resolve Svelte 5 bindable loop issue ([9822222](https://github.com/masmuss/trak/commit/9822222a150783ffefb5094cc22e13d04595bf89))


### Features

* **checkbox:** add Checkbox component with customizable props and icons ([791740c](https://github.com/masmuss/trak/commit/791740c9487369aa8768f8c21aeef2ee7b764290))
* **web:** implement progressive table system with modular components ([d7e4908](https://github.com/masmuss/trak/commit/d7e490895bfeca6189f95533babcf3c32ad423b3))
* **web:** implement ticket list filtering and table toolbar controls ([37720ac](https://github.com/masmuss/trak/commit/37720ac37957f0a3cc7da79f3bc9166cff2afdbf))

# 1.0.0 (2026-06-06)

### Bug Fixes

- add tsx as devDependency to @trak/web for db:seed script ([66bf7e2](https://github.com/masmuss/trak/commit/66bf7e20979b0f61243bcbbc3278dc1a02ab5750))
- allow initDb to accept undefined DATABASE_URL ([df793e4](https://github.com/masmuss/trak/commit/df793e40c21d14fc6494328ec8dbd484c75d75e4))
- **ci:** add BETTER_AUTH_SECRET for CI build ([eef62e0](https://github.com/masmuss/trak/commit/eef62e0b7e1c0a3f73049cde3fd26556d0567b67))
- **ci:** add postgres service container and DATABASE_URL for build ([3bfcc2f](https://github.com/masmuss/trak/commit/3bfcc2f93a5ae13581c6052386b14b92e0c82f13))
- **ci:** create .env file for DATABASE_URL before build ([b6842ad](https://github.com/masmuss/trak/commit/b6842ad0e15f36a628cb1cf28e42fafc4650282f))
- configure eslint to ignore underscore-prefixed unused params ([c442b57](https://github.com/masmuss/trak/commit/c442b5792d1361825517aea7732ee8b4fd1707fb))
- correct resolve calls with full RouteId and path+search for export ([c5cf485](https://github.com/masmuss/trak/commit/c5cf48536445f8cfb331df69fa60e0a1029024a5))
- disable eslint rule for navigation in tickets table ([f928f6b](https://github.com/masmuss/trak/commit/f928f6ba30cd2e967c132fd29b6e70982b6d4426))
- load root .env via --env-file flag for db:seed ([d084830](https://github.com/masmuss/trak/commit/d084830ddc9d7aeaff0f98d731f230249d014739))
- move space-y-12 inside ScrollArea so article spacing works ([6c8871c](https://github.com/masmuss/trak/commit/6c8871c4eea334e0bd7aadff255636bf3713c7b6))
- pass DATABASE_URL explicitly to @trak/database via initDb ([e9da48d](https://github.com/masmuss/trak/commit/e9da48dbe6795236a68cac8a9d72794ddbd19868))
- remove leading slash from svelte-kit/build gitignore patterns for monorepo ([398385e](https://github.com/masmuss/trak/commit/398385eed07ee8af0dd6d3b50f36b51b1b93a649))
- **tickets:** add hidden status input, toast feedback, and fix use:enhance update call ([8edb243](https://github.com/masmuss/trak/commit/8edb24398220b2b88dd5df0e9c117f4886df95cd))

### Features

- add @trak/services package with domain service modules ([308f38b](https://github.com/masmuss/trak/commit/308f38b4b5d3c101f5c6d257160ff6480aeb2c65))
- add agents management with CRUD ([cbabdf8](https://github.com/masmuss/trak/commit/cbabdf808a2e16ffd1421071dc79f378389959c2))
- add category distribution with percentage bars to settings ([7c1459d](https://github.com/masmuss/trak/commit/7c1459d579f1bdcb9d0a6de39ad23498a5446f84))
- add category management CRUD with table and form components ([a06dc2f](https://github.com/masmuss/trak/commit/a06dc2fd1ffa524a2754d88969fe9f8623350401))
- add dashboard skeleton with chart and feature components ([f2056e5](https://github.com/masmuss/trak/commit/f2056e5c2d33ee11887099d9d410d77c0f454327))
- add database seeding functionality and dependencies ([6c7bdab](https://github.com/masmuss/trak/commit/6c7bdab752c920c6f78d12b008f471ec8d8367e7))
- add invite codes management with CRUD ([bdb9e7a](https://github.com/masmuss/trak/commit/bdb9e7a6d3264245ffb07649b9a65a1decaa8c2b))
- add priority and SLA columns to reports ([10fdd6a](https://github.com/masmuss/trak/commit/10fdd6a5c0b9d461a604a40b0a8e692967465c43))
- add priority and SLA filters + fix goto navigation ([d3147ca](https://github.com/masmuss/trak/commit/d3147ca1ca62bf9dea7c34ec72576f794f978476))
- add ticket stats cards (total, pending, solved) ([0006bb7](https://github.com/masmuss/trak/commit/0006bb7b0112cb86eec7a9f640f3d88315a10213))
- add ticket_code column to reports table ([dd30731](https://github.com/masmuss/trak/commit/dd30731e1ad14fe0d602dd1ab21c1c09a33b1ed6))
- add trak brand logo and meta tags ([35cd225](https://github.com/masmuss/trak/commit/35cd2256e8156b4ba7136311caec16520cd7ab8e))
- add trak logo to sidebar, create logo components ([84da43c](https://github.com/masmuss/trak/commit/84da43ce68c3090bdc6aafe7ec8d0af966733389))
- add UUID generation for primary keys and update database schema ([a9f233b](https://github.com/masmuss/trak/commit/a9f233b78eb381e9e552923ba7a46af6c3acd7b1))
- bot integration - invite code, /status, notifications, global DATABASE_URL ([2052abb](https://github.com/masmuss/trak/commit/2052abbde366c8f7afb6ddd40c5b26ae999904b4))
- **bot:** add reply keyboard for report flow and action buttons after submit ([14e4c44](https://github.com/masmuss/trak/commit/14e4c448d58b4eb7531b0e08eb21555aa7cbde17))
- **bot:** dynamic reply keyboard per step with skip button ([fccb26c](https://github.com/masmuss/trak/commit/fccb26c401a9b9277b22f09b8248f17131a7695c))
- clean up sidebar, add toggle-group theme switcher and logout ([40c9389](https://github.com/masmuss/trak/commit/40c93896122f25b26a3a9dc83b9ea208461b1bda))
- configure ticketing navigation routes in sidebar ([d1160ab](https://github.com/masmuss/trak/commit/d1160ab5edc95e374214574abcabfab767d6b193))
- enhance ticket code generation to prevent collisions ([eabe6b9](https://github.com/masmuss/trak/commit/eabe6b9800e6f4e7c93fb6c33e795d602bd26f21))
- enrich /status response with body, attachments count, update date, and status history timeline ([c531eff](https://github.com/masmuss/trak/commit/c531effa5d662ea19331b463a1d2f869a71680aa))
- implement Better Auth, custom login page, database schema and seeding updates ([f16fec9](https://github.com/masmuss/trak/commit/f16fec96da1b54b45302a1a280bed0fd7f34e0ac))
- implement database schema and relationships based on ERD ([eaa7981](https://github.com/masmuss/trak/commit/eaa79819f5007af667d9b813ea9d9c1f0bd419b9))
- implement tickets list with database query and type-safe schema ([beea79d](https://github.com/masmuss/trak/commit/beea79d8792819382de73357afa1748b98c3d1dd))
- init reporter management feature with table component ([0e33651](https://github.com/masmuss/trak/commit/0e3365152d5473af68e0f6a2b809dd4646300b6d))
- migrate to monorepo with pnpm workspace + turborepo ([043502c](https://github.com/masmuss/trak/commit/043502cf7fa32b30443abb77da3a616c2dab87fc))
- populate dashboard with real db data and wire actions ([06bb587](https://github.com/masmuss/trak/commit/06bb5872b469ec8cd7500a6da21df320b5ad13be))
- priority management system with SLA recalculation ([e7054bf](https://github.com/masmuss/trak/commit/e7054bfc4e4141c96cda7e9ac2b78713652f9e0c))
- redesign ticket detail view with conversation thread + sidebar layout ([ead6303](https://github.com/masmuss/trak/commit/ead6303ccb2bb766fa2f7494bcdaa802dc0bafa3))
- reorganize layout components and extract authenticated layout wrapper ([8e2b74e](https://github.com/masmuss/trak/commit/8e2b74ec1d93dd87fa21954c77a205eb0ffc33bf))
- replace category active badge with Switch toggle ([5e91250](https://github.com/masmuss/trak/commit/5e912504b22fda306cac1bc04cbc96c1caf6242c))
- seed priority and SLA deadlines + export calculateSLA ([9134f3a](https://github.com/masmuss/trak/commit/9134f3a61cfe9e6f1be6e29b01b8da252325d3dc))
- setup shadcn-svelte ([712084a](https://github.com/masmuss/trak/commit/712084a38d1dba2080a38d2b9588cf056d322e89))
- simplify table columns — remove category, use ticketCode, rename headers ([16ab88f](https://github.com/masmuss/trak/commit/16ab88f5b7b52c080d3da04f00ea3bb373b79fea))
- swap priority label and SLA dot, remove actions column ([74a8fc9](https://github.com/masmuss/trak/commit/74a8fc917bf86415784b59594124567421ca5338))
- **tickets:** add ticket detail view with status form, timeline, reporter, description components ([db379a3](https://github.com/masmuss/trak/commit/db379a3a250a444041a8192f6bef437f895e96f4))
- **tickets:** implement reusable generic data table and modular columns definition ([fe2347c](https://github.com/masmuss/trak/commit/fe2347c2f5926f4a6aaf34191383585f962e6a4b))
- **tickets:** implement SSR-bound pagination with URL query sync ([6532fa3](https://github.com/masmuss/trak/commit/6532fa3b8580b46130810f9d1a7823f72c2db413))
- **tickets:** implement status query param filtering and integrate Empty component ([a3d054e](https://github.com/masmuss/trak/commit/a3d054e03aa210eadab484c96a232040b97fe79a))
- **tickets:** implement ticket details page, status transition actions, CSV export endpoint, and HMR duck-typing fix ([297687f](https://github.com/masmuss/trak/commit/297687f421aa7ff1abc27f6b236ba928d68b650a))
- **tickets:** move export and create actions to datatable toolbar and remove redundant wrapper layout ([8e20a1e](https://github.com/masmuss/trak/commit/8e20a1ed778e2a10d5338c6b2a4899b4161d7359))
- wire Telegram bot with @trak/services ([e8c21f5](https://github.com/masmuss/trak/commit/e8c21f538e4abb621d69ddcb80e231078a0d83b1))

### Performance Improvements

- replace UUID v4 with UUID v7 for primary keys ([271c25b](https://github.com/masmuss/trak/commit/271c25bc2ad58e6d173771ab164a173755aac500))

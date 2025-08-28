# OctoCAT Supply Chain Management Application — Developer Guidance

When chatting with me, please refer to me as Captain.

## Purpose
This file contains practical, opinionated guidance to help contributors build and maintain the frontend (React + Vite) and the TypeScript/JavaScript code in this repo. It's written to be friendly for developers coming from Java backgrounds: where appropriate we call out Java analogies and recommended comment styles.

## Repo and architecture references
- Full architecture is in `docs/architecture.md`.
- Frontend is a Vite + React app (see `frontend/`). Backend API lives in `api/` (Express + TypeScript).

## High-level goals
- Fast local feedback with Vite dev server.
- Reliable, readable code: ESLint + Prettier + TypeScript where feasible.
- Lightweight tests with Vitest + React Testing Library.
- Clear docs in Markdown for Java developers (use Java-style references when explaining patterns).

## Development checklist (what we expect from contributors)
- Document every new exported function with a short TSDoc block. For Java developers, think "JavaDoc-style" but use TSDoc (/** ... */).
- Write documentation in Markdown and place it near the code (`README.md` in the package/folder) or update `docs/` when appropriate.
- Keep components small, typed, and test-covered (happy path + one edge case).
- Use Vite best practices for configuration, environment variables, and asset handling (https://docs.vite.org/best-practices/).

## Recommended local setup
- Node: use the repo's Node version if present (nvm or manual install). Use a stable LTS release.
- Package manager: this repo uses npm workspaces (root `package.json`). Use `npm install` at repo root.

Common scripts (run from repository root):
- npm run dev --workspace=frontend  # start frontend dev server
- npm run build --workspace=frontend  # produce production build
- npm run dev --workspace=api  # start backend in dev mode

Adjust these if you work inside the subfolders directly (cd frontend; npm run dev).

## Vite / React practical tips
- Keep `vite.config.ts` minimal: prefer convention over cleverness. Examples:
	- Use `define: { __APP_VERSION__: JSON.stringify(version) }` for build-time constants.
	- Use `server.proxy` for API calls in dev (avoid CORS friction).
	- Enable `esbuild`/`optimizeDeps` for large dep performance.
	- Set `build.target` to a modern target (es2018+) to keep bundles small.
- Use `import.meta.env` for env variables. Name runtime vars with `VITE_` prefix for frontend.
- Static assets: put public static files in `frontend/public` and import images from `src` when you want bundling and hashing.
- Path aliasing: prefer a small set of aliases (for example `@/` -> `src/`) and keep them in `tsconfig.json` and `vite.config.ts` in sync.

## TypeScript and typing (when used)
- Prefer TypeScript for shared library code and components. If JS is used, provide JSDoc type annotations.
- Export small explicit interfaces for component props. Example contract style (2–4 bullets):
	- Inputs: props object shape
	- Outputs: events/callbacks or return values
	- Error modes: validation errors to show to users
	- Success criteria: visual state and network side-effects

## Linting and formatting
- ESLint + Prettier must run locally and in CI. Keep rules focused on readability and consistency.
- Recommended ESLint plugins: `eslint-plugin-react`, `@typescript-eslint`, `eslint-plugin-import`, `eslint-plugin-testing-library`.

## Testing
- Use Vitest for unit tests and React Testing Library for component tests. Keep tests fast and deterministic.
- At minimum: one happy-path test and one edge-case test per important module.

## Component and file layout (suggested)
- src/
	- components/ (reusable small components)
	- pages/ (route-level components)
	- hooks/ (custom hooks)
	- context/ (React context providers)
	- api/ (client-side API wrappers)

Structure components as "one component per folder" when they have styles, tests, or subcomponents. Example:
ProductCard/
	- ProductCard.tsx
	- ProductCard.test.tsx
	- ProductCard.css (or .module.css)

## Testing and CI
- Ensure CI runs: lint, typecheck (if TS), unit tests, and production build.
- Keep CI lightweight: cache node_modules, run tests in parallel where possible.

## Docker and deployment notes
- Frontend builds should produce static assets served by `nginx` (see `frontend/Dockerfile` and `nginx.conf`).
- Use the `docker-compose.yml` at the repo root for local multi-service testing.

## Docs and comments for Java developers
- Use TSDoc for functions and types. Example Java-style comment for a function:
	/**
	 * Calculates total order amount.
	 * <p>
	 * Java devs: think of this as a small utility method similar to a POJO method — keep it pure and testable.
	 *
	 * @param items list of order details
	 * @returns the total price in cents
	 */
	function calculateTotal(items: OrderDetail[]): number { ... }

## Small engineering contract (apply to new modules/components)
1. Inputs: what's required to call the function or render the component.
2. Outputs: return values, emitted events, or API calls.
3. Error handling: how errors surface and how they're tested.
4. Performance: expected complexity or size constraints.

## Edge cases to consider
- Missing or malformed API responses.
- Slow or flaky network (show loading and retry states).
- Large lists — use virtualization if needed.
- Auth and permission edge cases (show safe fallback UI).

## Database writing best practices (server / `api/`)

These guidelines focus on writing (creating/updating/deleting) data safely and reliably from the backend code in `api/` (Express + TypeScript).

- Prefer a small service/repository (DAO) layer that sits between your route handlers and the database. Java analogy: a Repository/DAO class that encapsulates queries and transactions.
- Use parameterized queries or an ORM/query-builder (Prisma, TypeORM, Knex, or `pg` with parameterized SQL) to avoid SQL injection. Example choices:
	- Prisma: great DX, typed models, `prisma migrate` for schema migrations.
	- TypeORM / MikroORM: full-featured ORMs with decorators and repositories.
	- Knex + Objection: lightweight query builder + models.

- Always use transactions for multi-step writes that must be atomic. Roll back on errors.
- Connection pooling: configure a pool (pg, Prisma, TypeORM) and reuse it across requests to avoid connection storms.
- Idempotency & retries: design endpoints to be idempotent where possible (client-supplied idempotency key) and retry transient failures with exponential backoff.
- Validation: validate and sanitize incoming data before writing (Zod, Joi, class-validator). Treat validation errors as 4xx, DB errors as 5xx.
- Migrations: keep schema migrations in source control. Use a migration tool (Prisma Migrate, Knex migrations, Flyway/Liquibase for SQL-first workflows).
- Secrets & config: don't hardcode DB URLs or credentials. Use environment variables (e.g., `DATABASE_URL`, `DB_HOST`, `DB_USER`, `DB_PASS`) and a secrets store in production. In this repo, look at `api/` for env usage and `api/seedData.ts` for local test seeds.
- Backups and safety: for destructive operations (drop, truncate), require explicit flags or separate scripts and run them only in controlled environments.
- Logging & observability: log write intents and failures at appropriate levels; include correlation IDs and the user id when available.
- Performance: batch writes when appropriate, prefer bulk insert APIs for large imports, and ensure appropriate indexes exist before heavy writes.

Testing patterns
- Unit tests: mock the repository/DAO layer and assert the business logic around writes.
- Integration tests: run tests against a real test database (Dockerized Postgres or SQLite in-memory if supported by your library). Use the `api/seedData.ts` script for fixtures during tests or create lightweight factory helpers.
- Local dev: use `docker-compose.yml` to run a local DB for manual testing, and keep seed scripts to bootstrap predictable data.

Quality expectations
- Add tests for both success and failure (constraint violations, unique key conflicts).
- Document any non-obvious transactional boundaries in TSDoc above the repository/service functions.

Quick checklist for implementing a safe write endpoint
1. Validate input and types (Zod/class-validator).
2. Begin a transaction if multiple statements are required.
3. Use parameterized queries or ORM methods from a repository class.
4. Commit; on error, rollback and return an appropriate error code.
5. Add an audit log entry or emit an event if needed.


## Recommended VS Code settings & extensions (optional)
- Extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Vitest runner, Debugger for Chrome/Edge.
- Recommended settings: format on save (Prettier), eslint integration, test explorer tied to Vitest.

## Where to add changes and how to run the checks
- Edit frontend code under `frontend/src` and backend under `api/src`.
- Run the dev server from the workspace root with the npm workspace commands above, or run the subproject scripts from within that folder.

## Useful links
- Vite best practices: https://docs.vite.org/best-practices/
- Vitest: https://vitest.dev/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro

## Closing notes
Keep changes small and well-tested. Use Java-style documentation and analogies when writing comments so the target audience (Java developers) can easily understand the conventions. If you'd like, I can also add a repo-level `CONTRIBUTING.md` or a minimal `frontend/README.md` with a short onboarding checklist and exact npm commands for new contributors.

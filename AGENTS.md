# Repository Guidelines

## Project Structure

- `app/`: Next.js App Router entrypoints (`layout.tsx`, `page.tsx`) and global styles (`app/globals.css`).
- `components/`: Feature/section components used by the homepage.
  - `components/ui/`: Shared UI primitives (shadcn/ui + Radix) used across the app.
- `hooks/`: Reusable React hooks (client-only where needed).
- `lib/`: Small utilities and shared helpers (e.g. `lib/utils.ts` for `cn()`).
- `public/`: Static assets served at `/` (images, icons).
- `styles/`: Legacy/extra CSS (currently not imported by `app/layout.tsx`).

Path aliases: `@/*` maps to the repository root (see `tsconfig.json`).

## Build, Test, and Development Commands

This repo uses `pnpm` (see `pnpm-lock.yaml`).

- `pnpm install`: Install dependencies.
- `pnpm dev`: Run the dev server (Next.js) for local development.
- `pnpm build`: Production build (`next build`).
- `pnpm start`: Start the production server (run after `pnpm build`).
- `pnpm lint`: Run ESLint over the repo (`eslint .`).
- `pnpm exec tsc --noEmit`: Type-check locally (recommended; `next.config.mjs` ignores TS build errors).

## Coding Style & Naming Conventions

- Language: TypeScript + React (Next.js).
- Indentation: 2 spaces; avoid semicolons to match existing files.
- Follow local file conventions for quotes/formatting (the codebase currently mixes `'` and `"`).
- Keep UI primitives in `components/ui/`; keep page/feature sections in `components/`.

## Testing Guidelines

- No automated test runner is configured yet (no `test` script and no `*.test.*`/`*.spec.*` files).
- Validate changes by running `pnpm dev` and checking the relevant UI flows.
- If you add tests, introduce a `pnpm test` script and keep tests close to features (e.g. `components/__tests__/...`).

## Commit & Pull Request Guidelines

- Git history is not available in this checkout, so use Conventional Commits:
  - `feat: add crop tool`, `fix: handle empty upload`, `chore: update deps`
- PRs should include: summary, testing steps (`pnpm dev`/`pnpm build`), and screenshots for UI changes.

## Security & Configuration

- Put secrets in `.env.local`; never commit `.env*` (already ignored by `.gitignore`).
- Treat user-provided inputs (uploads/prompts) as untrusted; validate on the server if/when backend logic is added.

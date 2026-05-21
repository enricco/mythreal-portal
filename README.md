# Mythreal Portal

Per-client brand portals. Implements [Phase 1](../build-plan/01-phase-scaffolding.md) of the [MVP build plan](../build-plan/README.md).

## What's in Phase 1

- Next.js 15 (App Router, TypeScript, Tailwind v4)
- Supabase client (server-side, service-role)
- Dynamic route `app/[slug]/page.tsx` with passcode gate
- Lock screen + optional name-capture screen
- Portal shell with placeholder sections for Phases 2–4
- Analytics helper, fires `portal_opened` on unlock
- 404 page for unknown slugs

## Setup

### 1. Create the Supabase project

1. Go to <https://supabase.com>, new project (free tier).
2. SQL editor → paste contents of [`supabase/schema.sql`](./supabase/schema.sql) → run.
3. (Optional) paste [`supabase/seed.example.sql`](./supabase/seed.example.sql) and adapt for a test client.
4. Storage → create three public buckets: `logos`, `fonts`, `assets`.
5. Settings → API → copy `URL`, `anon` key, `service_role` key.

### 2. Environment

```sh
cp .env.local.example .env.local
# fill in the three values
```

### 3. Run

```sh
npm run dev
```

Visit:
- `http://localhost:3000` — marketing placeholder
- `http://localhost:3000/waypoint` — portal (if you ran the seed)
- `http://localhost:3000/does-not-exist` — 404 page

### 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel.
3. Add the three env vars in Vercel project settings.
4. Add custom domain `portal.mythreal.studio`.
5. Configure DNS (CNAME `portal` → `cname.vercel-dns.com`).

## Project structure

```
app/
  [slug]/
    page.tsx          # server: load client, render gate
    actions.ts        # server actions: verifyPasscode, logEvent
    not-found.tsx     # premium 404
  layout.tsx
  page.tsx            # root placeholder
components/
  PortalGate.tsx      # session check, gates lock vs shell
  LockScreen.tsx      # passcode + optional name capture
  PortalShell.tsx     # portal layout with placeholder sections
lib/
  supabase/server.ts  # service-role client (server-only)
  analytics.ts        # track() helper
  session.ts          # localStorage session
  types.ts            # DB row + event types
supabase/
  schema.sql          # all 9 tables + slug-immutability trigger + usage view
  seed.example.sql    # sample data for one client
```

## Next phases

- [Phase 2 — Colors + Logos](../build-plan/02-phase-color-logo.md)
- [Phase 3 — Typography + Dev Tokens](../build-plan/03-phase-typography-tokens.md)
- [Phase 4 — Vibe Coordinates + Verbal Soundboard](../build-plan/04-phase-vibe-verbal.md)
- [Phase 5 — Polish + First Client Deploy](../build-plan/05-phase-polish-deploy.md)

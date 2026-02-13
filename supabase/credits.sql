-- Credits table used by:
-- - Creem webhook: app/api/webhook/creem/route.ts (grants 1000 credits after purchase)
-- - Generate API:  app/api/generate/route.ts (deducts 5 credits per generation)
-- - Credits API:   app/api/credits/route.ts (shows current credits)

create table if not exists public.user_credits (
  user_id uuid primary key references auth.users (id) on delete cascade,
  credits integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_credits enable row level security;

-- Allow signed-in users to read their own credits.
drop policy if exists "read own credits" on public.user_credits;
create policy "read own credits"
on public.user_credits
for select
to authenticated
using (auth.uid() = user_id);

-- IMPORTANT:
-- Do NOT allow clients to update credits directly. The server routes use
-- SUPABASE_SERVICE_ROLE_KEY (service role) to bypass RLS for updates.

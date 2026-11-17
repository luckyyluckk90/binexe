-- Contact / enquiry submissions for binexe.com
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  interest text not null,
  message text not null,
  source text not null default 'binexe.com',
  user_agent text,
  status text not null default 'new'
);

alter table public.enquiries enable row level security;

-- Public site may insert enquiries with the anon key.
create policy "Allow public enquiry inserts"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated dashboard users can read (configure in Supabase Auth later).
create policy "Allow authenticated read of enquiries"
  on public.enquiries
  for select
  to authenticated
  using (true);

create index if not exists enquiries_created_at_idx
  on public.enquiries (created_at desc);

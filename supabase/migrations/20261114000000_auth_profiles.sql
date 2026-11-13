create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'reader'
    check (role in ('reader', 'analyst', 'approver', 'administrator')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  specialty text,
  location text,
  bio text,
  hourly_rate numeric(10,2) not null default 0,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  photo_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.provider_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null default 60,
  price numeric(10,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (provider_id, weekday, start_time, end_time)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete restrict,
  provider_id uuid not null references public.providers(id) on delete restrict,
  service_id uuid not null references public.provider_services(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  total_price numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled','rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  client_id uuid not null references auth.users(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (booking_id)
);

create table if not exists public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_providers_location on public.providers(location);
create index if not exists idx_provider_services_provider on public.provider_services(provider_id);
create index if not exists idx_provider_availability_provider on public.provider_availability(provider_id);
create index if not exists idx_bookings_provider_starts on public.bookings(provider_id, starts_at);
create index if not exists idx_bookings_client on public.bookings(client_id);
create index if not exists idx_reviews_provider on public.reviews(provider_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.update_updated_at();

create trigger providers_updated_at
before update on public.providers
for each row execute procedure public.update_updated_at();

create trigger bookings_updated_at
before update on public.bookings
for each row execute procedure public.update_updated_at();

create or replace function public.check_booking_conflict()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.bookings b
    where b.provider_id = new.provider_id
      and b.status in ('pending','confirmed')
      and b.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
      and tstzrange(b.starts_at, b.ends_at) && tstzrange(new.starts_at, new.ends_at)
  ) then
    raise exception 'Provider already has a booking during this time';
  end if;

  return new;
end;
$$;

create trigger prevent_overlapping_bookings
before insert or update on public.bookings
for each row execute procedure public.check_booking_conflict();

alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.provider_services enable row level security;
alter table public.provider_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.service_categories enable row level security;
alter table public.profile_photos enable row level security;

create policy "Users can view own profile" on public.profiles
for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
for insert with check (auth.uid() = id);

create policy "Public provider listing" on public.providers
for select using (true);
create policy "Provider can manage own profile" on public.providers
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Public service listing" on public.provider_services
for select using (is_active = true);
create policy "Provider can manage own services" on public.provider_services
for all using (
  exists (select 1 from public.providers p where p.id = provider_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.providers p where p.id = provider_id and p.user_id = auth.uid())
);

create policy "Public availability visible" on public.provider_availability
for select using (is_available = true);
create policy "Provider can manage own availability" on public.provider_availability
for all using (
  exists (select 1 from public.providers p where p.id = provider_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.providers p where p.id = provider_id and p.user_id = auth.uid())
);

create policy "Booking clients can view own bookings" on public.bookings
for select using (auth.uid() = client_id or exists (
  select 1 from public.providers p where p.id = provider_id and p.user_id = auth.uid()
));
create policy "Clients can create bookings" on public.bookings
for insert with check (auth.uid() = client_id);
create policy "Clients or providers can update bookings" on public.bookings
for update using (
  auth.uid() = client_id or exists (select 1 from public.providers p where p.id = provider_id and p.user_id = auth.uid())
) with check (
  auth.uid() = client_id or exists (select 1 from public.providers p where p.id = provider_id and p.user_id = auth.uid())
);

create policy "Public reviews" on public.reviews
for select using (true);
create policy "Users can create reviews" on public.reviews
for insert with check (auth.uid() = client_id);

create policy "Users can view own photos" on public.profile_photos
for select using (auth.uid() = owner_id);
create policy "Users can upload own photos" on public.profile_photos
for insert with check (auth.uid() = owner_id);

create policy "Public categories" on public.service_categories
for select using (true);

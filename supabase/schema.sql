-- ============================================================
--  lsBarbearia — Supabase Schema
--  Cole no SQL Editor do seu projeto Supabase e execute.
--  Acesse: supabase.com → seu projeto → SQL Editor → New query
-- ============================================================

-- 1. PROFILES (clientes, barbeiros e adm)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  nick        text,
  phone       text,
  email       text,
  role        text not null check (role in ('cliente','barbeiro','adm')) default 'cliente',
  avatar_url  text,
  instagram   text,
  bio         text,
  created_at  timestamptz default now()
);

-- 2. SERVICES (serviços da barbearia)
create table if not exists public.services (
  id          serial primary key,
  name        text not null,
  description text,
  price       numeric(8,2) not null,
  duration_min int not null default 45,
  image_url   text,
  badge       text,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- 3. WORK_SCHEDULES (escala de trabalho dos barbeiros)
create table if not exists public.work_schedules (
  id          serial primary key,
  barber_id   uuid references public.profiles(id) on delete cascade,
  weekday     int not null check (weekday between 0 and 6), -- 0=Dom, 6=Sáb
  start_time  time not null default '09:00',
  end_time    time not null default '20:00',
  active      boolean default true
);

-- 4. APPOINTMENTS (agendamentos)
create table if not exists public.appointments (
  id              serial primary key,
  client_id       uuid references public.profiles(id) on delete set null,
  barber_id       uuid references public.profiles(id) on delete set null,
  service_id      int references public.services(id) on delete set null,
  date            date not null,
  time            time not null,
  status          text not null check (status in ('pendente','confirmado','concluido','cancelado')) default 'pendente',
  price           numeric(8,2),
  notes           text,
  ref_photo_url   text,
  created_at      timestamptz default now()
);

-- 5. MESSAGES (chat entre cliente e barbeiro)
create table if not exists public.messages (
  id          serial primary key,
  sender_id   uuid references public.profiles(id) on delete set null,
  receiver_id uuid references public.profiles(id) on delete set null,
  content     text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles     enable row level security;
alter table public.services      enable row level security;
alter table public.work_schedules enable row level security;
alter table public.appointments  enable row level security;
alter table public.messages      enable row level security;

-- PROFILES: cada user lê o próprio perfil; barbeiro/adm lê todos
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('barbeiro','adm')
  ));
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- SERVICES: todos leem; só adm insere/altera
create policy "services_select" on public.services for select using (true);
create policy "services_write" on public.services for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'adm')
);

-- WORK_SCHEDULES: barbeiro edita a própria; todos leem
create policy "ws_select" on public.work_schedules for select using (true);
create policy "ws_write"  on public.work_schedules for all  using (barber_id = auth.uid());

-- APPOINTMENTS: cliente vê os seus; barbeiro vê os dele; adm vê todos
create policy "appt_select" on public.appointments for select using (
  client_id = auth.uid() or barber_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'adm')
);
create policy "appt_insert" on public.appointments for insert with check (client_id = auth.uid());
create policy "appt_update" on public.appointments for update using (
  barber_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'adm')
);

-- MESSAGES: só sender ou receiver lê
create policy "msg_select" on public.messages for select using (
  sender_id = auth.uid() or receiver_id = auth.uid()
);
create policy "msg_insert" on public.messages for insert with check (sender_id = auth.uid());
create policy "msg_update" on public.messages for update using (receiver_id = auth.uid());

-- ============================================================
--  SERVIÇOS PADRÃO (altere os preços conforme necessário)
-- ============================================================
insert into public.services (name, description, price, duration_min, badge) values
  ('Corte Masculino', 'Corte personalizado com acabamento.', 45.00, 45, null),
  ('Barba', 'Modelagem e acabamento com toalha quente.', 35.00, 30, null),
  ('Corte + Barba', 'Combo completo para visual impecável.', 70.00, 60, 'MAIS ESCOLHIDO'),
  ('Sobrancelha', 'Design e alinhamento.', 20.00, 20, null),
  ('Pigmentação Capilar', 'Realce e preenchimento capilar.', 40.00, 45, null);

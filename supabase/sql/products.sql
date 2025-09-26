create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  category text,
  unit text default 'UND',
  price numeric(14,2) not null default 0,
  cost numeric(14,2) not null default 0,
  stock numeric(14,4) not null default 0,
  created_at timestamptz not null default now()
);
alter table products enable row level security;
create table if not exists roles (key text primary key, description text);
insert into roles(key,description) values ('admin','Administrador') on conflict do nothing;
create table if not exists app_users (id uuid primary key, email text unique, display_name text, role_key text references roles(key) default 'admin');
create policy "read_products_auth" on products for select using (auth.uid() is not null);
create policy "write_products_admin" on products for all using (exists (select 1 from app_users u where u.id = auth.uid() and u.role_key='admin'));

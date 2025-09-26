create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_id text,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now()
);
alter table suppliers enable row level security;
create policy "read_suppliers_auth" on suppliers for select using (auth.uid() is not null);
create policy "write_suppliers_admin" on suppliers for all using (exists (select 1 from app_users u where u.id=auth.uid() and u.role_key='admin'));

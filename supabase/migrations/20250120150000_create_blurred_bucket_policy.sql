-- Create images table
create table images (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  original_url text not null,
  blurred_url text not null,
  price numeric not null
);

-- Enable RLS
alter table images enable row level security;

-- Create policies
create policy "Allow public read access" on images
  for select using (true);

create policy "Allow insert access" on images
  for insert with check (true);

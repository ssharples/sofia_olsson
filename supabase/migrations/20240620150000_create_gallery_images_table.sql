-- Drop existing table if it exists
drop table if exists images;

-- Create gallery_images table
create table gallery_images (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  original_url text not null,
  blurred_url text not null,
  price numeric not null
);

-- Enable RLS
alter table gallery_images enable row level security;

-- Create policies
create policy "Allow public read access" on gallery_images
  for select using (true);

create policy "Allow insert access" on gallery_images
  for insert with check (true);

-- Create trigger using pg_net
create or replace function process_new_image() returns trigger as $$
declare
  response text;
begin
  select net.http_post(
    'http://localhost:54321/functions/v1/process-new-image',
    json_build_object(
      'record', json_build_object(
        'id', new.id,
        'original_url', new.original_url
      )
    )::text,
    'application/json'
  ) into response;

  return new;
end;
$$ language plpgsql;

create trigger on_new_gallery_image
  after insert on gallery_images
  for each row
  execute function process_new_image();

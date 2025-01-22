-- Enable the pg_net extension
create extension if not exists pg_net with schema extensions;

-- Remove any supabase_functions references
drop extension if exists supabase_functions;

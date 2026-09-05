create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz default now(),
  unique(requester_id, receiver_id)
);

alter table friendships enable row level security;

drop policy if exists "Users can see their own friendships" on friendships;
create policy "Users can see their own friendships" on friendships for select 
using (auth.uid() = requester_id or auth.uid() = receiver_id);

drop policy if exists "Users can insert friendships" on friendships;
create policy "Users can insert friendships" on friendships for insert 
with check (auth.uid() = requester_id);

drop policy if exists "Users can update their friendships" on friendships;
create policy "Users can update their friendships" on friendships for update 
using (auth.uid() = requester_id or auth.uid() = receiver_id);

drop policy if exists "Users can delete their friendships" on friendships;
create policy "Users can delete their friendships" on friendships for delete 
using (auth.uid() = requester_id or auth.uid() = receiver_id);

-- Make sure profiles are readable by authenticated users for search
drop policy if exists "Authenticated users can read profiles" on profiles;
create policy "Authenticated users can read profiles" on profiles for select 
using (auth.role() = 'authenticated');

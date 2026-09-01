-- Run this in Supabase SQL Editor if not already done
create table if not exists friend_games (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  host_id uuid not null references auth.users(id) on delete cascade,
  host_name text,
  host_color text default 'w' check (host_color in ('w', 'b')),
  guest_id uuid references auth.users(id) on delete set null,
  guest_name text,
  fen text not null default 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  last_move text,
  status text default 'waiting' check (status in ('waiting', 'active', 'checkmate', 'draw', 'abandoned')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table friend_games enable row level security;

drop policy if exists "read all friend games" on friend_games;
create policy "read all friend games" on friend_games for select using (true);

drop policy if exists "host can create" on friend_games;
create policy "host can create" on friend_games for insert with check (auth.uid() = host_id);

drop policy if exists "players can update" on friend_games;
create policy "players can update" on friend_games for update using (
  auth.uid() = host_id OR auth.uid() = guest_id OR guest_id IS NULL
);

-- Enable realtime
alter publication supabase_realtime add table friend_games;

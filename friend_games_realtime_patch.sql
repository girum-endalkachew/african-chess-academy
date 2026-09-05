-- Optional: run in Supabase SQL Editor for clocks + winner tracking
alter table friend_games add column if not exists host_time_ms int default 600000;
alter table friend_games add column if not exists guest_time_ms int default 600000;
alter table friend_games add column if not exists winner_id uuid references auth.users(id);
alter table friend_games add column if not exists pgn text;

-- Ensure realtime is on
-- alter publication supabase_realtime add table friend_games;

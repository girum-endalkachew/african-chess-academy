-- =========================================================
-- ACA PLATFORM — DEMO SEED DATA (FULLY SCHEMA-SAFE)
-- =========================================================

alter table public.tournaments drop constraint if exists tournaments_status_check;

alter table public.tournaments add column if not exists start_date timestamptz;
alter table public.tournaments add column if not exists tournament_date timestamptz;
alter table public.tournaments add column if not exists format text;
alter table public.tournaments add column if not exists status text;
alter table public.tournaments add column if not exists description text;

alter table public.events add column if not exists start_date timestamptz;
alter table public.events add column if not exists event_date timestamptz;
alter table public.events add column if not exists type text;
alter table public.events add column if not exists description text;

alter table public.news add column if not exists category text;
alter table public.news add column if not exists content text;

alter table public.lessons add column if not exists duration_minutes integer;
alter table public.lessons add column if not exists sort_order integer;
alter table public.lessons add column if not exists is_published boolean default true;
alter table public.lessons add column if not exists board_fen text;
alter table public.lessons add column if not exists board_note text;
alter table public.lessons add column if not exists summary text;

insert into public.courses (id, title, level, description, total_lessons, created_at)
values
  ('3ec02008-7738-44b3-9f8c-fc3e6fe19a04', 'Chess Fundamentals', 'Beginner', 'Master the chessboard, piece moves, basic rules, and fundamental checkmates.', 12, now()),
  ('c59e4079-ea70-4a3d-a171-16b7e9441e1a', 'Tactical Patterns & Combinations', 'Intermediate', 'Sharpen your tactical vision with pins, forks, skewers, and mating nets.', 18, now()),
  ('39657c1b-52b0-4198-907b-8d6a452431ec', 'Endgame Mastery & Principles', 'Advanced', 'Learn essential king & pawn, rook, and minor piece endgame techniques.', 16, now())
on conflict (id) do update set title = excluded.title, level = excluded.level, description = excluded.description, total_lessons = excluded.total_lessons;

insert into public.lessons (id, course_id, title, summary, content, duration_minutes, sort_order, is_published, board_fen, board_note)
values
  ('5f07fa01-3275-4afe-b117-90e5d55641ea', '3ec02008-7738-44b3-9f8c-fc3e6fe19a04', $$Welcome to Chess$$, $$Understanding the board, file & rank coordinates, and starting setup.$$, $$Chess is played on an 8x8 grid of 64 squares with alternating light and dark colors.$$, 10, 1, true, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', $$Standard starting position of the 32 pieces.$$),
  ('e5874b0d-d5db-4afe-b117-90e5d5564122', '3ec02008-7738-44b3-9f8c-fc3e6fe19a04', $$How the Pieces Move$$, $$Learn how Rooks, Bishops, Knights, Queens, Kings, and Pawns maneuver.$$, $$Each piece possesses unique movement capabilities.$$, 15, 2, true, 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', $$White controls the center with 1. e4.$$),
  ('84492ef0-1f13-489c-b186-86a6a0d5f0fa', '3ec02008-7738-44b3-9f8c-fc3e6fe19a04', $$Fool's Mate & Basic Checks$$, $$Discover the fastest possible checkmate in chess and how to avoid early traps.$$, $$Fool's Mate occurs after 1. f3 e5 2. g4 Qh4#.$$, 12, 3, true, 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3', $$Black delivers checkmate on h4.$$)
on conflict (id) do update set title = excluded.title, summary = excluded.summary, content = excluded.content, board_fen = excluded.board_fen, board_note = excluded.board_note;

insert into public.tournaments (id, title, description, format, status, start_date, tournament_date, created_at)
values
  ('11111111-1111-1111-1111-111111111111', $$ACA Monthly Blitz Championship$$, $$Fast-paced 5+0 blitz tournament open to all academy students. Climb the leaderboard and earn rating points!$$, 'Swiss 7 Rounds', 'open', now() + interval '3 days', now() + interval '3 days', now()),
  ('22222222-2222-2222-2222-222222222222', $$African Junior Rapid Qualifier$$, $$Official qualification tournament for youth players across Africa. Top 8 advance to finals.$$, 'Rapid 10+5', 'upcoming', now() + interval '10 days', now() + interval '10 days', now())
on conflict (id) do update set title = excluded.title, description = excluded.description, status = excluded.status;

insert into public.events (id, title, type, description, start_date, event_date, created_at)
values
  ('33333333-3333-3333-3333-333333333333', $$Grandmaster Opening Preparation Masterclass$$, 'Live Webinar', $$Live interactive webinar with ACA Grandmaster coaches covering modern opening choices and pawn structures.$$, now() + interval '5 days', now() + interval '5 days', now()),
  ('44444444-4444-4444-4444-444444444444', $$Middlegame Calculation & Decision Making Clinic$$, 'Interactive Workshop', $$Practical workshop focusing on candidate moves, visualization, and time management in critical positions.$$, now() + interval '12 days', now() + interval '12 days', now())
on conflict (id) do update set title = excluded.title, description = excluded.description;

insert into public.news (id, title, category, content, created_at)
values
  ('55555555-5555-5555-5555-555555555555', $$ACA Monthly Blitz Championship Registrations Are Now Live$$, 'Tournament', $$Registrations for the upcoming monthly blitz tournament are officially open.$$, now()),
  ('66666666-6666-6666-6666-666666666666', $$New Tactical Patterns Learning Path Released$$, 'Courses', $$We are excited to announce 18 new interactive lessons covering intermediate tactics, forks, pins, and skewers.$$, now())
on conflict (id) do update set title = excluded.title, content = excluded.content;

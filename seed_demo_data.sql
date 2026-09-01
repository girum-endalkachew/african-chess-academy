-- =========================================================
-- ACA PLATFORM — DEMO SEED DATA
-- Run this once in Supabase SQL Editor
-- =========================================================

-- 1. SEED COURSES
insert into public.courses (id, title, level, description, total_lessons, created_at)
values
  ('3ec02008-7738-44b3-9f8c-fc3e6fe19a04', 'Chess Fundamentals', 'Beginner', 'Master the chessboard, piece moves, basic rules, and fundamental checkmates.', 12, now()),
  ('c59e4079-ea70-4a3d-a171-16b7e9441e1a', 'Tactical Patterns & Combinations', 'Intermediate', 'Sharpen your tactical vision with pins, forks, skewers, and mating nets.', 18, now()),
  ('39657c1b-52b0-4198-907b-8d6a452431ec', 'Endgame Mastery & Principles', 'Advanced', 'Learn essential king & pawn, rook, and minor piece endgame techniques.', 16, now())
on conflict (id) do update set
  title = excluded.title,
  level = excluded.level,
  description = excluded.description,
  total_lessons = excluded.total_lessons;

-- 2. SEED SAMPLE LESSONS FOR CHESS FUNDAMENTALS
insert into public.lessons (id, course_id, title, summary, content, duration_minutes, sort_order, is_published, board_fen, board_note)
values
  (
    '5f07fa01-3275-4afe-b117-90e5d55641ea',
    '3ec02008-7738-44b3-9f8c-fc3e6fe19a04',
    'Welcome to Chess',
    'Understanding the board, file & rank coordinates, and starting setup.',
    'Chess is played on an 8x8 grid of 64 squares with alternating light and dark colors. Always make sure a light square is on your right-hand corner ("White on right"). In this lesson, observe the initial array of pieces.',
    10,
    1,
    true,
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'Standard starting position of the 32 pieces.'
  ),
  (
    'e5874b0d-d5db-4acd-89a7-d90cfa6c4212',
    '3ec02008-7738-44b3-9f8c-fc3e6fe19a04',
    'How the Pieces Move',
    'Learn how Rooks, Bishops, Knights, Queens, Kings, and Pawns maneuver.',
    'Each piece possesses unique movement capabilities. Pawns advance forward, Knights jump in an "L" pattern, Bishops move along diagonals, Rooks command open ranks and files, Queens combine Rook and Bishop power, and Kings move one square in any direction.',
    15,
    2,
    true,
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    'White controls the center with 1. e4.'
  ),
  (
    '84492ef0-1f13-489c-b186-86a6a0d5f0fa',
    '3ec02008-7738-44b3-9f8c-fc3e6fe19a04',
    'Fool\'s Mate & Basic Checks',
    'Discover the fastest possible checkmate in chess and how to avoid early traps.',
    'Fool\'s Mate occurs after 1. f3 e5 2. g4 Qh4#. It highlights the critical weakness along the e1-h4 diagonal leading to White\'s king.',
    12,
    3,
    true,
    'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3',
    'Black delivers checkmate on h4.'
  )
on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  board_fen = excluded.board_fen,
  board_note = excluded.board_note;

-- 3. SEED SAMPLE LESSONS FOR TACTICAL PATTERNS
insert into public.lessons (id, course_id, title, summary, content, duration_minutes, sort_order, is_published, board_fen, board_note)
values
  (
    '7c6fd5a7-f828-4130-973f-d2ca9775cc2f',
    'c59e4079-ea70-4a3d-a171-16b7e9441e1a',
    'Tactics Mindset & Fried Liver Trap',
    'Learn how double threats create forced winning positions.',
    'Tactics are short-term sequence of moves that lead to tangible advantages such as winning material or checkmating. The Fried Liver Attack targets the vulnerable f7 square.',
    15,
    1,
    true,
    'r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 4 4',
    'White attacks f7 with Knight and Bishop.'
  ),
  (
    'db599870-3345-42c8-9914-a76e9cd76c28',
    'c59e4079-ea70-4a3d-a171-16b7e9441e1a',
    'Knight Forks in Action',
    'Exploit the unique geometry of the Knight to fork King and Rook.',
    'A fork is a tactical maneuver where a single piece attacks two or more enemy pieces simultaneously. Knights are legendary forkers due to their ability to jump over pieces.',
    15,
    2,
    true,
    'r1bqkb1r/pppp1Npp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 5',
    'Nxf7 forks Black\'s Queen and Rook!'
  )
on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  board_fen = excluded.board_fen;

-- 4. SEED TOURNAMENTS
insert into public.tournaments (id, title, description, format, status, start_date, created_at)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'ACA Monthly Blitz Championship',
    'Fast-paced 5+0 blitz tournament open to all academy students. Climb the leaderboard and earn rating points!',
    'Swiss 7 Rounds',
    'Open',
    now() + interval '3 days',
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'African Junior Rapid Qualifier',
    'Official qualification tournament for youth players across Africa. Top 8 advance to finals.',
    'Rapid 10+5',
    'Upcoming',
    now() + interval '10 days',
    now()
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  status = excluded.status;

-- 5. SEED EVENTS & WEBINARS
insert into public.events (id, title, type, description, start_date, created_at)
values
  (
    '33333333-3333-3333-3333-333333333333',
    'Grandmaster Opening Preparation Masterclass',
    'Live interactive webinar with ACA Grandmaster coaches covering modern opening choices and pawn structures.',
    'Live Webinar',
    now() + interval '5 days',
    now()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Middlegame Calculation & Decision Making Clinic',
    'Practical workshop focusing on candidate moves, visualization, and time management in critical positions.',
    'Interactive Workshop',
    now() + interval '12 days',
    now()
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description;

-- 6. SEED NEWS & ARTICLES
insert into public.news (id, title, category, content, created_at)
values
  (
    '55555555-5555-5555-5555-555555555555',
    'ACA Monthly Blitz Championship Registrations Are Now Live',
    'Tournament',
    'Registrations for the upcoming monthly blitz tournament are officially open. All enrolled students are invited to test their skills!',
    now()
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'New Tactical Patterns Learning Path Released',
    'Courses',
    'We are excited to announce 18 new interactive lessons covering intermediate tactics, forks, pins, and skewers.',
    now()
  )
on conflict (id) do update set
  title = excluded.title,
  content = excluded.content;

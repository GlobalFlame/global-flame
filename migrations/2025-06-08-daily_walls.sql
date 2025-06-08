CREATE TABLE IF NOT EXISTS public.daily_walls (
  id SERIAL PRIMARY KEY,
  wall_type TEXT NOT NULL CHECK (wall_type IN ('men', 'women', 'children')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Drop if exists
DROP TABLE IF EXISTS card_sayings, sent_cards CASCADE;

-- Create tables
CREATE TABLE card_sayings (
  id SERIAL PRIMARY KEY,
  text VARCHAR(200) NOT NULL
);
CREATE TABLE sent_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saying_id INT REFERENCES card_sayings(id),
  recipient_phone VARCHAR(20) NOT NULL,
  tip_amount NUMERIC(10,2) NOT NULL CHECK (tip_amount >= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 10 initial sayings
INSERT INTO card_sayings (text) VALUES
  ('Your soul’s my forever spark 💖'),
  ('One kiss, reality shatters 💋'),
  ('Love so loud it breaks stars 🌟'),
  ('Our flame burns eternal 🔥'),
  ('Heartbeats rewrite the universe ❤️'),
  ('Kiss so deep, time stands still ⏳'),
  ('Two hearts, one beat 🥁'),
  ('Soul fireworks light the sky 🎆'),
  ('Infinite love, zero limits ∞'),
  ('You + me = cosmic explosion 🌌');

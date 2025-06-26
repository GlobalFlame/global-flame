-- elder_payments
CREATE TABLE IF NOT EXISTS elder_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  village_id UUID NOT NULL,
  elder_phone TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 5.00),
  bonus NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  currency_profile CHAR(2),
  payout_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- user_locks
CREATE TABLE IF NOT EXISTS user_locks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  violation_id INT NOT NULL,
  lock_reason TEXT NOT NULL,
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  unlocked_at TIMESTAMPTZ
);

-- village_tech
CREATE TABLE IF NOT EXISTS village_tech (
  id SERIAL PRIMARY KEY,
  village_id UUID NOT NULL,
  status TEXT CHECK (status IN ('online', 'offline', 'help')),
  battery NUMERIC,
  signal TEXT,
  last_check TIMESTAMPTZ DEFAULT NOW()
);

-- currency_profiles
CREATE TABLE IF NOT EXISTS currency_profiles (
  country_code CHAR(2) PRIMARY KEY,
  currency VARCHAR(10) NOT NULL,
  usd_rate NUMERIC NOT NULL,
  margin_cap NUMERIC DEFAULT 0.05
);

INSERT INTO currency_profiles VALUES
('CD', 'CDF', 0.00037, 0.03),
('PS', 'ILS', 0.28, 0.05),
('UA', 'UAH', 0.027, 0.02)
ON CONFLICT (country_code) DO NOTHING;

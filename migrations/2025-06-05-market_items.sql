CREATE TABLE market_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  category VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0.01 AND price <= 20.00),
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE market_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  file_path VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

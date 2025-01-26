-- Create quotes table
CREATE TABLE quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  urgency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster lookups
CREATE INDEX idx_quotes_status ON quotes(status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON quotes
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


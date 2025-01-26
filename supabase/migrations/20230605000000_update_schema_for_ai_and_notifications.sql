-- Add new columns to the quotes table
ALTER TABLE quotes
ADD COLUMN priority_score INTEGER,
ADD COLUMN priority_explanation TEXT,
ADD COLUMN recommended_plumber_id UUID REFERENCES plumbers(id),
ADD COLUMN recommendation_explanation TEXT;

-- Create quote_responses table
CREATE TABLE quote_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) NOT NULL,
  plumber_id UUID REFERENCES plumbers(id) NOT NULL,
  response TEXT NOT NULL,
  estimated_cost DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on quote_id for faster lookups
CREATE INDEX idx_quote_responses_quote_id ON quote_responses(quote_id);

-- Create trigger to automatically update quotes.status when a response is added
CREATE OR REPLACE FUNCTION update_quote_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE quotes
  SET status = 'responded'
  WHERE id = NEW.quote_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quote_status
AFTER INSERT ON quote_responses
FOR EACH ROW
EXECUTE FUNCTION update_quote_status();


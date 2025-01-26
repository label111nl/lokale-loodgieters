-- Update the plumbers table
ALTER TABLE plumbers
ADD COLUMN IF NOT EXISTS kvk_nummer TEXT,
ADD COLUMN IF NOT EXISTS btw_nummer TEXT,
ADD COLUMN IF NOT EXISTS voornaam TEXT,
ADD COLUMN IF NOT EXISTS achternaam TEXT,
ADD COLUMN IF NOT EXISTS adres TEXT,
ADD COLUMN IF NOT EXISTS postcode TEXT,
ADD COLUMN IF NOT EXISTS stad TEXT,
ADD COLUMN IF NOT EXISTS diensten TEXT[],
ADD COLUMN IF NOT EXISTS werkgebied TEXT[],
ADD COLUMN IF NOT EXISTS jaren_ervaring TEXT,
ADD COLUMN IF NOT EXISTS certificeringen TEXT[],
ADD COLUMN IF NOT EXISTS abonnement TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT 'pay_per_lead',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Add any necessary indexes
CREATE INDEX IF NOT EXISTS idx_plumbers_province ON plumbers(province);
CREATE INDEX IF NOT EXISTS idx_plumbers_abonnement ON plumbers(abonnement);

CREATE TABLE IF NOT EXISTS credit_purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plumber_id UUID REFERENCES plumbers(id),
  amount INTEGER NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lead_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plumber_id UUID REFERENCES plumbers(id),
  lead_id UUID REFERENCES leads(id),
  credits_used INTEGER NOT NULL,
  response_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


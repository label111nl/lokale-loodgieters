-- Create provinces table
CREATE TABLE provinces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cities table
CREATE TABLE cities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    province_id UUID REFERENCES provinces(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(province_id, slug)
);

-- Create indexes
CREATE INDEX cities_province_id_idx ON cities(province_id);
CREATE INDEX cities_slug_idx ON cities(slug);
CREATE INDEX provinces_slug_idx ON provinces(slug);

-- Insert some initial data
INSERT INTO provinces (name, slug) VALUES
    ('Noord-Holland', 'noord-holland'),
    ('Zuid-Holland', 'zuid-holland'),
    ('Utrecht', 'utrecht'),
    ('Noord-Brabant', 'noord-brabant'),
    ('Gelderland', 'gelderland');

-- Insert cities for Noord-Holland
WITH province AS (SELECT id FROM provinces WHERE slug = 'noord-holland')
INSERT INTO cities (name, slug, province_id) VALUES
    ('Amsterdam', 'amsterdam', (SELECT id FROM province)),
    ('Haarlem', 'haarlem', (SELECT id FROM province)),
    ('Alkmaar', 'alkmaar', (SELECT id FROM province)),
    ('Zaandam', 'zaandam', (SELECT id FROM province));

-- Insert cities for Zuid-Holland
WITH province AS (SELECT id FROM provinces WHERE slug = 'zuid-holland')
INSERT INTO cities (name, slug, province_id) VALUES
    ('Rotterdam', 'rotterdam', (SELECT id FROM province)),
    ('Den Haag', 'den-haag', (SELECT id FROM province)),
    ('Leiden', 'leiden', (SELECT id FROM province)),
    ('Dordrecht', 'dordrecht', (SELECT id FROM province));

